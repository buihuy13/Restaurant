const logger = require("../utils/logger");
const axios = require("axios");

class OrderService {
  // Create new order
  async createOrder(orderData) {
    logger.info(`Creating order for user: ${orderData.userId}`);

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
