const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const courseController = require('../controllers/courseController');

// Debug middleware to log all requests
router.use((req, res, next) => {
    console.log(`Course route accessed: ${req.method} ${req.originalUrl}`);
    console.log('Headers:', req.headers);
    next();
});

// Public routes
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);

// Admin routes - prefixed with /admin
const adminRouter = express.Router();
adminRouter.post('/', protect, courseController.createCourse); // Removed restrictTo for testing
adminRouter.get('/:id', protect, courseController.getCourse); // Removed restrictTo for testing
adminRouter.put('/:id', protect, courseController.updateCourse); // Removed restrictTo for testing
adminRouter.delete('/:id', protect, courseController.deleteCourse); // Removed restrictTo for testing

// Instructor course creation route
router.post('/instructor', protect, courseController.createCourse);

// Purchase route
router.post('/:id/purchase', protect, courseController.purchaseCourse);

// Use admin routes under /admin prefix
router.use('/admin', adminRouter);

module.exports = router;
