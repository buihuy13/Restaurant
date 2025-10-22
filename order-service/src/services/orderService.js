const logger = require("../utils/logger");
const axios = require("axios");
const Order = require("../models/Order");
const rabbitmq = require("../config/rabbitmq");

class OrderService {
  // Create new order
  async createOrder(orderData) {
    logger.info(`Creating order for user: ${orderData.userId}`);

    try {
      const orderId = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      await this.validateRestaurant(orderData.restaurantId);

      const finalAmount = this.ca;

      const order = new Order({
        orderId,
        userId: orderData.userId,
        restaurantId: orderData.restaurantId,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        deliveryAddress: orderData.deliveryAddress,
        deliveryFee: orderData.deliveryFee || 0,
        discount: orderData.discount || 0,
        tax: orderData.tax || 0,
        finalAmount,
        paymentMethod: orderData.paymentMethod,
        notes: orderData.notes,
        deliveryTime: {
          estimated: new Date(Date.now() + 45 * 60000), // 45 minutes
        },
      });

      await order.save();

      // Cache order

      // Publish order create event
      await rabbitmq.publishMessage(
        process.env.RABBITMQ_ORDER_EXCHANGE,
        process.env.RABBITMQ_ROUTING_ORDER_CREATED,
        {
          orderId: order.orderId,
          userId: order.userId,
          restaurantId: order.restaurantId,
          finalAmount: order.finalAmount,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
        }
      );
      return order;
    } catch (error) {}

    // Xác thực nhà hàng có tồn tại hoặc có sẵn không

    // Tính tổng đơn hàng
  }

  // Get order by ID
  async getOrderById(orderId, userId) {}

  // Get user orders with pagination
  async getUserOrders(userId, page = 1, limit = 10, status = null) {}

  async validateRestaurant(restaurantId) {
    try {
      const response = await axios.get(
        `${process.env.RESTAURANT_SERVICE_URL}/api/restaurants/${restaurantId}`,
        { timeout: 5000 }
      );

      if (!response.data || !response.data.isOpen) {
        throw new AppError(
          "Restaurant is currently closed",
          400,
          "RESTAURANT_CLOSED"
        );
      }

      return response.data;
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        logger.error("Restaurant service is not available");
        throw new AppError(
          "Restaurant service unavailable",
          503,
          "SERVICE_UNAVAILABLE"
        );
      }
      throw error;
    }
  }
}

module.exports = new OrderService();
