const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const studentController = require('../controllers/studentController');

// Protect all routes
router.use(protect);

// Get all students
router.get('/', restrictTo('admin'), studentController.getAllStudents);

// Get student by ID
router.get('/:id', restrictTo('admin'), studentController.getStudent);

// Create new student
router.post('/', restrictTo('admin'), studentController.createStudent);

// Update student
router.put('/:id', restrictTo('admin'), studentController.updateStudent);

// Delete student
router.delete('/:id', restrictTo('admin'), studentController.deleteStudent);

module.exports = router;
