const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const {
  uploadVideo,
  getVideoStatus,
  getUserVideos,
  downloadVideo,
  deleteVideo,
} = require('../controllers/videoController');

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept video files only
  const allowedTypes = /mp4|mov|avi|mkv|flv|wmv|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit
  },
  fileFilter: fileFilter,
});

// Routes
router.post('/upload', protect, upload.single('video'), uploadVideo);
router.get('/', protect, getUserVideos);
router.get('/:id', protect, getVideoStatus);
router.get('/:id/download', protect, downloadVideo);
router.delete('/:id', protect, deleteVideo);

module.exports = router;
