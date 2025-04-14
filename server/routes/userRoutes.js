const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-pictures/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Routes with their respective controller functions
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.get('/history', protect, userController.getUserHistory);
router.post('/restore/:historyId', protect, userController.restoreUserData);
router.post('/profile/picture', protect, upload.single('profile_picture'), userController.uploadProfilePicture);
router.delete('/profile/picture', protect, userController.deleteProfilePicture);
router.get('/', protect, userController.getAllUsers);
router.delete('/:id', protect, userController.deleteUser);

// Get all instructors
router.get('/instructors', protect, admin, async (req, res) => {
    try {
        const pool = require('../config/db');
        const [instructors] = await pool.query(
            'SELECT id, name, email FROM users WHERE role = "instructor"'
        );

        res.json({
            success: true,
            data: instructors
        });
    } catch (error) {
        console.error('Error fetching instructors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch instructors',
            error: error.message
        });
    }
});

module.exports = router;
