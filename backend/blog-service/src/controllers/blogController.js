import logger from '../utils/logger.js';
import blogService from '../services/blogService.js';
import { createBlogSchema } from '../dtos/createBlogDto.js';
import { updateBlogSchema } from '../dtos/updateBlogDto.js';

class BlogController {
    createBlog = async (req, res, next) => {
        let featuredImageFile = null;
        let imageFiles = [];
        // 1. Xử lý dữ liệu đầu vào – hỗ trợ cả form-data và raw JSON
        let blogData = {};

        try {
            // Log raw request data for debugging
            logger.info('CreateBlog request received:', {
                hasFiles: !!req.files,
                hasFile: !!req.file,
                filesKeys: req.files ? Object.keys(req.files) : [],
                bodyKeys: Object.keys(req.body || {}),
            });

            // Xử lý files từ multer.fields()
            if (req.files) {
                // req.files là object với keys: 'featuredImage' và 'images'
                if (req.files.featuredImage && req.files.featuredImage.length > 0) {
                    featuredImageFile = req.files.featuredImage[0];
                    logger.info('Featured image received:', {
                        originalname: featuredImageFile.originalname,
                        size: featuredImageFile.size,
                        mimetype: featuredImageFile.mimetype,
                    });
                }
                if (req.files.images && req.files.images.length > 0) {
                    imageFiles = req.files.images;
                    logger.info(`${imageFiles.length} content images received`);
                }
                blogData = { ...req.body };
            } else if (req.file) {
                // Trường hợp upload 1 ảnh qua multer.single() (backward compatible)
                featuredImageFile = req.file;
                blogData = { ...req.body };
            } else if (req.body && Object.keys(req.body).length > 0) {
                // Raw JSON (Postman "raw" hoặc frontend fetch)
                blogData = req.body;
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Không có dữ liệu bài viết nào được gửi lên',
                });
            }

            // Parse JSON fields from multipart/form-data
            // Multer converts all fields to strings, so we need to parse JSON fields
            if (typeof blogData.tags === 'string') {
                try {
                    blogData.tags = JSON.parse(blogData.tags);
                } catch (e) {
                    // If not valid JSON, try splitting by comma
                    blogData.tags = blogData.tags.split(',').map((t) => t.trim()).filter(Boolean);
                }
            }

            if (typeof blogData.author === 'string') {
                try {
                    blogData.author = JSON.parse(blogData.author);
                } catch (e) {
                    logger.warn('Failed to parse author field as JSON:', e.message);
                }
            }

            if (typeof blogData.seo === 'string') {
                try {
                    blogData.seo = JSON.parse(blogData.seo);
                } catch (e) {
                    logger.warn('Failed to parse seo field as JSON:', e.message);
                }
            }

            logger.info('Parsed blog data:', {
                title: blogData.title,
                hasAuthor: !!blogData.author,
                authorUserId: blogData.author?.userId,
                tagsCount: Array.isArray(blogData.tags) ? blogData.tags.length : 0,
                category: blogData.category,
                status: blogData.status,
            });

            // 2. Validate với Joi – quan trọng: validate đúng dữ liệu (không phải req.body khi có file)
            const { error } = createBlogSchema.validate(blogData, { abortEarly: false });

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Dữ liệu không hợp lệ',
                    errors: error.details.map((e) => e.message),
                });
            }

            // 3. Gọi service với cả featuredImage và images
            const blog = await blogService.createBlog(blogData, featuredImageFile, imageFiles);

            logger.info('Blog created successfully:', {
                blogId: blog._id,
                title: blog.title,
                hasFeaturedImage: !!blog.featuredImage,
                imagesCount: blog.images?.length || 0,
            });

            // 4. Trả kết quả
            return res.status(201).json({
                success: true,
                message: 'Tạo bài viết thành công',
                data: blog,
            });
        } catch (error) {
            logger.error('BlogController.createBlog error:', {
                message: error.message,
                stack: error.stack,
                userId: blogData.author?.userId || req.user?.id,
                title: blogData.title,
                hasFeaturedImage: !!featuredImageFile,
                imagesCount: imageFiles.length,
            });

            return next(error); // để error middleware xử lý
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

    bulkDeleteBlogs = async (req, res, next) => {
        try {
            const { blogIds } = req.body;
            const userId = req.user?.userId;
            const userRole = req.user?.role;

            const result = await blogService.deleteBlogsBulk(blogIds, userId, userRole);

            return res.status(200).json({
                success: true,
                message: 'Xóa blog hàng loạt thành công',
                data: result,
            });
        } catch (error) {
            logger.error('Bulk delete blog error:', error);
            next(error);
        }
    };
}

export default new BlogController();
