import Blog from '../models/Blog.js';
import logger from '../utils/logger.js';
import CloudinaryService from './cloudinaryService.js';
import slugify from 'slugify';

class BlogService {
    async createBlog(blogData, featuredImageFile = null) {
        const session = await Blog.startSession();
        session.startTransaction();

        try {
            const {
                title,
                content,
                excerpt: providedExcerpt,
                category = 'other',
                tags = [],
                status = 'draft',
                author,
            } = blogData;

            // === 1. VALIDATE DỮ LIỆU ĐẦU VÀO ===
            if (!title?.trim()) throw new Error('Tiêu đề bài viết là bắt buộc');
            if (!content?.trim()) throw new Error('Nội dung bài viết là bắt buộc');
            if (!author?.userId || !author?.name?.trim()) throw new Error('Thông tin tác giả không hợp lệ');

            // === 2. UPLOAD ẢNH BÌA (NẾU CÓ) ===
            let featuredImage = null;
            let uploadedPublicId = null;

            if (featuredImageFile?.buffer) {
                const uploadResult = await CloudinaryService.uploadImage(
                    featuredImageFile.buffer,
                    'foodeats/blogs/covers',
                    featuredImageFile.originalname.split('.').slice(0, -1).join('.'),
                );

                featuredImage = {
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id,
                    width: uploadResult.width,
                    height: uploadResult.height,
                };
                uploadedPublicId = uploadResult.public_id;
            }

            // === 3. TẠO SLUG DUY NHẤT 100% ===
            const baseSlug = slugify(title, { lower: true, strict: true, trim: true });
            let slug = baseSlug;

            const slugExists = await Blog.findOne({ slug }).lean();
            if (slugExists) {
                const randomSuffix = `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
                slug = `${baseSlug}-${randomSuffix}`;
            }

            // === 4. TỰ ĐỘNG TẠO EXCERPT NẾU CHƯA CÓ ===
            let excerpt = providedExcerpt?.trim();
            if (!excerpt && content) {
                const cleanText = content
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                excerpt = cleanText.length > 200 ? cleanText.substring(0, 197) + '...' : cleanText;
            }

            // === 5. TÍNH THỜI GIAN ĐỌC ===
            const wordCount = content
                .replace(/<[^>]*>/g, '')
                .trim()
                .split(/\s+/).length;
            const readTime = Math.max(1, Math.ceil(wordCount / 200));

            // === 6. XÁC ĐỊNH publishedAt ===
            const publishedAt = status === 'published' ? new Date() : null;

            // === 7. TẠO BLOG MỚI ===
            const blog = new Blog({
                title: title.trim(),
                slug,
                content: content.trim(),
                excerpt,
                featuredImage,
                author: {
                    userId: author.userId,
                    name: author.name.trim(),
                    avatar: author.avatar || null,
                },
                category,
                tags: tags.map((t) => t?.trim().toLowerCase()).filter(Boolean),
                status,
                publishedAt,
                readTime,
                views: 0,
                likes: [],
                comments: [],
            });

            await blog.save({ session });

            await session.commitTransaction();

            logger.info(`Blog created successfully | ID: ${blog._id} | Slug: ${slug} | Author: ${author.userId}`);

            // Trả về dữ liệu sạch + virtuals
            const populatedBlog = await Blog.findById(blog._id).select('-likes -__v').lean({ virtuals: true });

            return populatedBlog;
        } catch (error) {
            await session.abortTransaction();

            // === ROLLBACK ẢNH NẾU ĐÃ UPLOAD ===
            if (uploadedPublicId) {
                await CloudinaryService.deleteImage(uploadedPublicId).catch(() => {});
            }

            logger.error('Create blog failed:', {
                message: error.message,
                stack: error.stack,
                authorId: blogData.author?.userId,
                title: blogData.title,
            });

            throw error;
        } finally {
            session.endSession();
        }
    }

    async getBlogs(filters = {}) {
        try {
            const query = { status: filters.status || 'published' };
            if (filters.category) query.category = filters.category;
            if (filters.authorId) query['author.userId'] = filters.authorId;
            if (filters.tag) query.tags = filters.tag;
            if (filters.search) query.$text = { $search: filters.search };

            const page = parseInt(filters.page) || 1;
            const limit = parseInt(filters.limit) || 10;
            const skip = (page - 1) * limit;

            let sort = { createdAt: -1 };
            if (filters.sortBy === 'views') sort = { views: -1 };
            else if (filters.sortBy === 'likes') sort = { likes: -1 };

            const blogs = await Blog.find(query).sort(sort).skip(skip).limit(limit).select('-content').lean();

            const total = await Blog.countDocuments(query);

            return {
                blogs: blogs.map((b) => ({
                    ...b,
                    likesCount: b.likes?.length || 0,
                    commentsCount: b.comments?.length || 0,
                })),
                pagination: { page, limit, total, pages: Math.ceil(total / limit) },
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
                commentsCount: blogObj.comments?.length || 0,
            };
        } catch (error) {
            logger.error('Get blog by slug error:', error);
            throw error;
        }
    }

    async toggleLikeBlog(blogId, userId) {
        try {
            // Tìm blog theo Id
            const blog = await Blog.findById(blogId);

            if (!blog) {
                throw new Error('Blog not found');
            }

            // Kiểm tra nếu userId đã có trong mảng likes thì bỏ ra, nếu chưa có thì thêm vào
            const index = blog.likes.indexOf(userId);
            if (index === -1) {
                // Nếu chưa like (index = -1) → thêm userId vào mảng likes
                blog.likes.push(userId);
            } else {
                // Nếu đã like (index >= 0) → xóa userId khỏi mảng likes
                blog.likes.splice(index, 1);
            }
            await blog.save();

            logger.info(`Blog like toggled: ${blogId} by user ${userId}`);
            return {
                likesCount: blog.likes.length,
                liked: index === -1, // true nếu vừa like, false nếu vừa un-like
            };
        } catch (error) {
            logger.error('Toggle like blog error:', error);
            throw error;
        }
    }

    async updateBlog(blogId, updateData, userId, userRole) {
        try {
            const blog = await Blog.findById(blogId);

            if (!blog) {
                throw new Error('Blog not found');
            }

            if (blog.author.userId !== userId && userRole !== 'ADMIN') {
                return res.status(403).json({ success: false, message: 'Forbidden: Unauthorized to update this blog' });
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

export default new BlogService();
