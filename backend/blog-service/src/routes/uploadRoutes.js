import express from 'express';
import uploadController from '../controllers/uploadController.js';
import upload from '../config/multer.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/blogs/upload/editor-image:
 *   post:
 *     summary: Upload single image for rich text editor
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     publicId:
 *                       type: string
 */
router.post('/editor-image', authenticate, upload.single('image'), uploadController.uploadEditorImage);

/**
 * @swagger
 * /api/blogs/upload/multiple:
 *   post:
 *     summary: Upload multiple images at once
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 */
router.post('/multiple', authenticate, upload.array('images', 10), uploadController.uploadMultipleImages);

export default router;
