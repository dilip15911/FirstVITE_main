const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const { pool } = require('../config/db');

// Get course statistics
router.get('/', protect, restrictTo('admin'), async (req, res) => {
    try {
        // Get total courses
        const [totalCourses] = await pool.query('SELECT COUNT(*) as count FROM courses');
        
        // Get total students
        const [totalStudents] = await pool.query('SELECT COUNT(DISTINCT student_id) as count FROM course_enrollments');
        
        // Get total revenue
        const [totalRevenue] = await pool.query('SELECT SUM(price) as revenue FROM courses WHERE status = "published"');
        
        // Get average rating
        const [averageRating] = await pool.query(`
            SELECT 
                COALESCE(AVG(rating), 0) as average_rating,
                COUNT(*) as total_ratings
            FROM course_ratings
        `);
        
        // Get course status distribution
        const [statusDistribution] = await pool.query(`
            SELECT status, COUNT(*) as count
            FROM courses
            GROUP BY status
        `);
        
        // Get category distribution
        const [categoryDistribution] = await pool.query(`
            SELECT c.name as category_name, COUNT(*) as course_count
            FROM courses co
            JOIN categories c ON co.category_id = c.id
            GROUP BY c.name
        `);
        
        // Get instructor distribution
        const [instructorDistribution] = await pool.query(`
            SELECT u.name as instructor_name, COUNT(*) as course_count
            FROM courses co
            JOIN users u ON co.instructor_id = u.id
            GROUP BY u.name
        `);
        
        // Get level distribution
        const [levelDistribution] = await pool.query(`
            SELECT level, COUNT(*) as count
            FROM courses
            GROUP BY level
        `);
        
        // Get enrollment statistics
        const [enrollmentStats] = await pool.query(`
            SELECT 
                COUNT(*) as total_enrollments,
                COUNT(DISTINCT student_id) as unique_students,
                COUNT(DISTINCT course_id) as unique_courses
            FROM course_enrollments
        `);
        
        // Get completion statistics
        const [completionStats] = await pool.query(`
            SELECT 
                COUNT(*) as total_completed,
                COUNT(DISTINCT student_id) as unique_students,
                COUNT(DISTINCT course_id) as unique_courses
            FROM course_enrollments
            WHERE status = 'completed'
        `);
        
        res.status(200).json({
            success: true,
            data: {
                total_courses: totalCourses[0].count,
                total_students: totalStudents[0].count,
                total_revenue: totalRevenue[0].revenue || 0,
                average_rating: averageRating[0].average_rating || 0,
                status_distribution: statusDistribution,
                category_distribution: categoryDistribution,
                instructor_distribution: instructorDistribution,
                level_distribution: levelDistribution,
                enrollment_stats: enrollmentStats[0],
                completion_stats: completionStats[0]
            }
        });
    } catch (error) {
        console.error('Error fetching course statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
