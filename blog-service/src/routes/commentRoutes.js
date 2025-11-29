import express from 'express';
import commentController from '../controllers/commentController.js';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';

const router = express.Router({ mergeParams: true }); // ✅ Để nhận :blogId từ parent router

// ✅ Lấy comment của blog
router.get('/', commentController.getComments);

// ✅ Tạo comment mới
router.post('/', authMiddleware, uploadMiddleware.array('images', 5), commentController.createComment);

// ✅ Reply comment
router.post('/:commentId/reply', authMiddleware, uploadMiddleware.array('images', 5), commentController.replyComment);

// ✅ Lấy reply của comment
router.get('/:commentId/replies', commentController.getReplies);

// ✅ Like/Unlike comment
router.post('/:commentId/like', authMiddleware, commentController.likeComment);

// ✅ Cập nhật comment
router.put('/:commentId', authMiddleware, uploadMiddleware.array('images', 5), commentController.updateComment);

// ✅ Xóa comment
router.delete('/:commentId', authMiddleware, commentController.deleteComment);

export default router;
