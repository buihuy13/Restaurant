import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Chema(
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
            // mô tả ngắn gọn
            type: String,
            required: [true, 'Excerpt cannot exceed 500 characters'],
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
        featuredImage: String,
        category: {
            type: String,
            ennum: ['recipe', 'review', 'tips', 'news', 'health', 'other'],
            default: 'other',
            index: true,
        },
        tags: [
            {
                type: String,
                trim: true,
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
        likes: [{ type: String }], // Array of user IDs who liked the post
        commentsCount: {
            type: Number,
            default: 0,
        },
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
    },
);

// Create slug before saving
blogSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
    }

    // Auto-generate excerpt
    if (!this.excerpt && this.content) {
        this.excerpt = this.content.substring(0, 200).replace(/<[^>]*>/g, '') + '...';
    }

    // Calculate read time
    if (this.content) {
        const wordCount = this.content.split(/\s+/).length;
        this.readTime = Math.ceil(wordCount / 200);
    }

    next();
});

// Indexes
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ 'author.userId': 1, status: 1 });
blogSchema.index({ category: 1, status: 1 });

// Virtuals
BlogSchema.virtual('likesCount').get(function () {
    return this.likes.length;
});
BlogSchema.virtual('commentsCount').get(function () {
    return this.comments.length;
});

BlogSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Blog', blogSchema);
