import rabbitmqConnection from '../config/rabbitmq.js';
import axios from 'axios';
import logger from '../utils/logger.js';
import Order from '../models/Order.js';
import cacheService from './cacheService.js';

class OrderService {
    generateOrderId() {
        return `ORD${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }

    async validateRestaurant(restaurantId, userLat, userLon) {
        try {
            if (!restaurantId) {
                throw new Error('restaurantId is required');
            }

            logger.info(`Validating restaurant: ${restaurantId}`);
            logger.info(`RESTAURANT_SERVICE_URL: ${process.env.RESTAURANT_SERVICE_URL}`);

            const url = `${process.env.RESTAURANT_SERVICE_URL}/api/restaurant/admin/${restaurantId}`;
            logger.info(`Request URL: ${url}`);

            // Build params object
            const params = {};
            if (userLat && userLon) {
                params.lat = userLat;
                params.lon = userLon;
                logger.info(`Location params: lat=${userLat}, lon=${userLon}`);
            }

            const response = await axios.get(url, {
                params,
                timeout: 5000,
                validateStatus: (status) => status < 500,
            });

            logger.info(`Restaurant API response status: ${response.status}`);
            logger.debug(`Restaurant raw data:`, JSON.stringify(response.data));

            // Check response status
            if (response.status === 404) {
                throw new Error(`Restaurant not found: ${restaurantId} (404)`);
            }

            if (response.status === 403) {
                throw new Error(`Access forbidden for restaurant: ${restaurantId} (403)`);
            }

            if (response.status >= 500) {
                throw new Error(`Restaurant Service error: ${response.status}`);
            }

            const restaurantData = response.data.data || response.data;

            //Check data field exists
            if (!restaurantData) {
                throw new Error('Restaurant data is missing in response');
            }

            // NORMALIZE restaurant data to standard format
            const restaurant = this.normalizeRestaurantData(restaurantData);

            // Validate required normalized fields
            if (!restaurant.id) {
                throw new Error('Restaurant ID missing');
            }

            if (!restaurant.name) {
                throw new Error('Restaurant name missing');
            }

            // Check if restaurant is enabled
            // if (restaurant.enabled === false) {
            //     logger.warn(`Restaurant is disabled: ${restaurant.name}`);
            //     throw new Error(`Restaurant is currently unavailable: ${restaurant.name}`);
            // }

            // Check opening time (optional)
            if (restaurant.openingTime && restaurant.closingTime) {
                const isOpen = this.checkRestaurantOpen(restaurant.openingTime, restaurant.closingTime);
                if (!isOpen) {
                    logger.warn(`Restaurant is closed. Hours: ${restaurant.openingTime} - ${restaurant.closingTime}`);
                    throw new Error(`Restaurant is currently closed: ${restaurant.name}`);
                }
            }

            logger.info(`Restaurant validated: ${restaurant.name} (${restaurant.id})`);
            logger.debug(`Normalized restaurant:`, JSON.stringify(restaurant));

            return restaurant;
        } catch (error) {
            logger.error(`Restaurant validation error: ${error.message}`);
            logger.error(`Error code: ${error.code}`);
            logger.error(`Error response status: ${error.response?.status}`);
            logger.error(`Error response data:`, error.response?.data);

            if (error.code === 'ECONNREFUSED') {
                throw new Error(
                    `Cannot connect to Restaurant Service at ${process.env.RESTAURANT_SERVICE_URL}. Make sure the service is running.`,
                );
            }

            if (error.code === 'ENOTFOUND') {
                throw new Error(
                    `Restaurant Service host not found: ${process.env.RESTAURANT_SERVICE_URL}. Check RESTAURANT_SERVICE_URL in .env`,
                );
            }

            if (error.code === 'ETIMEDOUT') {
                throw new Error(
                    `Restaurant Service timeout. URL: ${process.env.RESTAURANT_SERVICE_URL}. Check if service is responding.`,
                );
            }

            throw new Error(`Restaurant validation failed: ${error.message}`);
        }
    }

    // NORMALIZE restaurant data từ API response
    normalizeRestaurantData(rawData) {
        // Map field names từ API response sang standard format
        return {
            // ID & Basic Info
            id: rawData.id || rawData.restaurantId,
            name: rawData.resName || rawData.name || rawData.restaurantName,
            slug: rawData.slug,
            description: rawData.description || '',

            // Contact & Location
            phone: rawData.phone,
            address: rawData.address,
            latitude: rawData.latitude,
            longitude: rawData.longitude,

            // Business Info
            merchantId: rawData.merchantId,
            enabled: rawData.enabled !== undefined ? rawData.enabled : true,
            openingTime: rawData.openingTime,
            closingTime: rawData.closingTime,

            // Media
            image: rawData.imageURL || rawData.image || rawData.image,
            imageURL: rawData.imageURL || rawData.image,

            // Ratings & Reviews
            rating: parseFloat(rawData.rating) || 0,
            totalReview: rawData.totalReview || 0,

            // Delivery Info
            deliveryFee: parseFloat(rawData.deliveryFee) || 0,
            duration: parseInt(rawData.duration) || 45,
            distance: parseFloat(rawData.distance) || 0,

            // Products & Categories
            products: rawData.products || [],
            categories: rawData.cate || rawData.categories || [],
        };
    }

    //Check if restaurant is open
    checkRestaurantOpen(openingTime, closingTime) {
        try {
            const now = new Date();
            const currentTime =
                String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

            // Compare time strings (HH:mm format)
            return currentTime >= openingTime && currentTime <= closingTime;
        } catch (error) {
            logger.warn(`Error checking restaurant hours: ${error.message}`);
            return true; // Allow if can't check
        }
    }

    async validateUser(userId, token) {
        try {
            const response = await axios.get(`${process.env.USER_SERVICE_URL}/api/users/admin/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000,
            });
            return response.data;
        } catch (error) {
            logger.error('User validation error:', error);
            throw new Error('User validation failed');
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

    validateStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            pending: ['confirmed', 'cancelled'], // đơn hàng mới vừa tạo, có thể xác nhận hoặc hủy
            confirmed: ['preparing', 'cancelled'], // đơn hàng đã xác nhận
            preparing: ['ready', 'cancelled'], // đơn giàng đang chuẩn bị
            ready: ['completed', 'cancelled'], // sẵn sàng giao
            completed: [],
            cancelled: [],
        };

        if (!validTransitions[currentStatus]?.includes(newStatus)) {
            throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
        }
    }

    async getAllOrders(filters = {}) {
        try {
            const query = {};

            // Bộ lọc tùy chọn
            if (filters.status) query.status = filters.status;
            if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
            if (filters.restaurantId) query.restaurantId = filters.restaurantId;
            if (filters.userId) query.userId = filters.userId;

            const page = parseInt(filters.page) || 1;
            const limit = parseInt(filters.limit) || 10;
            const skip = (page - 1) * limit;

            // Truy vấn Mongo
            const orders = await Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

            const total = await Order.countDocuments(query);

            return {
                orders,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('Get all orders error:', error);
            throw error;
        }
    }

    async createOrder(orderData, token) {
        try {
            logger.info('Creating order with data:', {
                restaurantId: orderData.restaurantId,
                userId: orderData.userId,
                items: orderData.items?.length,
            });

            // Validate input
            if (!orderData.restaurantId) {
                throw new Error('restaurantId is required');
            }
            if (!orderData.userId) {
                throw new Error('userId is required');
            }
            if (!orderData.items || orderData.items.length === 0) {
                throw new Error('items cannot be empty');
            }
            if (!orderData.deliveryAddress) {
                throw new Error('deliveryAddress is required');
            }

            // Validate restaurant (normalized)
            let restaurant;
            try {
                restaurant = await this.validateRestaurant(
                    orderData.restaurantId,
                    orderData.userLat,
                    orderData.userLon,
                );
                logger.info(`Restaurant validated: ${restaurant.name}`);
            } catch (restaurantError) {
                logger.error(`Restaurant validation failed: ${restaurantError.message}`);
                throw restaurantError;
            }

            // Validate user
            let user;
            try {
                user = await this.validateUser(orderData.userId, token);
                logger.info(`User validated: ${user.email || user.id}`);
            } catch (userError) {
                logger.error(`User validation failed: ${userError.message}`);
                throw userError;
            }

            // Calculate amounts
            const amounts = this.calculateOrderAmounts(
                orderData.items,
                restaurant.deliveryFee || 0,
                orderData.discount || 0,
            );

            const estimatedTime = restaurant.duration || 45;

            logger.info('Order amounts calculated:', amounts);

            // Create Order
            const order = new Order({
                orderId: this.generateOrderId(),
                userId: orderData.userId,
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                restaurantSlug: restaurant.slug,
                restaurantImage: restaurant.imageURL,
                items: orderData.items,
                deliveryAddress: orderData.deliveryAddress,
                ...amounts,
                paymentMethod: orderData.paymentMethod,
                orderNote: orderData.orderNote || '',
                estimatedDeliveryTime: new Date(Date.now() + estimatedTime * 60000),
                status: 'pending',
                paymentStatus: 'pending',
            });

            await order.save();
            logger.info(`Order saved to database: ${order.orderId}`);

            // Cache the order
            try {
                await cacheService.setOrder(order.orderId, order.toObject());
                logger.info(`Order cached: ${order.orderId}`);
            } catch (cacheError) {
                logger.warn(`Cache error (non-critical): ${cacheError.message}`);
            }

            // Publish order created event
            try {
                await rabbitmqConnection.publishMessage(rabbitmqConnection.exchanges.ORDER, 'order.created', {
                    orderId: order.orderId,
                    userId: order.userId,
                    restaurantId: restaurant.id,
                    restaurantName: restaurant.name,
                    totalAmount: order.finalAmount,
                    paymentMethod: order.paymentMethod,
                    items: orderData.items,
                    deliveryAddress: orderData.deliveryAddress,
                    timestamp: new Date().toISOString(),
                });
                logger.info(`Order event published: ${order.orderId}`);
            } catch (rabbitError) {
                logger.error(`RabbitMQ publish error: ${rabbitError.message}`);
                // Order already created, so don't throw
            }

            return order;
        } catch (error) {
            logger.error('Create order error:', error.message);
            throw error;
        }
    }

    async getOrderById(orderId) {
        try {
            // Try cache first
            let order = await cacheService.getOrder(orderId);
            logger.info('đã lay cache');

            if (!order) {
                order = await Order.findOne({ orderId });
                logger.info('khong có lay lay cache');
                if (order) {
                    await cacheService.setOrder(orderId, order.toObject());
                }
            }

            return order;
        } catch (error) {
            logger.error('Get order error:', error);
            throw error;
        }
    }

    async getOrderBySlug(slug) {
        try {
            // Try cache first
            let order = await cacheService.getOrder(slug);

            if (!order) {
                order = await Order.findOne({ slug });
                if (order) {
                    await cacheService.setOrder(slug, order.toObject());
                }
            }
            return order;
        } catch (error) {
            logger.error('Get order by slug error:', error);
            throw error;
        }
    }

    async getUserOrders(userId, filters = {}) {
        try {
            const query = { userId };

            if (filters.status) {
                query.status = filters.status;
            }

            if (filters.paymentStatus) {
                query.paymentStatus = filters.paymentStatus;
            }

            const page = parseInt(filters.page) || 1;
            const limit = parseInt(filters.limit) || 10;
            const skip = (page - 1) * limit;

            const orders = await Order.find(query)
                .sort({ createdAt: -1 }) // sắp xếp theo ngày tạo giảm dần
                .skip(skip)
                .limit(limit)
                .lean(); // trả về plain JS object, không phải mongoose

            const total = await Order.countDocuments(query); // đếm số đơn hàng thỏa dk

            return {
                orders,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('Get user orders error:', error);
            throw error;
        }
    }

    async updateOrderStatus(slug, statusData) {
        try {
            const order = await Order.findOne({ slug });

            if (!order) {
                throw new Error('Order not found');
            }

            this.validateStatusTransition(order.status, statusData.status);

            const prevStatus = order.status;
            order.status = statusData.status;

            if (statusData.status === 'cancelled') {
                order.cancellationReason = statusData.cancellationReason;
            }

            if (statusData.status === 'completed') {
                order.actualDeliveryTime = new Date();
            }

            await order.save();

            // Update cache
            await cacheService.setOrder(order.slug, order.toObject());
            await cacheService.invalidateUserOrders(order.userId);

            // publishMessage
            await rabbitmqConnection.publishMessage(rabbitmqConnection.exchanges.ORDER, 'order.status.updated', {
                orderId: order.orderId,
                slug: order.slug,
                userId: order.userId,
                previousStatus: prevStatus,
                newStatus: statusData.status,
                timestamp: new Date().toISOString(),
            });
            logger.info(`Order status updated: ${order.orderId} -> ${statusData.status}`);
            return order;
        } catch (error) {
            logger.error('Update order status error:', error);
            throw error;
        }
    }

    async updatePaymentStatus(slug, paymentStatus, paymentData = {}) {
        try {
            const order = await Order.findOne({ slug });

            if (!order) {
                throw new Error('Order not found');
            }

            order.paymentStatus = paymentStatus;

            if (paymentStatus === 'completed') {
                order.status = 'confirmed';
            } else if (paymentStatus === 'failed') {
                order.status = 'cancelled';
                order.cancellationReason = 'Payment failed';
            }

            await order.save();

            // Update cache
            await cacheService.setOrder(order.slug, order.toObject());
            await cacheService.invalidateUserOrders(order.userId);

            logger.info(`Payment status updated: ${slug} -> ${paymentStatus}`);
            return order;
        } catch (error) {
            logger.error('Update payment status error:', error);
            throw error;
        }
    }

    async cancelOrder(slug, userId, reason) {
        try {
            const order = await Order.findOne({ slug, userId });

            if (!order) {
                throw new Error('Order not found');
            }

            // đơn hàng ở trạng thái pending hoặc confirmed thì mới được hủy
            if (!['pending', 'confirmed'].includes(order.status)) {
                throw new Error('Order cannot be cancelled at this stage');
            }

            order.status = 'cancelled';
            order.cancellationReason = reason;
            await order.save();

            // updated cache
            await cacheService.deleteOrder(order.slug);
            await cacheService.invalidateUserOrders(userId);

            // Publish cancellation event
            await rabbitmqConnection.publishMessage(rabbitmqConnection.exchanges.ORDER, 'order.cancelled', {
                orderId: order.orderId,
                userId: order.userId,
                reason,
                refundRequired: order.paymentStatus === 'completed',
                timestamp: new Date().toISOString(),
            });

            return order;
        } catch (error) {
            logger.error('Cancel order error:', error);
            throw error;
        }
    }

    async addRating(orderId, userId, rating, review) {
        try {
            const order = await Order.findOne({ orderId, userId });

            if (!order) {
                throw new Error('Order not found');
            }

            if (order.status !== 'completed') {
                throw new Error('Can only rate delivered orders');
            }

            order.rating = rating;
            order.review = review;
            await order.save();

            await cacheService.setOrder(order.slug, order.toObject());

            return order;
        } catch (error) {
            logger.error('Add rating error:', error);
            throw error;
        }
    }

    async getRestaurantOrders(restaurantId, filters = {}) {
        try {
            // Validate restaurant
            const restaurant = await this.validateRestaurant(restaurantId);

            const query = { restaurantId };

            if (filters.status) {
                query.status = filters.status;
            }

            const page = parseInt(filters.page) || 1;
            const limit = parseInt(filters.limit) || 10;
            const skip = (page - 1) * limit;

            const orders = await Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

            const total = await Order.countDocuments(query);

            return {
                orders,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('Get restaurant orders error:', error);
            throw error;
        }
    }
}

export default new OrderService();
