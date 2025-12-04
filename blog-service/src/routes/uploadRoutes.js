// src/routes/uploadRoutes.js
import express from 'express';
import upload from '../config/multer.js';
import uploadController from '../controllers/uploadController.js';

const router = express.Router();

/**
 * @swagger
 * /api/blogs/upload/image:
 *   post:
 *     summary: Upload một ảnh duy nhất (dùng cho ảnh bìa blog)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh JPG, PNG, WebP, GIF (tối đa 5MB)
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Image uploaded successfully"
 *               data:
 *                 url: "https://res.cloudinary.com/dhaecxi8n/image/upload/v1733152000/blog/cover_hanoi_chay_2025.jpg"
 *                 publicId: "blog/cover_hanoi_chay_2025"
 *                 width: 1920
 *                 height: 1080
 *                 format: "jpg"
 *                 bytes: 842157
 */

/**
 * @swagger
 * /api/blogs/upload/images:
 *   post:
 *     summary: Upload nhiều ảnh cùng lúc (tối đa 5)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *                 description: Tối đa 5 ảnh mỗi lần upload
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "5 images uploaded successfully"
 *               data:
 *                 - url: "https://res.cloudinary.com/dhaecxi8n/image/upload/v1733152001/comments/img1.jpg"
 *                   publicId: "comments/img1_abc123"
 *                 - url: "https://res.cloudinary.com/dhaecxi8n/image/upload/v1733152002/comments/img2_def456.jpg"
 *                   publicId: "comments/img2_def456"
 */

/**
 * @swagger
 * /api/blogs/upload/delete:
 *   delete:
 *     summary: Xóa ảnh trên Cloudinary theo public_id
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicId
 *             properties:
 *               publicId:
 *                 type: string
 *                 example: "blog/cover_hanoi_chay_2025"
 *                 description: public_id trả về khi upload
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Image deleted successfully from Cloudinary"
 *               data:
 *                 publicId: "blog/cover_hanoi_chay_2025"
 *                 result: "ok"
 *       404:
 *         description: Không tìm thấy ảnh
 */

router.post('/image', upload.single('image'), uploadController.uploadSingleImage);
router.post('/images', upload.array('images', 5), uploadController.uploadMultipleImages);
router.delete('/delete', uploadController.deleteImage);

export default router;
