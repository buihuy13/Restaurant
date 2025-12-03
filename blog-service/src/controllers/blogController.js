import logger from '../utils/logger.js';
import blogService from '../services/blogService.js';
import { createBlogSchema } from '../dtos/createBlogDto.js';
import { updateBlogSchema } from '../dtos/updateBlogDto.js';

class BlogController {
    createBlog = async (req, res, next) => {
        try {
            const { error } = createBlogSchema.validate(req.body);
            if (error) return res.status(400).json({ success: false, message: error.details[0].message });

            const blog = await blogService.createBlog(req.body);
            return res.status(201).json({ success: true, message: 'Blog created successfully', data: blog });
        } catch (error) {
            logger.error('Error creating blog:', error);
            return next(error);
        }
    };

    getBlogs = async (req, res, next) => {
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
    };

    getBlogById = async (req, res, next) => {
        try {
            const { blogId } = req.params;
            const blog = await blogService.getBlogById(blogId);
            return res.status(200).json({ success: true, message: 'Blog retrieved successfully', data: blog });
        } catch (error) {
            logger.error('Error retrieving blog by ID:', error);
            return next(error);
        }
    };

    getBlogBySlug = async (req, res, next) => {
        try {
            const { slug } = req.params;
            const blog = await blogService.getBlogBySlug(slug);
            return res.status(200).json({ success: true, message: 'Blog retrieved successfully', data: blog });
        } catch (error) {
            logger.error('Error retrieving blog by slug:', error);
            return next(error);
        }
    };

    updateBlog = async (req, res, next) => {
        try {
            const { blogId } = req.params;
            const { error } = updateBlogSchema.validate(req.body);
            if (error) return res.status(400).json({ success: false, message: error.details[0].message });

            const userId = req.user?.userId || req.body.userId;
            const userRole = req.user?.role;
            const blog = await blogService.updateBlog(blogId, req.body, userId, userRole);

            return res.status(200).json({ success: true, message: 'Blog updated successfully', data: blog });
        } catch (error) {
            logger.error('Error updating blog:', error);
            return next(error);
        }
    };

    deleteBlog = async (req, res, next) => {
        try {
            const { blogId } = req.params;
            const userId = req.user?.userId || req.body.userId;
            const result = await blogService.deleteBlog(blogId, userId);

            return res.status(200).json({ success: true, message: 'Blog deleted successfully', data: result });
        } catch (error) {
            logger.error('Error deleting blog:', error);
            return next(error);
        }
    };

    getPopularBlogs = async (req, res, next) => {
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
    };

    getRelatedBlogs = async (req, res, next) => {
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
    };

    toggleLike = async (req, res, next) => {
        try {
            const { blogId } = req.params;
            const userId = req.user?.userId || req.body.userId;
            const result = await blogService.toggleLikeBlog(blogId, userId);
            return res.status(200).json({ success: true, message: 'Blog like toggled', data: result });
        } catch (error) {
            logger.error('Error toggling like:', error);
            return next(error);
        }
    };
}

export default new BlogController();
