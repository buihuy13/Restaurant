import express from 'express';
import commentController from '../controllers/commentController.js';
import { uploadCommentImages } from '../middlewares/uploadMiddleware.js';

const router = express.Router({ mergeParams: true }); // Để nhận :blogId từ parent router

/**
 * @swagger
 * tags:
 *   - name: Blogs
 *     description: Quản lý bài viết blog
 *   - name: Comments
 *     description: Bình luận & trả lời
 *   - name: Upload
 *     description: Upload ảnh
 */

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
 *         example: 67a1b2c3d4e5f6789012345
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
 *                 example: "Bài viết rất hay! Mình đã thử quán số 3, đúng là tuyệt vời!"
 *               author.userId:
 *                 type: string
 *                 example: "60d5ecb74b3d3f001c8b4567"
 *               author.name:
 *                 type: string
 *                 example: "Trần Thị B"
 *               author.avatar:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/avatar-b.jpg"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 6
 *                 description: Tối đa 6 ảnh cho bình luận
 *     responses:
 *       201:
 *         description: Bình luận được tạo thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Comment created successfully"
 *               data:
 *                 _id: "67b9c8d7e6f5a4b3c2d1e0f9"
 *                 blogId: "67a1b2c3d4e5f6789012345"
 *                 content: "Bài viết rất hay! Mình đã thử quán số 3, ngon tuyệt vời!"
 *                 author:
 *                   userId: "60d5ecb74b3d3f001c8b4567"
 *                   name: "Trần Thị B"
 *                   avatar: "https://example.com/avatar-b.jpg"
 *                 images:
 *                   - url: "https://res.cloudinary.com/dhaecxi8n/image/upload/v123/comments/img1.jpg"
 *                     publicId: "comments/img1_abc123"
 *                     width: 1200
 *                     height: 800
 *                 likesCount: 0
 *                 path: "0001"
 *                 createdAt: "2025-12-02T15:30:00.000Z"
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
 *         schema:
 *           type: string
 *         example: 67a1b2c3d4e5f6789012345
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 15
 *           maximum: 50
 *     responses:
 *       200:
 *         description: Danh sách bình luận gốc
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - _id: "67b9c8d7e6f5a4b3c2d1e0f9"
 *                   content: "Bài viết hay quá!"
 *                   author:
 *                     name: "Nguyễn Văn C"
 *                   likesCount: 12
 *                   images:
 *                     - url: "https://res.cloudinary.com/.../img1.jpg"
 *                       publicId: "comments/img1"
 *                   createdAt: "2025-12-02T15:30:00.000Z"
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
 *     summary: Trả lời bình luận (cũng hỗ trợ tối đa 6 ảnh)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         example: 67b9c8d7e6f5a4b3c2d1e0f9
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Cảm ơn bạn đã chia sẻ kinh nghiệm!"
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
 *               message: "Reply created successfully"
 *               data:
 *                 _id: "67c0d1e2f3a4b5c6d7e8f9a0"
 *                 parentId: "67b9c8d7e6f5a4b3c2d1e0f9"
 *                 content: "Cảm ơn bạn đã chia sẻ kinh nghiệm!"
 *                 path: "0001.0002"
 *                 createdAt: "2025-12-02T15:35:00.000Z"
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
 *         example: 67b9c8d7e6f5a4b3c2d1e0f9
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
 *     responses:
 *       200:
 *         description: Like thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               likesCount: 13
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
 *                 example: "Cập nhật nội dung bình luận..."
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
 *     summary: Xóa bình luận (soft delete - chỉ chủ bình luận hoặc admin)
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

// Lấy comment của blog
router.get('/', commentController.getComments);

//  Tạo comment mới
router.post('/', uploadCommentImages, commentController.createComment);

//  Reply comment
router.post('/:commentId/reply', uploadCommentImages, commentController.replyComment);

// Lấy reply của comment
router.get('/:commentId/replies', commentController.getReplies);

//  Like/Unlike comment
router.post('/:commentId/like', commentController.likeComment);

//  Cập nhật comment
router.put('/:commentId', uploadCommentImages, commentController.updateComment);

//  Xóa comment
router.delete('/:commentId', commentController.deleteComment);

export default router;
