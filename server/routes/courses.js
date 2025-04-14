const express = require('express');
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Public routes
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);

// Protected routes - require authentication
router.use(auth);
router.post('/', admin, courseController.createCourse);
router.put('/:id', admin, courseController.updateCourse);
router.delete('/:id', admin, courseController.deleteCourse);

module.exports = router;
