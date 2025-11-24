import express from 'express';
import blogController from '../controllers/blogController.js';

const router = express.Router();

router.post('/', blogController.createBlog);
router.get('/', blogController.getBlogs);
router.get('/popular', blogController.getPopularBlogs);
router.get('/:blogId', blogController.getBlogById);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.get('/:blogId/related', blogController.getRelatedBlogs);
router.put('/:blogId', blogController.updateBlog);
router.delete('/:blogId', blogController.deleteBlog);

export default router;
