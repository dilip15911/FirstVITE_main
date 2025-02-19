const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../database/db');

// Middleware to check admin authentication
const authenticateAdmin = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get admin from database
    const [admins] = await pool.query(
      'SELECT id, username, email, full_name, role FROM admin_users WHERE id = ?',
      [decoded.id]
    );

    if (!admins.length) {
      throw new Error();
    }

    req.admin = admins[0];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin signup
router.post('/signup', async (req, res) => {
  const { username, email, password, fullName, signupCode } = req.body;

  // Verify signup code
  if (signupCode !== process.env.ADMIN_SIGNUP_CODE) {
    return res.status(401).json({ message: 'Invalid signup code' });
  }

  try {
    // Check if username or email already exists
    const [existing] = await pool.query(
      'SELECT id FROM admin_users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const [result] = await pool.query(
      'INSERT INTO admin_users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, fullName]
    );

    // Log activity
    await pool.query(
      'INSERT INTO admin_activity_logs (admin_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [result.insertId, 'SIGNUP', 'Admin account created', req.ip]
    );

    res.status(201).json({ message: 'Admin account created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating admin account' });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Get admin user
    const [admins] = await pool.query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    if (!admins.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = admins[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Log activity
    await pool.query(
      'INSERT INTO admin_activity_logs (admin_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [admin.id, 'LOGIN', 'Admin logged in', req.ip]
    );

    res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.full_name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Get dashboard stats
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    // Get total users count
    const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');
    
    // Get total products count
    const [productCount] = await pool.query('SELECT COUNT(*) as count FROM products');
    
    // Get recent orders
    const [recentOrders] = await pool.query(
      'SELECT o.id, u.name as customer, o.total_amount as amount, o.status ' +
      'FROM orders o ' +
      'JOIN users u ON o.user_id = u.id ' +
      'ORDER BY o.created_at DESC ' +
      'LIMIT 5'
    );
    
    res.json({
      totalUsers: userCount[0].count,
      totalProducts: productCount[0].count,
      recentOrders
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;
