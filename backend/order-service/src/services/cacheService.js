import redisClient from '../config/redis.js';
import logger from '../utils/logger.js';

class CacheService {
    async getOrder(orderId) {
        try {
            const cached = await redisClient.get(`order:${orderId}`);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            logger.error('Cache get error:', error);
            return null;
        }
    }

    async setOrder(orderId, orderData, ttl = 3600) {
        try {
            // redisClient.set wrapper expects (key, value, expirationInSeconds)
            await redisClient.set(`order:${orderId}`, JSON.stringify(orderData), ttl);
        } catch (error) {
            logger.error('Cache set error:', error);
        }
    }

    async deleteOrder(orderId) {
        try {
            await redisClient.del(`order:${orderId}`);
        } catch (error) {
            logger.error('Cache delete error:', error);
        }
    }

    async getUserOrders(userId) {
        try {
            const cached = await redisClient.get(`user_orders:${userId}`);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            logger.error('Cache get user orders error:', error);
            return null;
        }
    }

    async setUserOrders(userId, orders, ttl = 1800) {
        try {
            await redisClient.set(`user_orders:${userId}`, JSON.stringify(orders), ttl);
        } catch (error) {
            logger.error('Cache set user orders error:', error);
        }
    }

    async invalidateUserOrders(userId) {
        try {
            await redisClient.del(`user_orders:${userId}`);
        } catch (error) {
            logger.error('Cache invalidate user orders error:', error);
        }
    }

    async getCart(userId) {
        try {
            if (!userId) {
                throw new Error('userId is required');
            }

            const cached = await redisClient.get(`cart:${userId}`);

            if (cached) {
                logger.debug(`Cart cache hit: ${userId}`);
                return JSON.parse(cached);
            }

            logger.debug(`Cart cache miss: ${userId}`);
            return null;
        } catch (error) {
            logger.warn(`Cache get cart error: ${error.message}`);
            return null;
        }
    }

    async setCart(userId, cartData, ttl = 3600) {
        try {
            if (!userId) {
                throw new Error('userId is required');
            }

            // redisClient.set wrapper expects (key, value, expirationInSeconds)
            await redisClient.set(`cart:${userId}`, JSON.stringify(cartData), ttl);

            logger.debug(`Cart cached: ${userId} (${cartData.restaurants?.length || 0} restaurants, TTL: ${ttl}s)`);
        } catch (error) {
            logger.warn(`Cache set cart error: ${error.message}`);
        }
    }

    async deleteCart(userId) {
        try {
            if (!userId) {
                throw new Error('userId is required');
            }

            await redisClient.del(`cart:${userId}`);
            logger.debug(`Cart cache deleted: ${userId}`);
        } catch (error) {
            logger.warn(`Cache delete cart error: ${error.message}`);
        }
    }
}

export default new CacheService();
