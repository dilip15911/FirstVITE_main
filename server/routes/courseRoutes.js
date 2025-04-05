const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, restrictTo } = require('../middleware/auth');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.getAllCourses();
        res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch courses'
        });
    }
});

// Get course by ID
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.getCourseById(req.params.id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Calculate available seats
        course.availableSeats = course.maxStudents - course.enrolledStudents;

        // Format objectives and learning outcomes
        course.objectives = course.objectives ? course.objectives.split('\n').filter(Boolean) : [];
        course.learningOutcomes = course.learningOutcomes ? course.learningOutcomes.split('\n').filter(Boolean) : [];

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch course'
        });
    }
});

// Create new course (admin only)
router.post('/', [protect, restrictTo('admin')], async (req, res) => {
    try {
        const courseData = {
            ...req.body,
            instructor_id: req.user.id
        };

        const courseId = await Course.createCourse(courseData);
        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            courseId
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create course'
        });
    }
});

// Update course (instructor/admin only)
router.put('/:id', [protect], async (req, res) => {
    try {
        const course = await Course.getCourseById(req.params.id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Only allow course instructor or admin to update
        if (course.instructor_id !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to update this course'
            });
        }

        const updated = await Course.updateCourse(req.params.id, req.body);
        if (updated) {
            res.status(200).json({
                success: true,
                message: 'Course updated successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to update course'
            });
        }
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update course'
        });
    }
});

// Purchase course
router.post('/:id/purchase', [protect], async (req, res) => {
    try {
        const purchaseId = await Course.purchaseCourse(
            req.user.id,
            req.params.id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: 'Course purchase successful',
            purchaseId
        });
    } catch (error) {
        console.error('Error purchasing course:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process course purchase'
        });
    }
});

module.exports = router;
