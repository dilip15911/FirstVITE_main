const { pool } = require('../config/db');
const { protect, restrictTo } = require('../middleware/auth');

// Course controller class
class CourseController {
    async createCourse(req, res) {
        try {
            const connection = await pool.getConnection();
            try {
                const { title, description, category_id, instructor_id, status, price, duration, level, image_url } = req.body;
                
                // Validate required fields
                if (!title || !description || !category_id || !instructor_id || !status) {
                    return res.status(400).json({
                        success: false,
                        message: 'All fields are required'
                    });
                }

                const [result] = await connection.query(
                    `INSERT INTO courses (title, description, category_id, instructor_id, status, price, duration, level, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                    [title, description, category_id, instructor_id, status, price, duration, level, image_url]
                );

                res.status(201).json({
                    success: true,
                    message: 'Course created successfully',
                    data: {
                        id: result.insertId,
                        title,
                        description,
                        category_id,
                        instructor_id,
                        status,
                        price,
                        duration,
                        level,
                        image_url,
                        created_at: new Date().toISOString()
                    }
                });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Error creating course:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create course'
            });
        }
    }

    async updateCourse(req, res) {
        try {
            const connection = await pool.getConnection();
            try {
                const { title, description, category_id, instructor_id, status, price, duration, level, image_url } = req.body;
                const courseId = req.params.id;

                const [result] = await connection.query(
                    `UPDATE courses SET title = ?, description = ?, category_id = ?, instructor_id = ?, status = ?, price = ?, duration = ?, level = ?, image_url = ?, updated_at = NOW() WHERE id = ?`,
                    [title, description, category_id, instructor_id, status, price, duration, level, image_url, courseId]
                );

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Course not found'
                    });
                }

                res.json({
                    success: true,
                    message: 'Course updated successfully'
                });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Error updating course:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update course'
            });
        }
    }

    async getCourses(req, res) {
        try {
            const connection = await pool.getConnection();
            try {
                const [courses] = await connection.query(
                    `SELECT c.*, u.name as instructor_name, cat.name as category_name 
                    FROM courses c 
                    LEFT JOIN users u ON c.instructor_id = u.id 
                    LEFT JOIN categories cat ON c.category_id = cat.id 
                    ORDER BY c.created_at DESC`
                );

                res.status(200).json({
                    success: true,
                    data: courses
                });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch courses'
            });
        }
    }

    async getCourse(req, res) {
        try {
            const connection = await pool.getConnection();
            try {
                const courseId = req.params.id;
                
                const [courses] = await connection.query(
                    `
                        SELECT 
                            c.*, 
                            u.name as instructor_name,
                            u.email as instructor_email,
                            cat.name as category_name,
                            cat.id as category_id,
                            COUNT(e.id) as enrollment_count,
                            AVG(r.rating) as average_rating
                        FROM courses c
                        LEFT JOIN users u ON c.instructor_id = u.id
                        LEFT JOIN categories cat ON c.category_id = cat.id
                        LEFT JOIN course_enrollments e ON c.id = e.course_id
                        LEFT JOIN course_ratings r ON c.id = r.course_id
                        WHERE c.id = ?
                        GROUP BY c.id
                    `,
                    [courseId]
                );

                if (courses.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Course not found'
                    });
                }

                const course = courses[0];
                
                res.json({
                    success: true,
                    data: {
                        id: course.id,
                        title: course.title,
                        description: course.description,
                        category_id: course.category_id,
                        category_name: course.category_name,
                        instructor_id: course.instructor_id,
                        instructor_name: course.instructor_name,
                        instructor_email: course.instructor_email,
                        status: course.status,
                        price: course.price,
                        duration: course.duration,
                        level: course.level,
                        image_url: course.image_url,
                        enrollment_count: course.enrollment_count || 0,
                        average_rating: course.average_rating ? parseFloat(course.average_rating.toFixed(1)) : null,
                        created_at: course.created_at,
                        updated_at: course.updated_at
                    }
                });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Error fetching course:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch course'
            });
        }
    }

    async deleteCourse(req, res) {
        try {
            const connection = await pool.getConnection();
            try {
                const courseId = req.params.id;
                
                // First delete related data
                await connection.query('DELETE FROM course_ratings WHERE course_id = ?', [courseId]);
                await connection.query('DELETE FROM course_enrollments WHERE course_id = ?', [courseId]);
                
                const [result] = await connection.query(
                    'DELETE FROM courses WHERE id = ?',
                    [courseId]
                );

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Course not found'
                    });
                }

                res.json({
                    success: true,
                    message: 'Course deleted successfully'
                });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete course'
            });
        }
    }

    async getCourseSettings(req, res) {
        try {
            const connection = await pool.getConnection();
            try {
                const [categories] = await connection.query('SELECT id, name FROM categories');
                const [instructors] = await connection.query(
                    'SELECT id, name, email FROM users WHERE role = ? ORDER BY name',
                    ['instructor']
                );

                res.json({
                    success: true,
                    data: {
                        categories,
                        instructors
                    }
                });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Error fetching course settings:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch course settings'
            });
        }
    }

    async purchaseCourse(req, res) {
        try {
            const courseId = req.params.id;
            const userId = req.user.id;
            const purchaseData = req.body;

            // Get database connection from pool
            const connection = await pool.getConnection();
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
                message: 'Failed to purchase course'
            });
        }
    }
}

// Create and export an instance of the controller
const courseController = new CourseController();

module.exports = courseController;
