const Course = require('../models/Course');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');

// Course controller class
class CourseController {
    async createCourse(req, res) {
        try {
            console.log('\n=== Course Creation Request ===');
            console.log('Request headers:', req.headers);
            console.log('Request body:', req.body);
            console.log('Request files:', req.files);
            console.log('Request user:', req.user);

            // Validate required fields
            const requiredFields = ['title', 'description', 'category_id'];
            const missingFields = requiredFields.filter(field => !req.body[field]);
            
            if (missingFields.length > 0) {
                console.log('Missing required fields:', missingFields);
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`
                });
            }

            // Get database connection
            const connection = await db.getConnection();
            
            try {
                // Validate category exists
                const [category] = await connection.query(
                    'SELECT id FROM categories WHERE id = ?',
                    [parseInt(req.body.category_id)]
                );
                
                if (!category.length) {
                    console.log('Invalid category ID:', req.body.category_id);
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid category ID. Please select a valid category from the dropdown.'
                    });
                }

                // Get user ID from request
                const userId = req.user?.id;
                if (!userId) {
                    console.log('No user ID in request');
                    return res.status(401).json({
                        success: false,
                        message: 'Authentication required'
                    });
                }

                // Validate user exists
                const [user] = await connection.query(
                    'SELECT id FROM users WHERE id = ?',
                    [userId]
                );
                
                if (!user.length) {
                    console.log('Invalid user ID:', userId);
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid user. Please log in again.'
                    });
                }

                // Insert course
                const [result] = await connection.query(
                    'INSERT INTO courses (title, description, category_id, status, instructor_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
                    [req.body.title, req.body.description, category[0].id, 'draft', userId]
                );

                console.log('Course created successfully:', {
                    id: result.insertId,
                    title: req.body.title,
                    category_id: category[0].id,
                    instructor_id: userId
                });

                return res.status(201).json({
                    success: true,
                    message: 'Course created successfully',
                    data: {
                        id: result.insertId,
                        title: req.body.title,
                        category_id: category[0].id,
                        instructor_id: userId
                    }
                });

            } catch (dbError) {
                console.error('Database error:', {
                    message: dbError.message,
                    code: dbError.code,
                    sql: dbError.sql,
                    sqlMessage: dbError.sqlMessage
                });
                
                // Handle specific database errors
                if (dbError.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid category or instructor ID. Please check your input and try again.'
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: 'Database error: ' + dbError.message
                });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Unexpected error:', {
                message: error.message,
                stack: error.stack
            });
            
            return res.status(500).json({
                success: false,
                message: 'Server error: ' + error.message
            });
        }
    }

    async updateCourse(req, res) {
        try {
            const courseId = req.params.id;
            const courseData = req.body;
            
            // Get database connection from pool
            const connection = await db.getConnection();
            console.log('Database connection obtained');
            
            try {
                // Handle file uploads
                let thumbnailPath = null;
                if (req.files && req.files.thumbnail) {
                    const uploadDir = path.join(__dirname, '../../public/uploads/courses/thumbnails');
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }
                    const thumbnail = req.files.thumbnail;
                    const ext = path.extname(thumbnail.name).toLowerCase();
                    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                    
                    if (!allowedExtensions.includes(ext)) {
                        return res.status(400).json({
                            success: false,
                            message: 'Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.'
                        });
                    }
                    
                    thumbnailPath = path.join(uploadDir, `${Date.now()}${ext}`);
                    await thumbnail.mv(thumbnailPath);
                }

                // Update course
                const updateData = {
                    title: courseData.title,
                    description: courseData.description,
                    category_id: courseData.category_id,
                    level: courseData.level,
                    duration: courseData.duration,
                    price: courseData.price,
                    prerequisites: courseData.prerequisites,
                    learningObjectives: courseData.learningObjectives,
                    curriculum: courseData.curriculum,
                    courseOverview: courseData.courseOverview,
                    keyFeatures: courseData.keyFeatures,
                    skills: courseData.skills,
                    benefits: courseData.benefits,
                    status: courseData.status,
                    thumbnail_url: thumbnailPath ? path.relative(path.join(__dirname, '../../public'), thumbnailPath) : null,
                    faqs: JSON.stringify(courseData.faqs || [])
                };

                const [result] = await connection.query(
                    'UPDATE courses SET ? WHERE id = ?',
                    [updateData, courseId]
                );

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Course not found'
                    });
                }

                res.status(200).json({
                    success: true,
                    message: 'Course updated successfully'
                });
            } finally {
                // Release the connection back to the pool
                connection.release();
            }
        } catch (error) {
            console.error('Error updating course:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update course',
                error: error.message
            });
        }
    }

    async getCourses(req, res) {
        try {
            // Get database connection from pool
            const connection = await db.getConnection();
            console.log('Database connection obtained');
            
            try {
                // Get categories for dropdown
                const [categories] = await connection.query(
                    'SELECT id, name FROM categories ORDER BY name ASC'
                );
                
                // Get courses with joins
                const [courses] = await connection.query(
                    `SELECT c.*, cat.name as category_name, u.name as instructor_name 
                     FROM courses c 
                     LEFT JOIN categories cat ON c.category_id = cat.id 
                     LEFT JOIN users u ON c.instructor_id = u.id 
                     ORDER BY c.created_at DESC`
                );
                
                res.status(200).json({
                    success: true,
                    courses: courses,
                    categories: categories
                });
            } finally {
                // Release the connection back to the pool
                connection.release();
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            res.status(500).json({
                success: false,
                message: 'Server error: ' + error.message
            });
        }
    }

    async getCourse(req, res) {
        try {
            const courseId = req.params.id;
            
            // Get database connection from pool
            const connection = await db.getConnection();
            console.log('Database connection obtained');
            
            try {
                const [course] = await connection.query(
                    `SELECT c.*, cat.name as category_name, u.name as instructor_name 
                     FROM courses c 
                     LEFT JOIN categories cat ON c.category_id = cat.id 
                     LEFT JOIN users u ON c.instructor_id = u.id 
                     WHERE c.id = ?`,
                    [courseId]
                );
                
                if (course.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Course not found'
                    });
                }

                res.status(200).json({
                    success: true,
                    course: course[0]
                });
            } finally {
                // Release the connection back to the pool
                connection.release();
            }
        } catch (error) {
            console.error('Error fetching course:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch course',
                error: error.message
            });
        }
    }

    async deleteCourse(req, res) {
        try {
            const courseId = req.params.id;
            
            // Get database connection from pool
            const connection = await db.getConnection();
            console.log('Database connection obtained');
            
            try {
                // Delete course materials first
                await connection.query('DELETE FROM course_materials WHERE course_id = ?', [courseId]);
                
                // Then delete the course
                const [result] = await connection.query('DELETE FROM courses WHERE id = ?', [courseId]);
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Course not found'
                    });
                }

                res.status(200).json({
                    success: true,
                    message: 'Course deleted successfully'
                });
            } finally {
                // Release the connection back to the pool
                connection.release();
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete course',
                error: error.message
            });
        }
    }

    async purchaseCourse(req, res) {
        try {
            const courseId = req.params.id;
            const userId = req.user.id;
            const purchaseData = req.body;

            // Get database connection from pool
            const connection = await db.getConnection();
            console.log('Database connection obtained');
            
            try {
                // Check if course exists
                const [course] = await connection.query('SELECT * FROM courses WHERE id = ?', [courseId]);
                if (course.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Course not found'
                    });
                }

                // Create purchase record
                const [result] = await connection.query(
                    'INSERT INTO course_purchases (user_id, course_id, price, status) VALUES (?, ?, ?, ?)',
                    [userId, courseId, course[0].price, 'pending']
                );

                res.status(200).json({
                    success: true,
                    message: 'Course purchase initiated successfully',
                    purchaseId: result.insertId
                });
            } finally {
                // Release the connection back to the pool
                connection.release();
            }
        } catch (error) {
            console.error('Error purchasing course:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to purchase course',
                error: error.message
            });
        }
    }
}

// Create and export an instance of the controller
const courseController = new CourseController();

module.exports = courseController;
