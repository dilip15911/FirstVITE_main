const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Validation middleware
const loginValidation = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists().trim()
];

const signupValidation = [
  check('name', 'Name is required').trim().not().isEmpty().escape(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Please enter a password with 6 or more characters')
    .trim()
    .isLength({ min: 6 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const verifyEmailValidation = [
  check('userId', 'User ID is required').isInt(),
  check('otp', 'Valid OTP is required').isLength({ min: 6, max: 6 }).isNumeric()
];

const resendOtpValidation = [
  check('userId', 'User ID is required').isInt()
];

const validateProfile = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('mobile')
    .optional({ nullable: true })
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid 10-digit mobile number'),
  body('course')
    .optional({ nullable: true })
    .isString()
    .withMessage('Course must be a valid string')
];

// Admin Login Validation
const adminLoginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').trim().notEmpty().withMessage('Password is required')
];

// Auth routes
router.post('/signup', signupValidation, authController.signup);
router.post('/login', loginValidation, authController.login);
router.post('/verify', verifyEmailValidation, authController.verifyEmail);
router.post('/resend-otp', resendOtpValidation, authController.resendVerification);
router.post('/admin/login', adminLoginValidation, authController.adminLogin);

// Get all users
router.get('/getAllUser', authController.getAllUser);

// Protected routes (require authentication)
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', [verifyToken, validateProfile], authController.updateProfile);
router.get('/history', verifyToken, authController.getUserHistory);
router.post('/restore', verifyToken, authController.restoreProfile);

module.exports = router;
