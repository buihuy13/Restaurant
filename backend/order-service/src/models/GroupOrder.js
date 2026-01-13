import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Schema cho từng người tham gia đặt món
const participantSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    items: [
        {
            productId: {
                type: String,
                required: true,
            },
            productName: {
                type: String,
                required: true,
            },
            cartItemImage: {
                type: String,
                default: '',
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            },
            customizations: {
                type: String,
                default: '',
            },
        },
    ],
    totalAmount: {
        type: Number,
        default: 0,
    },
    // Thông tin thanh toán riêng
    paymentStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'wallet'],
        default: null,
    },
    paymentTransactionId: {
        type: String,
        default: null,
    },
    paidAmount: {
        type: Number,
        default: 0,
    },
    paidAt: {
        type: Date,
        default: null,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
});

const groupOrderSchema = new mongoose.Schema(
    {
        // ID duy nhất cho group order
        groupOrderId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        // Link token để chia sẻ (UUID)
        shareToken: {
            type: String,
            unique: true,
            index: true,
            default: uuidv4,
        },
        // Người tạo group order
        creatorId: {
            type: String,
            required: true,
            index: true,
        },
        creatorName: {
            type: String,
            required: true,
        },
        // Thông tin nhà hàng
        restaurantId: {
            type: String,
            required: true,
            index: true,
        },
        restaurantName: {
            type: String,
            required: true,
        },
        // Danh sách người tham gia đặt món
        participants: [participantSchema],
        // Địa chỉ giao hàng chung
        deliveryAddress: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
        },
        // Tổng tiền của toàn bộ group
        totalAmount: {
            type: Number,
            default: 0,
        },
        deliveryFee: {
            type: Number,
            default: 0,
        },
        tax: {
            type: Number,
            default: 0,
        },
        finalAmount: {
            type: Number,
            default: 0,
        },
        // Trạng thái của group order
        status: {
            type: String,
            enum: [
                'open', // Đang mở, mọi người có thể tham gia
                'locked', // Đã khóa, không nhận thêm người
                'ordered', // Đã đặt hàng chính thức
                'cancelled', // Đã hủy
            ],
            default: 'open',
            index: true,
        },
        // ID của order chính thức sau khi confirm
        finalOrderId: {
            type: String,
            default: null,
        },
        // Thời gian deadline để tham gia
        expiresAt: {
            type: Date,
            required: true,
        },
        // Ghi chú chung
        groupNote: {
            type: String,
            default: '',
        },
        // Phương thức thanh toán mặc định (nếu thanh toán chung)
        paymentMethod: {
            type: String,
            enum: ['cash', 'card', 'wallet', 'split'], // split = mỗi người tự thanh toán
            default: 'split',
        },
        // Tổng số tiền đã được thanh toán
        totalPaidAmount: {
            type: Number,
            default: 0,
        },
        // Cho phép thanh toán riêng
        allowIndividualPayment: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

// shareToken default is provided by schema default (uuidv4)

// Index cho tìm kiếm nhanh
groupOrderSchema.index({ createdAt: -1 });
groupOrderSchema.index({ creatorId: 1, status: 1 });
groupOrderSchema.index({ shareToken: 1 });

export default mongoose.model('GroupOrder', groupOrderSchema);
