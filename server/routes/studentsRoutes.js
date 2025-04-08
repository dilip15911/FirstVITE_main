const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const pool = require('../config/db');

// Get all students
router.get('/', protect, admin, async (req, res) => {
  try {
    const search = req.query.search || '';
    const [results] = await pool.query(
      `SELECT * FROM students 
       WHERE name LIKE ? 
       OR email LIKE ? 
       OR course LIKE ?`,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );
    res.json(results);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new student
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, email, mobile, course } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !course) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const [[existingStudent]] = await pool.query(
      'SELECT * FROM students WHERE email = ?',
      [email]
    );

    if (existingStudent) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Insert new student
    const [result] = await pool.query(
      'INSERT INTO students (name, email, mobile, course) VALUES (?, ?, ?, ?)',
      [name, email, mobile, course]
    );

    res.status(201).json({ message: 'Student added successfully', id: result.insertId });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, course } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !course) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if student exists
    const [[existingStudent]] = await pool.query(
      'SELECT * FROM students WHERE id = ?',
      [id]
    );

    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update student
    await pool.query(
      'UPDATE students SET name = ?, email = ?, mobile = ?, course = ? WHERE id = ?',
      [name, email, mobile, course, id]
    );

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if student exists
    const [[existingStudent]] = await pool.query(
      'SELECT * FROM students WHERE id = ?',
      [id]
    );

    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete student
    await pool.query(
      'DELETE FROM students WHERE id = ?',
      [id]
    );

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
