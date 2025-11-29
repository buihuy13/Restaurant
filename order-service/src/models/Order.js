import mongoose from 'mongoose';
import slugify from 'slugify';
const orderItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
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
    // note yêu cầu tuỳ chỉnh cho từng món (cách chế biến, topping, size...) của món đó
    customizations: {
        type: String,
        default: '',
    },
});

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        userId: {
            type: String,
            required: true,
            index: true,
        },
        restaurantId: {
            type: String,
            required: true,
            index: true,
        },
        restaurantName: {
            type: String,
            required: true,
        },
        items: [orderItemSchema],
        deliveryAddress: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        discount: {
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
            required: true,
        },
        status: {
            type: String,
            enum: [
                'pending', // mới tạo, chờ restaurant xác nhận
                'confirmed', // restaurant xác nhận
                'preparing', // restaurant chuẩn bị món
                'ready', // món ăn sẵn sàng
                'completed', // khách nhận món
                'cancelled',
            ],
            default: 'pending',
            index: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'card', 'wallet'],
            required: true,
        },
        estimatedDeliveryTime: Date,
        actualDeliveryTime: Date,
        orderNote: String,
        cancellationReason: String,
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        review: String,
        slug: { type: String, unique: true, index: true },
    },
    {
        timestamps: true,
    },
);

// Sinh slug tự động trước khi save
orderSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = slugify(`${this.restaurantName}-${this.orderId}`, { lower: true, strict: true });
    }
    next();
});

orderSchema.index({ createdAt: -1 });
orderSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Order', orderSchema);
