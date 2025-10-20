const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  note: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
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
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["PENDING", "RECEIVED", "CONFIRMED", "CANCELLED", "DELIVERED"],
      default: "PENDING",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "FAILED", "REFUNDED"],
      default: "UNPAID",
      index: true,
    },
    deliveryStatus: {
      type: String,
      enum: ["WAITING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "WAITING",
      index: true,
    },
    deliveryTimeEstimate: {
      type: Number, // phút
    },
    shippingAddress: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Index tổng hợp để tối ưu query
orderSchema.index({ createdAt: -1 }); // sắp xếp mới nhất
orderSchema.index({ userId: 1, createdAt: -1 }); // tìm đơn hàng theo user
orderSchema.index({ restaurantId: 1, createdAt: -1 }); // tìm theo nhà hàng
orderSchema.index({ orderStatus: 1, createdAt: -1 }); // thống kê theo trạng thái
orderSchema.index({ paymentStatus: 1, deliveryStatus: 1 }); // hỗ trợ truy vấn tổng hợp

module.exports = mongoose.model("Order", orderSchema);
