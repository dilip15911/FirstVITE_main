const db = require('../db');

exports.getAllStudents = async (req, res) => {
  try {
    const search = req.query.search || '';
    const [students] = await db.query(
      `SELECT * FROM users WHERE role = 'student' AND 
      (name LIKE ? OR email LIKE ? OR mobile LIKE ?)`,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const [student] = await db.query('SELECT * FROM users WHERE id = ? AND role = ?', 
      [req.params.id, 'student']);
    if (student.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student[0]);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { name, email, mobile, course } = req.body;

    // Check if email already exists
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Insert new student
    const [result] = await db.query(
      'INSERT INTO users (name, email, mobile, role, course) VALUES (?, ?, ?, ?, ?)',
      [name, email, mobile, 'student', course]
    );

    res.status(201).json({ message: 'Student created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { name, email, mobile, course } = req.body;
    const [student] = await db.query('SELECT * FROM users WHERE id = ? AND role = ?', 
      [req.params.id, 'student']);

    if (student.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if email exists for other user
    if (email !== student[0].email) {
      const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    await db.query(
      'UPDATE users SET name = ?, email = ?, mobile = ?, course = ? WHERE id = ?',
      [name, email, mobile, course, req.params.id]
    );

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const [student] = await db.query('SELECT * FROM users WHERE id = ? AND role = ?', 
      [req.params.id, 'student']);

    if (student.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};
