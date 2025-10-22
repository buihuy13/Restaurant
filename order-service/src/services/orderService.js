import rabbitmqConnection from "../config/rabbitmq.js";
import axios from "axios";
import logger from "../utils/logger.js";
import Order from "../models/Order.js";

class OrderService {
  generateOrderId() {
    return `ORD${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
  }

  async validateRestaurant(restaurantId) {
    try {
      const response = await axios.get(
        `${process.env.RESTAURANT_SERVICE_URL}/api/restaurant/${restaurantId}`,
        { timeout: 5000 }
      );

      return response.data;
    } catch (error) {
      logger.error("Restaurant validation error:", error);
      throw new Error("Restaurant not found or unavailable");
    }
  }

  calculateOrderAmounts(items, deliveryFee = 0, discount = 0) {
    const subtotal = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const tax = subtotal * 0.1; // 10% tax
    const finalAmount = subtotal + deliveryFee + tax - discount;

    return {
      totalAmount: subtotal,
      tax: parseFloat(tax.toFixed(2)),
      deliveryFee,
      discount,
      finalAmount: parseFloat(finalAmount.toFixed(2)),
    };
  }

  async createOrder(orderData, token) {
    try {
      // Validate restaurant
      const restaurant = await this.validateRestaurant(orderData.restaurantId);

      // Validate user
      await this.validateUser(orderData.userId, token);

      // Calculate amounts
      const amounts = this.calculateOrderAmounts(
        orderData.items,
        restaurant.deliveryFee || 0,
        orderData.discount || 0
      );

      // Create Order
      const order = new Order({
        orderId: this.generateOrderId(),
        userId: orderData.userId,
        restaurantId: orderData.restaurantId,
        restaurantName: restaurant.name,
        items: orderData.items,
        deliveryAddress: orderData.deliveryAddress,
        ...amounts,
        paymentMethod: orderData.paymentMethod,
        orderNote: orderData.orderNote,
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60000), // 45 minutes
      });

      await order.save();

      // Cache the order

      // Publish order created event
      await rabbitmqConnection.publishMessage(
        process.env.RABBITMQ_ORDER_EXCHANGE,
        "order.created",
        {
          orderId: order.orderId,
          userId: order.userId,
          restaurantId: order.restaurantId,
          totalAmount: order.finalAmount,
          paymentMethod: order.paymentMethod,
          timestamp: new Date().toISOString(),
        }
      );

      logger.info(`Order created successfully: ${order.orderId}`);
      return order;
    } catch (error) {
      logger.error("Create order error:", error);
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      // Try cache first
    } catch (error) {}
  }
}

export default new OrderService();
