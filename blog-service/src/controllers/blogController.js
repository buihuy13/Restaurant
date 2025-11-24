import logger from '../utils/logger';
import blogService from '../services/blogService.js';
import { createBlogSchema } from '../dtos/createBlogDto.js';
import { updateBlogSchema } from '../dtos/updateBlogDto.js';
import { log } from 'winston';

/**
 * tags:
 *  name: Blogs
 * description: Blog management and retrieval
 */

class BlogController {
    /**
     * @swagger
     * /api/blogs:
     *   post:
     *     summary: Create a new blog post
     *     tags: [Blogs]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - title
     *               - content
     *               - author
     *             properties:
     *               title:
     *                 type: string
     *               content:
     *                 type: string
     *               excerpt:
     *                 type: string
     *               author:
     *                 type: object
     *               category:
     *                 type: string
     *               tags:
     *                 type: array
     *                 items:
     *                   type: string
     *     responses:
     *       201:
     *         description: Blog created successfully
     *   get:
     *     summary: Get all blog posts
     *     tags: [Blogs]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *       - in: query
     *         name: category
     *         schema:
     *           type: string
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: List of blogs
     */
    async createBlog(req, res, next) {
        try {
            const { error } = createBlogSchema.validate(req.body);

            if (error) {
                return res.status(400).json({ success: false, message: error.details[0].message });
            }

            const blog = await blogService.createBlog(req.body);

            return res.status(201).json({ success: true, message: 'Blog created successfully', data: blog });
        } catch (error) {
            logger.error('Error creating blog:', error);
            return next(error);
        }
    }

    async getBlogs(req, res, next) {
        try {
            const filters = req.query;
            const result = await blogService.getBlogs(filters);

            return res.status(200).json({
                success: true,
                message: 'Blogs retrieved successfully',
                data: result.blogs,
                pagination: result.pagination,
            });
        } catch (error) {
            logger.error('Error retrieving blogs:', error);
            return next(error);
        }
    }

    /**
     * @swagger
     * /api/blogs/{blogId}:
     *   get:
     *     summary: Get blog by ID
     *     tags: [Blogs]
     *     parameters:
     *       - in: path
     *         name: blogId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Blog details
     *       404:
     *         description: Blog not found
     */
    async getBlogById(req, res, next) {
        try {
            const { blogId } = req.params;
            const blog = await blogService.getBlogById(blogId);

            return res.status(200).json({ success: true, message: 'Blog retrieved successfully', data: blog });
        } catch (error) {
            logger.error('Error retrieving blog by ID:', error);
            return next(error);
        }
    }

    /**
     * @swagger
     * /api/blogs/slug/{slug}:
     *   get:
     *     summary: Get blog by slug
     *     tags: [Blogs]
     *     parameters:
     *       - in: path
     *         name: slug
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Blog details
     */
    async getBlogBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const blog = await blogService.getBlogBySlug(slug);

            res.status(200).json({ success: true, message: 'Blog retrieved successfully', data: blog });
        } catch (error) {
            logger.error('Error retrieving blog by slug:', error);
            return next(error);
        }
    }

    /**
     * @swagger
     * /api/blogs/{blogId}:
     *   put:
     *     summary: Update blog
     *     tags: [Blogs]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: blogId
     *         required: true
     *     responses:
     *       200:
     *         description: Blog updated successfully
     */
    async updateBlog(req, res, next) {
        try {
            const { blogId } = req.params;
            const { error } = updateBlogSchema.validate(req.body);

            if (error) {
                return res.status(400).json({ success: false, message: error.details[0].message });
            }

            const userId = req.user?.userId || req.body.userId;
            const blog = await blogService.updateBlog(blogId, req.body, userId);

            return res.status(200).json({ success: true, message: 'Blog updated successfully', data: blog });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
            next(error);
        }
    }

    async deleteBlog(req, res, next) {
        try {
            const { blogId } = req.params;
            const userId = req.user?.userId || req.body.userId;

            const result = await blogService.deleteBlog(blogId, userId);

            return res.status(200).json({ success: true, message: 'Blog deleted successfully', data: result });
        } catch (error) {
            logger.error('Error deleting blog:', error);
            return next(error);
        }
    }

    /**
     * @swagger
     * /api/blogs/popular:
     *   get:
     *     summary: Get popular blogs
     *     tags: [Blogs]
     *     parameters:
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 5
     *     responses:
     *       200:
     *         description: List of popular blogs
     */
    async getPopularBlogs(req, res, next) {
        try {
            const limit = parseInt(req.query.limit, 10) || 5;
            const blogs = await blogService.getPopularBlogs(limit);

            return res
                .status(200)
                .json({ success: true, message: 'Popular blogs retrieved successfully', data: blogs });
        } catch (error) {
            logger.error('Error retrieving popular blogs:', error);
            return next(error);
        }
    }

    async getRelatedBlogs(req, res, next) {
        try {
            const { blogId } = req.params;
            const limit = parseInt(req.query.limit, 10) || 3;
            const blogs = await blogService.getRelatedBlogs(blogId, limit);

            return res
                .status(200)
                .json({ success: true, message: 'Related blogs retrieved successfully', data: blogs });
        } catch (error) {
            logger.error('Error retrieving related blogs:', error);
            return next(error);
        }
    }
}

export default new BlogController();
