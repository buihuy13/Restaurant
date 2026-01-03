// src/models/Blog.js
import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            unique: true,
            index: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        excerpt: {
            type: String,
            maxlength: [500, 'Excerpt cannot exceed 500 characters'], // Sửa lỗi: bỏ required nếu muốn tự động tạo
        },
        author: {
            userId: {
                type: String,
                required: true,
                index: true,
            },
            name: {
                type: String,
                required: true,
            },
            avatar: String,
        },
        featuredImage: {
            url: { type: String, required: false },
            alt: { type: String, required: false },
        },
        category: {
            type: String,
            enum: ['recipe', 'review', 'tips', 'news', 'health', 'other'],
            default: 'other',
            index: true,
        },
        tags: [
            {
                type: String,
                trim: true,
                lowercase: true,
            },
        ],
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft',
            index: true,
        },
        readTime: {
            type: Number,
            default: 5,
        },
        views: {
            type: Number,
            default: 0,
        },
        likes: [{ type: String }], // userId strings
        publishedAt: Date,
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],

        seo: {
            metaTitle: String,
            metaDescription: String,
            keywords: [String],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

// Pre-save hook
blogSchema.pre('save', function (next) {
    // Tạo slug đẹp + tránh trùng
    if (this.isModified('title') || !this.slug) {
        const base = slugify(this.title, { lower: true, strict: true });
        this.slug = `${base}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
    }

    // Tự động tạo excerpt nếu chưa có
    if (!this.excerpt && this.content) {
        const text = this.content.replace(/<[^>]*>/g, '').trim();
        this.excerpt = text.length > 200 ? text.substring(0, 197) + '...' : text;
    }

    // Tính thời gian đọc
    if (this.content) {
        const words = this.content.trim().split(/\s+/).length;
        this.readTime = Math.max(1, Math.ceil(words / 200));
    }

    next();
});

// Indexes
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogSchema.index({ 'author.userId': 1, status: 1 });
blogSchema.index({ category: 1, status: 1 });

// Virtuals - KHÔNG ĐƯỢC trùng tên với field thật!
blogSchema.virtual('likesCount').get(function () {
    return this.likes?.length || 0;
});

blogSchema.virtual('commentsCount').get(function () {
    return this.comments?.length || 0;
});

// Bắt buộc bật virtuals khi trả về JSON
blogSchema.set('toJSON', { virtuals: true });
blogSchema.set('toObject', { virtuals: true });

export default mongoose.model('Blog', blogSchema);
