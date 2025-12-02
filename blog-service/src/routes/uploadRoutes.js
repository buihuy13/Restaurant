import express from 'express';
import upload from '../config/multer.js';
import uploadController from '../controllers/uploadController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Blogs
 *     description: Quản lý bài viết blog
 *   - name: Comments
 *     description: Bình luận & trả lời
 *   - name: Upload
 *     description: Upload và xóa ảnh riêng biệt
 */

/**
 * @swagger
 * /api/blogs/upload/image:
 *   post:
 *     summary: Upload 1 ảnh duy nhất
 *     description: Dùng để upload ảnh bìa blog hoặc ảnh đơn lẻ
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
 *                 description: Ảnh cần upload (jpg, jpeg, png, gif, webp)
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Image uploaded successfully"
 *               data:
 *                 url: "https://res.cloudinary.com/dhaecxi8n/image/upload/v1733150000/blog/cover_abc123xyz.jpg"
 *                 publicId: "blog/cover_abc123xyz"
 *                 width: 1920
 *                 height: 1080
 *                 format: "jpg"
 *                 bytes: 842157
 *       400:
 *         description: Không có file hoặc file không hợp lệ
 */

/**
 * @swagger
 * /api/blogs/upload/images:
 *   post:
 *     summary: Upload nhiều ảnh cùng lúc (tối đa 5)
 *     description: Dùng khi cần upload nhiều ảnh cho bài viết hoặc bình luận
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
 *                 - url: "https://res.cloudinary.com/dhaecxi8n/image/upload/v1733150001/comments/img1_abc.jpg"
 *                   publicId: "comments/img1_abc"
 *                 - url: "https://res.cloudinary.com/dhaecxi8n/image/upload/v1733150002/comments/img2_def.jpg"
 *                   publicId: "comments/img2_def"
 *                 - url: "https://res.cloudinary.com/dhaecxi8n/image/upload/v1733150003/comments/img3_ghi.jpg"
 *                   publicId: "comments/img3_ghi"
 *       400:
 *         description: Quá số lượng hoặc không có file
 */

/**
 * @swagger
 * /api/blogs/upload/delete:
 *   delete:
 *     summary: Xóa ảnh trên Cloudinary theo public_id
 *     description: Dùng khi xóa blog/comment hoặc sửa ảnh
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
 *                 example: "blog/cover_abc123xyz"
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
 *                 publicId: "blog/cover_abc123xyz"
 *                 result: "ok"
 *       400:
 *         description: Thiếu publicId
 *       404:
 *         description: Không tìm thấy ảnh hoặc đã bị xóa
 */

// Upload single image
router.post('/image', upload.single('image'), uploadController.uploadSingleImage);

// Upload multiple images (max 5)
router.post('/images', upload.array('images', 5), uploadController.uploadMultipleImages);

// Delete image
router.delete('/delete', uploadController.deleteImage);

export default router;
