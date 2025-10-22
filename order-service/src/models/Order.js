const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: String,
    required: true,
  },
  name: {
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
    default: "",
  },
});

const deliveryAddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String, default: "" },
});

const timelineSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    default: "",
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
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [
        (array) => array.length > 0,
        "Order must have at least one item",
      ],
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "READY",
        "DELIVERING",
        "DELIVERED",
        "CANCELLED",
        "FAILED",
      ],
      default: "PENDING",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["CARD", "CASH", "PAYPAL", "WALLET"],
      required: true,
    },
    paymentId: {
      type: String,
      index: true,
    },
    deliveryAddress: {
      type: deliveryAddressSchema,
      required: true,
    },
    // thời gian giao hàng dự kiến
    estimatedDeliveryTime: {
      type: Date,
    },
    // thời gian giao hàng thực tế
    actualDeliveryTime: {
      type: Date,
    },
    // note của khách hàng về việc giao hàng, địa chỉ, hoặc lời nhắn
    notes: {
      type: String,
      default: "",
    },
    cancellationReason: {
      type: String,
    },
    timeline: [timelineSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
orderSchema.index({ createdAt: -1 });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, status: 1 });
orderSchema.index({ status: 1, createdAt: -1 });

// Calculate estimated delivery time before saving
// orderSchema.pre("save", function (next) {
//   if (this.isNew && !this.estimatedDeliveryTime) {
//     const now = new Date();
//     // Estimate 45 minutes for delivery
//     this.estimatedDeliveryTime = new Date(now.getTime() + 45 * 60000);
//   }
//   next();
// });

// ghi lại lịch sử thay đổi trạng thái đơn hàng.
orderSchema.methods.addTimelineEntry = function (status, note = "") {
  this.timeline.push({
    status,
    note,
    timestamp: new Date(),
  });
};

// Virtual for order age
orderSchema.virtual("orderAge").get(function () {
  return Date.now() - this.createdAt;
});

// Ensure virtuals are included in JSON
orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Order", orderSchema);
