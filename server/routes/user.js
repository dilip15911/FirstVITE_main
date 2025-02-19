const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/emailService');
const pool = require('../database/db');
const { authLimiter } = require('../middleware/security');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Signup route
router.post('/signup', authLimiter, async (req, res) => {
  console.log('Signup request received:', req.body);
  
  const { name, email, password } = req.body;
  let connection;

  try {
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required'
      });
    }

    // Name validation
    if (name.length < 2) {
      return res.status(400).json({
        message: 'Name must be at least 2 characters long'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Please enter a valid email address'
      });
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      });
    }

    // Get database connection
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check if email exists
    const [existingUsers] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = generateOTP();

    // Insert user
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, email_verified) VALUES (?, ?, ?, FALSE)',
      [name, email, hashedPassword]
    );

    // Store verification code
    await connection.query(
      'INSERT INTO verification_codes (user_id, code, type, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))',
      [result.insertId, verificationCode, 'email_verification']
    );

    // Send verification email
    await sendVerificationEmail(email, name, verificationCode);

    // Commit transaction
    await connection.commit();

    // Generate token
    const token = jwt.sign(
      { userId: result.insertId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
      token,
      user: {
        id: result.insertId,
        name,
        email,
        email_verified: false
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    if (connection) {
      await connection.rollback();
    }
    res.status(500).json({
      message: 'An error occurred during registration. Please try again.'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Verify email route
router.post('/verify-email', async (req, res) => {
  const { email, code } = req.body;
  let connection;

  try {
    connection = await pool.getConnection();

    // Get user and verification code
    const [users] = await connection.query(
      'SELECT u.id, vc.code, vc.expires_at FROM users u ' +
      'JOIN verification_codes vc ON u.id = vc.user_id ' +
      'WHERE u.email = ? AND vc.type = "email_verification" ' +
      'ORDER BY vc.created_at DESC LIMIT 1',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({
        message: 'Invalid verification attempt'
      });
    }

    const user = users[0];

    // Check if code is expired
    if (new Date() > new Date(user.expires_at)) {
      return res.status(400).json({
        message: 'Verification code has expired'
      });
    }

    // Verify code
    if (code !== user.code) {
      return res.status(400).json({
        message: 'Invalid verification code'
      });
    }

    // Update user verification status
    await connection.query(
      'UPDATE users SET email_verified = TRUE WHERE id = ?',
      [user.id]
    );

    // Delete used verification code
    await connection.query(
      'DELETE FROM verification_codes WHERE user_id = ? AND type = "email_verification"',
      [user.id]
    );

    res.json({
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      message: 'An error occurred during email verification'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Login route
router.post('/login', authLimiter, async (req, res) => {
  console.log('Login request received:', req.body);
  
  const { email, password } = req.body;
  let connection;

  try {
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Get database connection
    connection = await pool.getConnection();

    // Get user
    const [users] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in'
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from user object
    delete user.password;

    res.json({
      message: 'Login successful',
      token,
      user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'An error occurred during login'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Local Login with remember me
router.post('/local-login', authLimiter, async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const connection = await pool.getConnection();

  try {
    // Get user
    const [users] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '1d' }
    );

    // Update last login
    await connection.query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    res.json({
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during login' });
  } finally {
    connection.release();
  }
});

// Forgot Password
router.post('/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body;
  let connection;

  console.log('Forgot password request received for email:', email);

  try {
    connection = await pool.getConnection();
    console.log('Database connection established');

    // Check if user exists
    const [users] = await connection.query(
      'SELECT id, name FROM users WHERE email = ?',
      [email]
    );

    console.log('User lookup result:', { found: users.length > 0 });

    if (users.length === 0) {
      // Return success even if email doesn't exist (security through obscurity)
      return res.json({ message: 'If your email is registered, you will receive a reset code' });
    }

    const user = users[0];

    // Generate reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated reset code for user:', { userId: user.id });
    
    // Start transaction
    await connection.beginTransaction();
    console.log('Started database transaction');

    // Delete any existing reset codes for this user
    await connection.query(
      'DELETE FROM verification_codes WHERE user_id = ? AND type = "password_reset"',
      [user.id]
    );
    console.log('Deleted existing reset codes');

    // Store reset code
    await connection.query(
      'INSERT INTO verification_codes (user_id, code, type, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))',
      [user.id, resetCode, 'password_reset']
    );
    console.log('Stored new reset code');

    try {
      // Send reset email
      const { sendPasswordResetEmail } = require('../utils/emailService');
      await sendPasswordResetEmail(email, resetCode);
      console.log('Reset email sent successfully');

      // Commit transaction
      await connection.commit();
      console.log('Transaction committed');

      res.json({ message: 'If your email is registered, you will receive a reset code' });
    } catch (emailError) {
      console.error('Failed to send reset email:', {
        error: emailError.message,
        code: emailError.code,
        command: emailError.command,
        stack: emailError.stack
      });
      
      await connection.rollback();
      throw emailError;
    }
  } catch (error) {
    console.error('Error in forgot password:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      stack: error.stack
    });

    if (connection) {
      try {
        await connection.rollback();
        console.log('Transaction rolled back');
      } catch (rollbackError) {
        console.error('Error rolling back transaction:', rollbackError);
      }
    }

    // Send a generic error message to the client
    res.status(500).json({ 
      message: 'An error occurred while processing your request. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    if (connection) {
      connection.release();
      console.log('Database connection released');
    }
  }
});

// Verify Reset Code
router.post('/verify-reset-code', authLimiter, async (req, res) => {
  const { email, code } = req.body;
  const connection = await pool.getConnection();

  try {
    // Get user and verify code
    const [users] = await connection.query(
      'SELECT u.id FROM users u JOIN verification_codes vc ON u.id = vc.user_id WHERE u.email = ? AND vc.code = ? AND vc.type = "password_reset" AND vc.expires_at > NOW()',
      [email, code]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    res.json({ message: 'Code verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying code' });
  } finally {
    connection.release();
  }
});

// Reset Password
router.post('/reset-password', authLimiter, async (req, res) => {
  const { email, code, newPassword } = req.body;
  const connection = await pool.getConnection();

  try {
    // Validate new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      });
    }

    // Get user and verify code
    const [users] = await connection.query(
      'SELECT u.id FROM users u JOIN verification_codes vc ON u.id = vc.user_id WHERE u.email = ? AND vc.code = ? AND vc.type = "password_reset" AND vc.expires_at > NOW()',
      [email, code]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    const user = users[0];

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await connection.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, user.id]
    );

    // Delete used reset code
    await connection.query(
      'DELETE FROM verification_codes WHERE user_id = ? AND type = "password_reset"',
      [user.id]
    );

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting password' });
  } finally {
    connection.release();
  }
});

// Google OAuth handler
router.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  const connection = await pool.getConnection();

  try {
    // Verify Google token
    const { OAuth2Client } = require('google-auth-library');
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { email, name, picture, email_verified } = ticket.getPayload();

    if (!email_verified) {
      return res.status(400).json({ message: 'Email not verified with Google' });
    }

    // Check if user exists
    const [users] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    let user;

    if (users.length === 0) {
      // Create new user
      const [result] = await connection.query(
        'INSERT INTO users (name, email, email_verified, profile_picture, auth_provider) VALUES (?, ?, true, ?, "google")',
        [name, email, picture]
      );

      user = {
        id: result.insertId,
        name,
        email,
        profile_picture: picture
      };
    } else {
      user = users[0];
      
      // Update existing user's Google info
      await connection.query(
        'UPDATE users SET name = ?, profile_picture = ?, auth_provider = "google" WHERE id = ?',
        [name, picture, user.id]
      );
    }

    // Generate token
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Update last login
    await connection.query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    res.json({
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_picture: user.profile_picture
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Error authenticating with Google' });
  } finally {
    connection.release();
  }
});

// Google Login/Signup
router.post('/google', async (req, res) => {
  const { token } = req.body;
  const connection = await pool.getConnection();

  try {
    // Verify Google token
    const { OAuth2Client } = require('google-auth-library');
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { name, email, picture, sub: googleId } = ticket.getPayload();

    // Check if user exists
    const [users] = await connection.query(
      'SELECT * FROM users WHERE email = ? OR google_id = ?',
      [email, googleId]
    );

    let user;

    if (users.length === 0) {
      // Create new user
      const [result] = await connection.query(
        'INSERT INTO users (name, email, google_id, email_verified, profile_picture) VALUES (?, ?, ?, TRUE, ?)',
        [name, email, googleId, picture]
      );

      user = {
        id: result.insertId,
        name,
        email,
        profilePicture: picture
      };
    } else {
      user = users[0];
      
      // Update Google ID if not set
      if (!user.google_id) {
        await connection.query(
          'UPDATE users SET google_id = ?, email_verified = TRUE WHERE id = ?',
          [googleId, user.id]
        );
      }
    }

    // Generate token
    const jwtToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profile_picture
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error with Google authentication' });
  } finally {
    connection.release();
  }
});

// Generate OTP for login
router.post('/user/generate-login-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Delete any existing OTPs for this user
    await pool.query(
      'DELETE FROM verification_codes WHERE user_id = ? AND type = "login_otp"',
      [user.id]
    );

    // Save OTP to database
    await pool.query(
      'INSERT INTO verification_codes (user_id, code, type, expires_at) VALUES (?, ?, ?, ?)',
      [user.id, otp, 'login_otp', expiresAt]
    );

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Login OTP',
      html: `
        <h1>Login OTP</h1>
        <p>Your OTP for login is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ message: 'Failed to generate OTP' });
  }
});

// Verify OTP for login
router.post('/user/verify-login-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Get user and their latest unexpired OTP
    const [users] = await pool.query(
      'SELECT u.id, u.name, u.email, vc.code, vc.expires_at FROM users u ' +
      'LEFT JOIN verification_codes vc ON u.id = vc.user_id ' +
      'WHERE u.email = ? AND vc.type = "login_otp" ' +
      'AND vc.expires_at > NOW() ' +
      'ORDER BY vc.created_at DESC LIMIT 1',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    const user = users[0];

    // Verify OTP
    if (user.code !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Delete used OTP
    await pool.query(
      'DELETE FROM verification_codes WHERE user_id = ? AND type = "login_otp"',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

// Generate login link
router.post('/generate-login-link', async (req, res) => {
  const { email } = req.body;
  let connection;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    connection = await pool.getConnection();

    // Check if user exists
    const [users] = await connection.query(
      'SELECT id, name, email FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const user = users[0];
    const token = jwt.sign(
      { userId: user.id, type: 'login_link' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Store token in database
    await connection.query(
      'INSERT INTO verification_codes (user_id, code, type, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))',
      [user.id, token, 'login_link']
    );

    // Generate login link
    const loginLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login/verify?token=${token}`;

    // Send email with login link
    const emailContent = `
      <h2>Login Link</h2>
      <p>Hello ${user.name},</p>
      <p>Click the link below to log in to your account:</p>
      <p><a href="${loginLink}">Login to Your Account</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this link, please ignore this email.</p>
    `;

    await sendVerificationEmail(email, user.name, emailContent);

    res.json({ message: 'Login link has been sent to your email' });
  } catch (error) {
    console.error('Generate login link error:', error);
    res.status(500).json({ message: 'Failed to generate login link' });
  } finally {
    if (connection) connection.release();
  }
});

// Verify login link
router.post('/verify-login-link', async (req, res) => {
  const { token } = req.body;
  let connection;

  try {
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'login_link') {
      return res.status(400).json({ message: 'Invalid token type' });
    }

    connection = await pool.getConnection();

    // Check if token exists and is not expired
    const [tokens] = await connection.query(
      'SELECT * FROM verification_codes WHERE user_id = ? AND code = ? AND type = "login_link" AND expires_at > NOW()',
      [decoded.userId, token]
    );

    if (tokens.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Get user data
    const [users] = await connection.query(
      'SELECT id, name, email FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = users[0];

    // Delete used token
    await connection.query(
      'DELETE FROM verification_codes WHERE user_id = ? AND code = ?',
      [decoded.userId, token]
    );

    // Generate new auth token
    const authToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token: authToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Verify login link error:', error);
    if (error.name === 'JsonWebTokenError') {
      res.status(400).json({ message: 'Invalid token' });
    } else {
      res.status(500).json({ message: 'Failed to verify login link' });
    }
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
