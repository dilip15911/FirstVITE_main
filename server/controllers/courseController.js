const Course = require('../models/Course');
const Purchase = require('../models/Purchase');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');

// Get course details
exports.getCourseDetails = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId)
            .populate('instructor', 'name email')
            .populate('category', 'name');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Calculate available seats
        const availableSeats = course.maxStudents - course.enrolledStudents;

        // Format objectives and learning outcomes
        const objectives = course.objectives ? course.objectives.split('\n').filter(Boolean) : [];
        const learningOutcomes = course.learningOutcomes ? course.learningOutcomes.split('\n').filter(Boolean) : [];

        res.status(200).json({
            success: true,
            course: {
                ...course.toObject(),
                availableSeats,
                objectives,
                learningOutcomes
            }
        });
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch course details'
        });
    }
};

// Purchase course
exports.purchaseCourse = async (req, res) => {
    try {
        const { courseId, fullName, email, phone, address, paymentMethod, comments } = req.body;

        // Validate course existence and availability
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        if (course.enrolledStudents >= course.maxStudents) {
            return res.status(400).json({
                success: false,
                message: 'Course is fully booked'
            });
        }

        // Create purchase record
        const purchase = new Purchase({
            course_id: course.id,
            user_id: req.user.id,
            full_name: fullName,
            email,
            phone,
            address,
            payment_method: paymentMethod,
            comments,
            amount: course.price
        });

        await purchase.save();

        // Update course enrollment
        course.enrolledStudents += 1;
        await course.save();

        res.status(201).json({
            success: true,
            message: 'Course purchase successful',
            purchase
        });
    } catch (error) {
        console.error('Error purchasing course:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process course purchase'
        });
    }
};

// Admin routes
exports.createCourse = async (req, res) => {
    try {
        const course = new Course({
            ...req.body,
            instructor_id: req.user.id
        });

        await course.save();
        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create course'
        });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
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

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.courseId,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            course: updatedCourse
        });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update course'
        });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('instructor', 'name email')
            .populate('category', 'name')
            .sort({ created_at: -1 });

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
};
