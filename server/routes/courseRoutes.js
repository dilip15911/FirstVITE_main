const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const courseController = require('../controllers/courseController');
const categoryController = require('../controllers/categoryController');
const userController = require('../controllers/userController');
const { pool } = require('../config/db');

// Database connection middleware
router.use((req, res, next) => {
    req.pool = pool;
    next();
});

// Enable CORS for all routes
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Debug middleware to log all requests
router.use((req, res, next) => {
    console.log(`Course route accessed: ${req.method} ${req.originalUrl}`);
    console.log('Headers:', req.headers);
    next();
});

// Course Management Routes
router.get('/', protect, admin, courseController.getCourses); // Get all courses
router.get('/:id', protect, admin, courseController.getCourse); // Get single course
router.post('/', protect, admin, courseController.createCourse); // Create course
router.put('/:id', protect, admin, courseController.updateCourse); // Update course
router.delete('/:id', protect, admin, courseController.deleteCourse); // Delete course
router.get('/settings', protect, admin, courseController.getCourseSettings); // Get course settings

// Categories
router.get('/categories', protect, admin, categoryController.getAllCategories);

// Instructors
router.get('/users/instructors', protect, admin, userController.getInstructors);

// Purchase route
router.post('/:id/purchase', protect, courseController.purchaseCourse);

// Course Statistics
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const connection = await req.pool.getConnection();
        try {
            // Get total courses
            const [totalCourses] = await connection.query('SELECT COUNT(*) as count FROM courses');
            
            // Get total students
            const [totalStudents] = await connection.query('SELECT COUNT(DISTINCT student_id) as count FROM course_enrollments');
            
            // Get total revenue
            const [totalRevenue] = await connection.query('SELECT SUM(amount) as total FROM payments');
            
            // Get active courses
            const [activeCourses] = await connection.query('SELECT COUNT(*) as count FROM courses WHERE status = "active"');
            
            // Get popular courses (top 5 by enrollments)
            const [popularCourses] = await connection.query(`
                SELECT c.*, COUNT(e.id) as enrollment_count 
                FROM courses c 
                LEFT JOIN course_enrollments e ON c.id = e.course_id 
                GROUP BY c.id 
                ORDER BY enrollment_count DESC 
                LIMIT 5
            `);
            
            res.status(200).json({
                success: true,
                data: {
                    totalCourses: totalCourses[0].count,
                    totalStudents: totalStudents[0].count,
                    totalRevenue: totalRevenue[0]?.total || 0,
                    activeCourses: activeCourses[0].count,
                    popularCourses
                }
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch statistics'
        });
    }
});

module.exports = router;
