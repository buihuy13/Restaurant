// src/models/Comment.js
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
    {
        blogId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
            required: true,
            index: true,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
            index: true,
        },
        // Dùng để sort thứ tự và lấy comment theo cây chính xác
        path: {
            type: String,
            required: true,
            index: true,
            // Ví dụ: "0001.0003.0007" → comment con của 0007, 0007 con của 0003...
        },
        ancestors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ], // [root, parent, grandparent...]

        author: {
            userId: { type: String, required: true },
            name: { type: String, required: true },
            avatar: String,
        },
        content: { type: String, required: true },
        images: [
            {
                url: { type: String, required: true },
                publicId: { type: String, required: true }, // để xóa sau này
                width: Number,
                height: Number,
                format: String,
            },
        ],
        likes: [{ type: String }], // userId
        isDeleted: { type: Boolean, default: false }, // soft delete
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

// Virtual
CommentSchema.virtual('likesCount').get(function () {
    return this.likes.length;
});

// Tạo path tự động trước khi save
CommentSchema.pre('save', async function (next) {
    if (this.isNew && this.parentId) {
        // Nếu là reply (có parentId)
        const parent = await this.constructor.findById(this.parentId);
        if (!parent) throw new Error('Parent comment not found');

        // Kế thừa path của cha + 4 ký tự cuối của ID
        // "0001.0002" + ".0003" = "0001.0002.0003"
        this.ancestors = [...parent.ancestors, parent._id];
        this.path = parent.path + '.' + this._id.toString().slice(-4).padStart(4, '0');
    } else if (this.isNew) {
        // Nếu là root comment (không có parentId)
        this.path = this._id.toString().slice(-4).padStart(4, '0');
        this.ancestors = [];
    }
    next();
});

CommentSchema.index({ blogId: 1, path: 1 }); // Lấy comment theo blog + path
CommentSchema.index({ blogId: 1, createdAt: -1 }); // Sắp xếp comment mới nhất
CommentSchema.index({ ancestors: 1 }); // Lấy tất cả con của một comment
CommentSchema.index({ blogId: 1, isDeleted: 1 }); // Lọc comment chưa xóa

export default mongoose.model('Comment', CommentSchema);
