import express from 'express';
import upload from '../config/multer.js';
import uploadController from '../controllers/uploadController.js';

const router = express.Router();

// Upload single image
router.post('/image', upload.single('image'), uploadController.uploadSingleImage);

// Upload multiple images (max 5)
router.post('/images', upload.array('images', 5), uploadController.uploadMultipleImages);

// Delete image
router.delete('/delete', uploadController.deleteImage);

export default router;
