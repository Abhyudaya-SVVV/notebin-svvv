const express = require('express');
const multer = require('multer');
const { uploadFile, getFiles, getUserFiles, deleteFile } = require('../controllers/fileController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only images (JPEG, PNG, GIF), PDFs, and text/Word documents are allowed!'), false);
    }
  },
});

// Upload
router.post('/upload', authMiddleware, upload.single('file'), uploadFile);

// Get files
router.get('/', getFiles);

// Get files by userId
router.get('/userfiles', authMiddleware, getUserFiles);

// Delete file by note ID
router.delete('/delete/:id', authMiddleware, deleteFile);

module.exports = router;
