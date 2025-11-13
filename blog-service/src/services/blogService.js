import Blog from '../models/Blog.js';
import logger from '../utils/logger.js';

class BlogService {
    async createBlog(blogData) {
        try {
            const blog = new Blog(blogData);

            if (blog.status === 'published' && !blog.publishedAt) {
                blog.publishedAt = new Date();
            }

            await blog.save();
            logger.info(`Blog created: ${blog._id}`);
            return blog;
        } catch (error) {
            logger.error('Create blog error:', error);
            throw error;
        }
    }

    async getBlogs(filters = {}) {
        try {
            const query = {};

            if (filters.status) {
                query.status = filters.status;
            } else {
                query.status = 'published';
            }

            if (filters.category) {
                query.category = filters.category;
            }

            if (filters.authorId) {
                query['author.userId'] = filters.authorId;
            }

            if (filters.tag) {
                query.tags = filters.tag;
            }

            if (filters.search) {
                query.$text = { $search: filters.search };
            }

            const page = parseInt(filters.page) || 1;
            const limit = parseInt(filters.limit) || 10;
            const skip = (page - 1) * limit;

            let sort = { createdAt: -1 };
            if (filters.sortBy === 'views') {
                sort = { views: -1 };
            } else if (filters.sortBy === 'likes') {
                sort = { 'likes.length': -1 };
            } else if (filters.sortBy === 'oldest') {
                sort = { createdAt: 1 };
            }

            const blogs = await Blog.find(query).sort(sort).skip(skip).limit(limit).select('-likes').lean();

            const total = await Blog.countDocuments(query);

            return {
                blogs: blogs.map((blog) => ({
                    ...blog,
                    likesCount: blog.likes?.length || 0,
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('Get blogs error:', error);
            throw error;
        }
    }

    async getBlogById(blogId) {
        try {
            const blog = await Blog.findById(blogId).lean(); // trả về Mongoose Document

            if (!blog) {
                throw new Error('Blog not found');
            }

            return {
                ...blog,
                likesCount: blog.likes?.length || 0,
            };
        } catch (error) {
            logger.error('Get blog by ID error:', error);
            throw error;
        }
    }

    async getBlogBySlug(slug) {
        try {
            const blog = await Blog.findOne({ slug, status: 'published' });

            if (!blog) {
                throw new Error('Blog not found');
            }

            blog.views += 1;
            await blog.save();

            const blogObj = blog.toObject();
            return {
                ...blogObj,
                likesCount: blogObj.likes?.length || 0,
            };
        } catch (error) {
            logger.error('Get blog by slug error:', error);
            throw error;
        }
    }

    async updateBlog(blogId, updateData, userId) {
        try {
            const blog = await Blog.findById(blogId);

            if (!blog) {
                throw new Error('Blog not found');
            }

            if (blog.author.userId !== userId) {
                throw new Error('Unauthorized to update this blog');
            }

            Object.keys(updateData).forEach((key) => {
                if (updateData[key] !== undefined) {
                    blog[key] = updateData[key];
                }
            });

            if (updateData.status === 'published' && !blog.publishedAt) {
                blog.publishedAt = new Date();
            }

            await blog.save();
            logger.info(`Blog updated: ${blogId}`);
            return blog;
        } catch (error) {
            logger.error('Update blog error:', error);
            throw error;
        }
    }

    async deleteBlog(blogId, userId) {
        try {
            const blog = await Blog.findById(blogId);

            if (!blog) {
                throw new Error('Blog not found');
            }

            if (blog.author.userId !== userId) {
                throw new Error('Unauthorized to delete this blog');
            }

            await Blog.findByIdAndDelete(blogId);
            await Comment.deleteMany({ blogId });

            logger.info(`Blog deleted: ${blogId}`);
            return { message: 'Blog deleted successfully' };
        } catch (error) {
            logger.error('Delete blog error:', error);
            throw error;
        }
    }

    async getPopularBlogs(limit = 5) {
        try {
            const blogs = await Blog.find({ status: 'published' })
                .sort({ views: -1 })
                .limit(limit)
                .select('title slug excerpt featuredImage views readTime publishedAt')
                .lean();

            return blogs;
        } catch (error) {
            logger.error('Get popular blogs error:', error);
            throw error;
        }
    }

    async getRelatedBlogs(blogId, limit = 3) {
        try {
            const blog = await Blog.findById(blogId);

            if (!blog) {
                return [];
            }

            const relatedBlogs = await Blog.find({
                _id: { $ne: blogId },
                status: 'published',
                $or: [{ category: blog.category }, { tags: { $in: blog.tags } }],
            })
                .limit(limit)
                .select('title slug excerpt featuredImage readTime publishedAt')
                .lean();

            return relatedBlogs;
        } catch (error) {
            logger.error('Get related blogs error:', error);
            throw error;
        }
    }
}
