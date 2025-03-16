const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const { dbConfig } = require('../config/database');

const pool = mysql.createPool(dbConfig);

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const connection = await pool.getConnection();

      try {
        const [users] = await connection.execute(
          'SELECT id, name, email FROM users WHERE id = ?',
          [decoded.id]
        );

        if (users.length === 0) {
          return res.status(401).json({ message: 'User not found' });
        }

        req.user = users[0];
        next();
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error in auth middleware' });
  }
};
