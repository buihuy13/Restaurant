import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import logger from '../utils/logger.js';
import CloudinaryService from './cloudinaryService.js';
import slugify from 'slugify';
import AppError from '../utils/appError.js';

class BlogService {
    async createBlog(blogData, featuredImageFile = null, imageFiles = []) {
        let uploadedPublicIds = [];

        try {
            const {
                title,
                content,
                excerpt: providedExcerpt,
                category = 'other',
                tags = [],
                status = 'draft',
                author,
                seo,
            } = blogData;

            // === 1. Validate cơ bản ===
            if (!title?.trim()) throw new AppError('Tiêu đề bài viết là bắt buộc', 400);
            if (!content?.trim()) throw new AppError('Nội dung bài viết là bắt buộc', 400);
            if (!author?.userId) throw new AppError('Thiếu thông tin tác giả', 400);

            // === 2. Upload ảnh bìa nếu có ===
            let featuredImage = null;
            if (featuredImageFile) {
                const uploadResult = await CloudinaryService.uploadImage(
                    featuredImageFile.buffer || featuredImageFile.path,
                    'foodeats/blogs/covers',
                    title,
                );

                featuredImage = {
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id,
                    width: uploadResult.width,
                    height: uploadResult.height,
                };
                uploadedPublicIds.push(uploadResult.public_id);
            }

            // === 3. Upload nhiều ảnh content nếu có ===
            let images = [];
            if (imageFiles && imageFiles.length > 0) {
                const uploadPromises = imageFiles.map(async (file, index) => {
                    const result = await CloudinaryService.uploadImage(
                        file.buffer,
                        'foodeats/blogs/content',
                        `${title}_img_${index + 1}`,
                    );
                    uploadedPublicIds.push(result.public_id);
                    return {
                        url: result.secure_url,
                        publicId: result.public_id,
                    };
                });
                images = await Promise.all(uploadPromises);
            }

            // === 4. Tạo slug duy nhất ===
            let slug = slugify(title, { lower: true, strict: true, trim: true });
            const existingBlog = await Blog.findOne({ slug }).lean();
            if (existingBlog) {
                slug = `${slug}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
            }

            // === 5. Tạo excerpt tự động ===
            const cleanText = content
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            const excerpt =
                providedExcerpt?.trim() || (cleanText.length > 200 ? cleanText.slice(0, 197) + '...' : cleanText);

            // === 6. Tính thời gian đọc ===
            const readTime = Math.max(1, Math.ceil(cleanText.split(/\s+/).filter(Boolean).length / 200));

            // === 7. TẠO BLOG – KHÔNG DÙNG TRANSACTION (an toàn với mọi môi trường) ===
            const blog = await Blog.create({
                title: title.trim(),
                slug,
                content: content.trim(),
                excerpt,
                featuredImage,
                images,
                author: {
                    userId: author.userId,
                    name: author.name?.trim() || 'Ẩn danh',
                    avatar: author.avatar || null,
                },
                category,
                tags: [...new Set(tags.map((t) => t?.trim()?.toLowerCase()).filter(Boolean))],
                status,
                publishedAt: status === 'published' ? new Date() : null,
                readTime,
                seo: seo || undefined,
            });

            logger.info(`Blog created successfully | ID: ${blog._id} | Title: ${title}`);

            // Trả về blog đầy đủ + virtuals
            return await Blog.findById(blog._id).select('-likes -comments -__v').lean({ virtuals: true });
        } catch (error) {
            // Xóa ảnh nếu upload thất bại
            if (uploadedPublicIds.length > 0) {
                await Promise.all(
                    uploadedPublicIds.map((id) =>
                        CloudinaryService.deleteImage(id).catch((err) =>
                            logger.warn('Failed to delete uploaded image on error', err),
                        ),
                    ),
                );
            }

            logger.error('blogService.createBlog failed:', {
                message: error.message,
                stack: error.stack,
                title: blogData.title,
                authorId: blogData.author?.userId,
            });

            throw error instanceof AppError ? error : new AppError('Tạo bài viết thất bại', 500);
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
                throw new AppError('Forbidden: Unauthorized to update this blog', 403);
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

    async deleteBlogsBulk(blogIds = [], userId, userRole) {
        try {
            if (!Array.isArray(blogIds) || blogIds.length === 0) {
                throw new AppError('Danh sách blogIds không hợp lệ', 400);
            }

            // Validate ObjectId
            const validIds = blogIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
            if (validIds.length === 0) {
                throw new AppError('Không có blogId hợp lệ', 400);
            }

            // Lấy danh sách blog
            const blogs = await Blog.find({ _id: { $in: validIds } });

            if (!blogs.length) {
                throw new AppError('Không tìm thấy blog nào', 404);
            }

            // Phân quyền
            if (userRole !== 'ADMIN') {
                const unauthorized = blogs.filter((b) => b.author.userId !== userId);
                if (unauthorized.length > 0) {
                    throw new AppError('Không có quyền xóa một số blog', 403);
                }
            }

            // Xóa ảnh Cloudinary
            const imagePublicIds = blogs.map((b) => b.featuredImage?.publicId).filter(Boolean);

            await Promise.all(imagePublicIds.map((id) => CloudinaryService.deleteImage(id).catch(() => null)));

            // Xóa blogs
            const result = await Blog.deleteMany({ _id: { $in: validIds } });

            // Xóa comments liên quan
            await Comment.deleteMany({ blogId: { $in: validIds } });

            logger.info(`Bulk delete blogs | Count: ${result.deletedCount}`);

            return {
                deletedCount: result.deletedCount,
            };
        } catch (error) {
            logger.error('Bulk delete blogs error:', error);
            throw error;
        }
    }
}

export default new BlogService();
