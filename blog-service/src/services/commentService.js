import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import logger from '../utils/logger.js';

class CommentService {
    async addComment({ blogId, content = '', images = [], user, parentId = null }) {
        try {
            // Validate input
            if (!content.trim()) {
                throw new Error('Comment content cannot be empty');
            }

            let path;

            if (parentId) {
                const parent = await Comment.findById(parentId);
                if (!parent) throw new Error('Parent comment not found');

                path = `${parent.path}.${parent._id}`;
            } else {
                // tạm thời gán placeholder
                path = 'root';
            }

            const comment = new Comment({
                blogId,
                parentId: parentId || null,
                content: content.trim(),
                path: parentId ? `${parent.path}.${parentId}` : null,
                images: images.map((img) => ({
                    url: img.secure_url || img.url,
                    publicId: img.public_id,
                    width: img.width,
                    height: img.height,
                    format: img.format,
                })),
                author: {
                    userId: user.userId,
                    name: user.username,
                    avatar: user.avatar || '',
                },
            });

            await comment.save();

            // Chỉ update Blog nếu là comment gốc
            if (!parentId) {
                await Blog.findByIdAndUpdate(
                    blogId,
                    { $push: { comments: comment._id } },
                    { new: false }, // không cần return document
                );
            }

            logger.info(`Comment added: ${comment._id} | Images: ${images.length}`);
            return comment;
        } catch (error) {
            logger.error('Add comment error:', error);
            throw error;
        }
    }

    async toggleLikeComment(commentId, userId) {
        try {
            // Sử dụng findByIdAndUpdate thay vì find + save
            const comment = await Comment.findById(commentId);

            if (!comment) {
                throw new Error('Comment not found');
            }

            const index = comment.likes.indexOf(userId);
            const isLiking = index === -1;

            if (isLiking) {
                comment.likes.push(userId);
            } else {
                comment.likes.splice(index, 1);
            }

            await comment.save();

            logger.info(`Comment like toggled: ${commentId} by user ${userId}`);

            return {
                likesCount: comment.likes.length,
                liked: isLiking,
            };
        } catch (error) {
            logger.error('Toggle like comment error:', error);
            throw error;
        }
    }

    // Lấy comment theo blog + tối ưu query
    async getCommentsByBlog(blogId, page = 1, limit = 15) {
        try {
            const skip = (page - 1) * limit;

            // Query 1 lần để lấy root comments
            const [rootComments, totalRoots] = await Promise.all([
                Comment.find({
                    blogId,
                    parentId: null,
                    isDeleted: { $ne: true },
                })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .select('-__v') // ✅ Bỏ __v không cần thiết
                    .lean(),
                Comment.countDocuments({
                    blogId,
                    parentId: null,
                    isDeleted: { $ne: true },
                }),
            ]);

            // Nếu không có root comments, trả về ngay
            if (rootComments.length === 0) {
                return {
                    comments: [],
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: totalRoots,
                        pages: 0,
                    },
                };
            }

            // Lấy tất cả reply 1 lần với sort theo path (tự động sắp xếp cây)
            const rootIds = rootComments.map((c) => c._id);
            const allReplies = await Comment.find({
                blogId,
                parentId: { $in: rootIds },
                isDeleted: { $ne: true },
            })
                .sort({ path: 1 }) // Sort theo path (đã định dạng cây)
                .select('-__v')
                .lean();

            // Map replies vào root comments
            const repliesMap = {};
            allReplies.forEach((reply) => {
                const parentIdStr = reply.parentId.toString();
                if (!repliesMap[parentIdStr]) {
                    repliesMap[parentIdStr] = [];
                }
                repliesMap[parentIdStr].push(reply);
            });

            const comments = rootComments.map((root) => ({
                ...root,
                likesCount: root.likes?.length || 0,
                replies: repliesMap[root._id.toString()] || [],
            }));

            return {
                comments,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: totalRoots,
                    pages: Math.ceil(totalRoots / limit),
                },
            };
        } catch (error) {
            logger.error('Get comments by blog error:', error);
            throw error;
        }
    }

    async getRepliesByCommentId(commentId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;

            const [replies, total] = await Promise.all([
                Comment.find({
                    parentId: commentId,
                    isDeleted: { $ne: true },
                })
                    .sort({ path: 1 })
                    .skip(skip)
                    .limit(limit)
                    .select('-__v')
                    .lean(),
                Comment.countDocuments({
                    parentId: commentId,
                    isDeleted: { $ne: true },
                }),
            ]);

            return {
                replies: replies.map((r) => ({
                    ...r,
                    likesCount: r.likes?.length || 0,
                })),
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('Get replies by comment ID error:', error);
            throw error;
        }
    }

    async deleteComment(commentId, userId) {
        try {
            const comment = await Comment.findById(commentId);

            if (!comment) {
                throw new Error('Comment not found');
            }

            if (comment.author.userId !== userId) {
                throw new Error('Unauthorized');
            }

            comment.isDeleted = true;
            await comment.save();

            logger.info(`Comment deleted: ${commentId}`);
            return { message: 'Comment deleted' };
        } catch (error) {
            logger.error('Delete comment error:', error);
            throw error;
        }
    }

    async updateComment(commentId, { content, images }, userId) {
        try {
            const comment = await Comment.findById(commentId);

            if (!comment) {
                throw new Error('Comment not found');
            }

            if (comment.author.userId !== userId) {
                throw new Error('Unauthorized');
            }

            if (content?.trim()) {
                comment.content = content.trim();
            }

            if (images && images.length > 0) {
                comment.images = images.map((img) => ({
                    url: img.secure_url || img.url,
                    publicId: img.public_id,
                    width: img.width,
                    height: img.height,
                    format: img.format,
                }));
            }

            await comment.save();

            logger.info(`Comment updated: ${commentId}`);
            return comment;
        } catch (error) {
            logger.error('Update comment error:', error);
            throw error;
        }
    }
}

export default new CommentService();
