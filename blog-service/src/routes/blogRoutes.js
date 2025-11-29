import express from 'express';
import blogController from '../controllers/blogController.js';
import commentRoutes from './commentRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

// Upload routes
router.use('/upload', uploadRoutes);

// ✅ Blog routes
router.get('/popular', blogController.getPopularBlogs);
router.post('/', blogController.createBlog);
router.get('/', blogController.getBlogs);
router.get('/:blogId', blogController.getBlogById);
router.get('/:blogId/related', blogController.getRelatedBlogs);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.put('/:blogId', blogController.updateBlog);
router.delete('/:blogId', blogController.deleteBlog);
router.post('/:blogId/like', blogController.toggleLike);

// ✅ Comment routes - tách riêng
router.use('/:blogId/comments', commentRoutes);

export default router;
