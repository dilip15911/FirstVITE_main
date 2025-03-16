const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../config/db');
const { sendVerificationEmail } = require('../utils/email');

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Helper function to handle validation errors
const handleValidationErrors = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw { status: 400, errors: errors.array() };
  }
};

// Helper function to handle database errors
const handleDBError = (error) => {
  console.error('Database Error:', error);
  throw { status: 500, message: 'Database error occurred' };
};

// Auth Controller Methods
exports.signup = async (req, res) => {
  try {
    handleValidationErrors(req);
    const { name, email, password } = req.body;

    // Check if user exists
    const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user and verification token
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      await connection.query(
        'INSERT INTO verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [result.insertId, otp, otpExpiry]
      );

      await connection.commit();

      // Send verification email
      await sendVerificationEmail(email, name, otp);

      res.status(201).json({
        success: true,
        userId: result.insertId,
        email,
        message: 'Registration successful! Please check your email for verification.'
      });
    } catch (error) {
      await connection.rollback();
      handleDBError(error);
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error',
      errors: error.errors
    });
  }
};

exports.login = async (req, res) => {
  try {
    handleValidationErrors(req);
    const { email, password } = req.body;

    // Get user
    const [users] = await db.query(
      'SELECT id, name, email, password, is_verified FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if email is verified
    if (!user.is_verified) {
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await db.query(
        'INSERT INTO verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, otp, otpExpiry]
      );

      await sendVerificationEmail(email, user.name, otp);

      return res.status(400).json({
        success: false,
        needsVerification: true,
        userId: user.id,
        email: user.email,
        message: 'Please verify your email first'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Get user data without password
    const { password: _, ...userData } = user;

    res.json({
      success: true,
      token,
      user: userData,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error',
      errors: error.errors
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    handleValidationErrors(req);
    const { userId, otp } = req.body;

    // Check if OTP exists and is valid
    const [tokens] = await db.query(
      'SELECT * FROM verification_tokens WHERE user_id = ? AND token = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [userId, otp]
    );

    if (tokens.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    // Update user verification status
    await db.query('UPDATE users SET is_verified = true WHERE id = ?', [userId]);

    // Delete used token
    await db.query('DELETE FROM verification_tokens WHERE id = ?', [tokens[0].id]);

    res.json({
      success: true,
      message: 'Email verified successfully',
      redirectTo: '/login'
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error',
      errors: error.errors
    });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    handleValidationErrors(req);
    const { userId } = req.body;

    // Get user
    const [users] = await db.query(
      'SELECT name, email FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save new verification token
    await db.query(
      'INSERT INTO verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, otp, otpExpiry]
    );

    // Send verification email
    await sendVerificationEmail(user.email, user.name, otp);

    res.json({
      success: true,
      message: 'Verification code sent! Please check your email.'
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error',
      errors: error.errors
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, mobile, course, created_at, updated_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    handleValidationErrors(req);
    const { name, mobile, course } = req.body;
    const userId = req.user.userId;

    // Start transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Update user profile
      await connection.query(
        'UPDATE users SET name = ?, mobile = ?, course = ? WHERE id = ?',
        [name, mobile, course, userId]
      );

      // Save to history
      await connection.query(
        'INSERT INTO user_history (user_id, name, mobile, course, action_type) VALUES (?, ?, ?, ?, ?)',
        [userId, name, mobile, course, 'UPDATE']
      );

      await connection.commit();

      // Get updated user data
      const [users] = await connection.query(
        'SELECT id, name, email, mobile, course, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      );

      res.json({
        success: true,
        user: users[0],
        message: 'Profile updated successfully'
      });
    } catch (error) {
      await connection.rollback();
      handleDBError(error);
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error',
      errors: error.errors
    });
  }
};

exports.getUserHistory = async (req, res) => {
  try {
    const [history] = await db.query(
      'SELECT * FROM user_history WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );

    res.json({
      success: true,
      history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.restoreProfile = async (req, res) => {
  try {
    const { historyId } = req.body;
    const userId = req.user.userId;

    // Get history record
    const [history] = await db.query(
      'SELECT * FROM user_history WHERE id = ? AND user_id = ?',
      [historyId, userId]
    );

    if (history.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'History record not found'
      });
    }

    const historyRecord = history[0];

    // Start transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Update user profile
      await connection.query(
        'UPDATE users SET name = ?, mobile = ?, course = ? WHERE id = ?',
        [historyRecord.name, historyRecord.mobile, historyRecord.course, userId]
      );

      // Save to history
      await connection.query(
        'INSERT INTO user_history (user_id, name, mobile, course, action_type) VALUES (?, ?, ?, ?, ?)',
        [userId, historyRecord.name, historyRecord.mobile, historyRecord.course, 'RESTORE']
      );

      await connection.commit();

      // Get updated user data
      const [users] = await connection.query(
        'SELECT id, name, email, mobile, course, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      );

      res.json({
        success: true,
        user: users[0],
        message: 'Profile restored successfully'
      });
    } catch (error) {
      await connection.rollback();
      handleDBError(error);
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
