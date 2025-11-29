import { v2 as cloudinary } from 'cloudinary';
import commentService from '../services/commentService.js';
import { get } from 'mongoose';

const createComment = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { content, parentId } = req.body;
        const images = req.files || [];

        const comment = await commentService.addComment({
            blogId,
            content: content || '',
            images,
            user: req.user, // từ authMiddleware
            parentId: parentId || null,
        });

        return res.status(201).json({
            success: true,
            comment,
        });
    } catch (error) {
        // Xóa ảnh nếu lỗi
        if (req.files) {
            req.files.forEach((file) => cloudinary.uploader.destroy(file.public_id));
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

const replyComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const images = req.files || [];

        // Lấy blogId từ parent comment
        const parent = await commentService.getCommentById(commentId);
        if (!parent) return res.status(404).json({ message: 'Comment không tồn tại' });

        const reply = await commentService.addComment({
            blogId: parent.blogId,
            content: content || '',
            images,
            user: req.user,
            parentId: commentId,
        });

        return res.status(201).json({ success: true, comment: reply });
    } catch (error) {
        if (req.files) req.files.forEach((f) => cloudinary.uploader.destroy(f.public_id));
        return res.status(500).json({ success: false, message: error.message });
    }
};

const likeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        const result = await commentService.toggleLikeComment(commentId, userId);
        return res.json({ success: true, ...result });
    } catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};

const getComments = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { page = 1, limit = 15 } = req.query;

        const data = await commentService.getCommentsByBlog(blogId, page, limit);
        return res.json({ success: true, ...data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getReplies = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const data = await commentService.getRepliesByCommentId(commentId, page, limit);
        return res.json({ success: true, ...data });
    } catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};

const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const images = req.files || [];
        const userId = req.user.id;

        const comment = await commentService.updateComment(commentId, { content, images }, userId);

        return res.json({ success: true, comment });
    } catch (error) {
        if (req.files) {
            req.files.forEach((f) => cloudinary.uploader.destroy(f.public_id));
        }
        return res.status(400).json({ success: false, message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        await commentService.deleteComment(commentId, userId);
        return res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export default {
    createComment,
    replyComment,
    likeComment,
    getComments,
    getReplies,
    updateComment,
    deleteComment,
};
