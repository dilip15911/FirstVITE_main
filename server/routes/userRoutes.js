const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getUserHistory,
  restoreUserData,
  uploadProfilePicture,
  deleteProfilePicture
} = require('../controllers/userController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-pictures');
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
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.get('/history', verifyToken, getUserHistory);
router.post('/restore/:historyId', verifyToken, restoreUserData);
router.post('/profile/picture', verifyToken, upload.single('profile_picture'), uploadProfilePicture);
router.delete('/profile/picture', verifyToken, deleteProfilePicture);

module.exports = router;
