// src/routes/commentRoutes.js
import express from 'express';
import commentController from '../controllers/commentController.js';
import { uploadCommentImages } from '../middlewares/uploadMiddleware.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/blogs/{blogId}/comments:
 *   post:
 *     summary: Tạo bình luận mới (tối đa 6 ảnh)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         example: 67a1b2c3d4e5f67890123456
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - author.userId
 *               - author.name
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Mình đã thử quán số 3, đúng là tuyệt vời luôn! Đặc biệt là món cơm gạo lứt trộn nấm"
 *               author.userId:
 *                 type: string
 *                 example: "60d5ecb74b3d3f001c8b4567"
 *               author.name:
 *                 type: string
 *                 example: "Trần Thị B"
 *               author.avatar:
 *                 type: string
 *                 example: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=random"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 6
 *                 description: Tối đa 6 ảnh cho mỗi bình luận
 *     responses:
 *       201:
 *         description: Bình luận được tạo thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Comment created successfully"
 *               data:
 *                 _id: "67c9d8e7f6a5b4c3d2e1f0a9"
 *                 blogId: "67a1b2c3d4e5f67890123456"
 *                 content: "Mình đã thử quán số 3, đúng là tuyệt vời luôn!..."
 *                 author:
 *                   userId: "60d5ecb74b3d3f001c8b4567"
 *                   name: "Trần Thị B"
 *                   avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=random"
 *                 images:
 *                   - url: "https://res.cloudinary.com/dhaecxi8n/image/upload/v1733151000/comments/xyz123.jpg"
 *                     publicId: "comments/xyz123"
 *                     width: 1200
 *                     height: 800
 *                 likesCount: 0
 *                 path: "0001"
 *                 createdAt: "2025-12-04T12:30:00.000Z"
 */

/**
 * @swagger
 * /api/blogs/{blogId}/comments:
 *   get:
 *     summary: Lấy danh sách bình luận gốc (có phân trang)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         example: 67a1b2c3d4e5f67890123456
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 15 }
 *         example: 15
 *     responses:
 *       200:
 *         description: Danh sách bình luận gốc
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - _id: "67c9d8e7f6a5b4c3d2e1f0a9"
 *                   content: "Bài viết rất hay! Mình đã thử quán số 3..."
 *                   author:
 *                     name: "Trần Thị B"
 *                     avatar: "https://ui-avatars.com/..."
 *                   images:
 *                     - url: "https://res.cloudinary.com/..."
 *                       publicId: "comments/xyz123"
 *                   likesCount: 18
 *                   createdAt: "2025-12-04T12:30:00.000Z"
 *               pagination:
 *                 page: 1
 *                 limit: 15
 *                 total: 48
 *                 pages: 4
 */

/**
 * @swagger
 * /api/blogs/{blogId}/comments/{commentId}/reply:
 *   post:
 *     summary: Trả lời bình luận (nested comment)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *       - in: path
 *         name: commentId
 *         required: true
 *         example: 67c9d8e7f6a5b4c3d2e1f0a9
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - author.userId
 *               - author.name
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Cảm ơn bạn nhiều nhé! Mình cũng đang định đi thử quán đó cuối tuần này!"
 *               author.userId:
 *                 type: string
 *                 example: "60d5ecb74b3d3f001c8b4568"
 *               author.name:
 *                 type: string
 *                 example: "Lê Văn C"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 6
 *     responses:
 *       201:
 *         description: Trả lời thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "67c9d8e7f6a5b4c3d2e1f0b0"
 *                 parentId: "67c9d8e7f6a5b4c3d2e1f0a9"
 *                 content: "Cảm ơn bạn nhiều nhé!..."
 *                 path: "0001.0002"
 *                 createdAt: "2025-12-04T12:35:00.000Z"
 */

/**
 * @swagger
 * /api/blogs/{blogId}/comments/{commentId}/replies:
 *   get:
 *     summary: Lấy tất cả trả lời của một bình luận
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *       - in: path
 *         name: commentId
 *         required: true
 *         example: 67c9d8e7f6a5b4c3d2e1f0a9
 *     responses:
 *       200:
 *         description: Danh sách trả lời
 */

/**
 * @swagger
 * /api/blogs/{blogId}/comments/{commentId}/like:
 *   post:
 *     summary: Like / Unlike bình luận
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *       - in: path
 *         name: commentId
 *         required: true
 *         example: 67c9d8e7f6a5b4c3d2e1f0a9
 *     responses:
 *       200:
 *         description: Like thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Comment liked"
 *               likesCount: 19
 *               liked: true
 */

/**
 * @swagger
 * /api/blogs/{blogId}/comments/{commentId}:
 *   put:
 *     summary: Cập nhật bình luận (chỉ chủ bình luận)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *       - in: path
 *         name: commentId
 *         required: true
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Cập nhật: quán này giờ có thêm món mới rất ngon!"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *
 *   delete:
 *     summary: Xóa bình luận (soft delete)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *       - in: path
 *         name: commentId
 *         required: true
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Comment deleted successfully"
 */

router.get('/', commentController.getComments);
router.get('/:commentId/replies', commentController.getReplies);

router.use(authenticate);

router.post('/', uploadCommentImages, commentController.createComment);
router.post('/:commentId/reply', uploadCommentImages, commentController.replyComment);
router.post('/:commentId/like', commentController.likeComment);
router.put('/:commentId', uploadCommentImages, commentController.updateComment);
router.delete('/:commentId', commentController.deleteComment);

export default router;
