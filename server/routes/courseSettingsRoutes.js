const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const pool = require('../config/db');

// Get course settings
router.get('/admin/settings/courses', protect, admin, async (req, res) => {
    try {
        const [settings] = await pool.query(
            'SELECT * FROM course_settings LIMIT 1'
        );

        if (settings.length === 0) {
            // Create default settings if none exist
            await pool.query(
                'INSERT INTO course_settings SET ?',
                {
                    default_course_status: 'draft',
                    enable_course_reviews: 1,
                    enable_course_ratings: 1,
                    enable_student_enrollment: 1,
                    max_file_upload_size: 50,
                    allowed_file_types: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.mp4,.mp3',
                    default_course_price: 0,
                    currency: 'USD',
                    enable_course_certificates: 1,
                    certificate_template: 'default',
                    notification_emails: ''
                }
            );
            
            // Fetch the newly created settings
            const [newSettings] = await pool.query(
                'SELECT * FROM course_settings LIMIT 1'
            );
            
            res.json({
                success: true,
                data: newSettings[0]
            });
        } else {
            res.json({
                success: true,
                data: settings[0]
            });
        }
    } catch (error) {
        console.error('Error fetching course settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch course settings',
            error: error.message
        });
    }
});

// Update course settings
router.put('/admin/settings/courses', protect, admin, async (req, res) => {
    try {
        const {
            default_course_status,
            enable_course_reviews,
            enable_course_ratings,
            enable_student_enrollment,
            max_file_upload_size,
            allowed_file_types,
            default_course_price,
            currency,
            enable_course_certificates,
            certificate_template,
            notification_emails
        } = req.body;

        // Validate required fields
        if (!default_course_status || !currency) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate file types
        const allowedFileTypes = allowed_file_types.split(',');
        const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.zip', '.mp4', '.mp3'];
        const invalidExtensions = allowedFileTypes.filter(ext => !allowedExtensions.includes(ext.toLowerCase()));
        if (invalidExtensions.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid file type extensions'
            });
        }

        // Validate max file size
        if (max_file_upload_size < 1 || max_file_upload_size > 100) {
            return res.status(400).json({
                success: false,
                message: 'Max file upload size must be between 1 and 100 MB'
            });
        }

        // Update settings
        await pool.query(
            'UPDATE course_settings SET ? WHERE id = 1',
            {
                default_course_status,
                enable_course_reviews: enable_course_reviews ? 1 : 0,
                enable_course_ratings: enable_course_ratings ? 1 : 0,
                enable_student_enrollment: enable_student_enrollment ? 1 : 0,
                max_file_upload_size,
                allowed_file_types,
                default_course_price,
                currency,
                enable_course_certificates: enable_course_certificates ? 1 : 0,
                certificate_template,
                notification_emails
            }
        );

        // Get updated settings
        const [updatedSettings] = await pool.query(
            'SELECT * FROM course_settings LIMIT 1'
        );

        res.json({
            success: true,
            message: 'Course settings updated successfully',
            data: updatedSettings[0]
        });
    } catch (error) {
        console.error('Error updating course settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update course settings',
            error: error.message
        });
    }
});

module.exports = router;
