import redisClient from "../config/redis.js";
import logger from "../utils/logger.js";

class CacheService {
  async getOrder(orderId) {
    try {
      const cached = await redisClient.get(`order:${orderId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logger.error("Cache get error:", error);
      return null;
    }
  }

  async setOrder(orderId, orderData, ttl = 3600) {
    try {
      await redisClient.set(`order:${orderId}`, JSON.stringify(orderData), ttl);
    } catch (error) {
      logger.error("Cache set error:", error);
    }
  }

  async deleteOrder(orderId) {
    try {
      await redisClient.del(`order:${orderId}`);
    } catch (error) {
      logger.error("Cache delete error:", error);
    }
  }

  async getUserOrders(userId) {
    try {
      const cached = await redisClient.get(`user_orders:${userId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logger.error("Cache get user orders error:", error);
      return null;
    }
  }

  async setUserOrders(userId, orders, ttl = 1800) {
    try {
      await redisClient.set(
        `user_orders:${userId}`,
        JSON.stringify(orders),
        ttl
      );
    } catch (error) {
      logger.error("Cache set user orders error:", error);
    }
  }

  async invalidateUserOrders(userId) {
    try {
      await redisClient.del(`user_orders:${userId}`);
    } catch (error) {
      logger.error("Cache invalidate user orders error:", error);
    }
  }
}

export default new CacheService();
