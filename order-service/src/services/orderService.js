import rabbitmqConnection from '../config/rabbitmq.js';
import axios from 'axios';
import logger from '../utils/logger.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import cacheService from './cacheService.js';
import { notifyNewOrder } from '../config/socket.js';

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

            if (!restaurantData) {
                throw new Error('Restaurant data is missing in response');
            }

            const restaurant = this.normalizeRestaurantData(restaurantData);

            if (!restaurant.id) {
                throw new Error('Restaurant ID missing');
            }

            if (!restaurant.name) {
                throw new Error('Restaurant name missing');
            }

            // if (restaurant.enabled === false) {
            //     logger.warn(`Restaurant is disabled: ${restaurant.name}`);
            //     throw new Error(`Restaurant is currently closed: ${restaurant.name}`);
            // }

            if (restaurant.openingTime && restaurant.closingTime) {
                const isOpen = this.checkRestaurantOpen(restaurant.openingTime, restaurant.closingTime);
                if (!isOpen) {
                    logger.warn(`Restaurant is closed. Hours: ${restaurant.openingTime} - ${restaurant.closingTime}`);
                    throw new Error(`Restaurant is currently closed: ${restaurant.name}`);
                }
            }

            logger.info(`Restaurant validated: ${restaurant.name} (${restaurant.id})`);
            return restaurant;
        } catch (error) {
            logger.error(`Restaurant validation error: ${error.message}`);

            if (error.code === 'ECONNREFUSED') {
                throw new Error(`Cannot connect to Restaurant Service at ${process.env.RESTAURANT_SERVICE_URL}`);
            }

            throw new Error(`Restaurant validation failed: ${error.message}`);
        }
    }

    normalizeRestaurantData(rawData) {
        return {
            id: rawData.id || rawData.restaurantId,
            name: rawData.resName || rawData.name || rawData.restaurantName,
            slug: rawData.slug,
            description: rawData.description || '',
            phone: rawData.phone,
            address: rawData.address,
            latitude: rawData.latitude,
            longitude: rawData.longitude,
            merchantId: rawData.merchantId,
            enabled: rawData.enabled !== undefined ? rawData.enabled : true,
            openingTime: rawData.openingTime,
            closingTime: rawData.closingTime,
            image: rawData.imageURL || rawData.image,
            imageURL: rawData.imageURL || rawData.image,
            rating: parseFloat(rawData.rating) || 0,
            totalReview: rawData.totalReview || 0,
            deliveryFee: parseFloat(rawData.deliveryFee) || 0,
            duration: parseInt(rawData.duration) || 45,
            distance: parseFloat(rawData.distance) || 0,
            products: rawData.products || [],
            categories: rawData.cate || rawData.categories || [],
        };
    }

    checkRestaurantOpen(openingTime, closingTime) {
        try {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            // Chuyển openingTime và closingTime từ "HH:mm" sang phút trong ngày
            const [openH, openM] = openingTime.split(':').map(Number);
            const [closeH, closeM] = closingTime.split(':').map(Number);

            const openMinutes = openH * 60 + openM;
            const closeMinutes = closeH * 60 + closeM;

            if (openMinutes < closeMinutes) {
                // Trường hợp bình thường: mở 08:00 - 22:00
                return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
            } else if (openMinutes > closeMinutes) {
                // Trường hợp mở xuyên đêm: mở 20:00 - 06:00
                return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
            } else {
                // openMinutes === closeMinutes → mở 24h (hoặc đóng cả ngày, nhưng thường là 00:00 - 00:00 = 24h)
                return true;
            }
        } catch (error) {
            logger.warn(
                `Error checking restaurant hours: ${error.message}. Opening: ${openingTime}, Closing: ${closingTime}`,
            );
            return true; // fallback an toàn: cho phép đặt hàng nếu không xác định được
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

        const tax = subtotal * 0.1;
        const finalAmount = subtotal + deliveryFee + tax - discount;

        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            deliveryFee: parseFloat(deliveryFee.toFixed(2)),
            discount: parseFloat(discount.toFixed(2)),
            totalAmount: parseFloat(subtotal.toFixed(2)),
            finalAmount: parseFloat(finalAmount.toFixed(2)),
        };
    }

    validateStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            pending: ['confirmed', 'cancelled'],
            confirmed: ['preparing', 'cancelled'],
            preparing: ['ready', 'cancelled'],
            ready: ['completed', 'cancelled'],
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

            if (filters.status) query.status = filters.status;
            if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
            if (filters.restaurantId) query.restaurantId = filters.restaurantId;
            if (filters.userId) query.userId = filters.userId;

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
            logger.info('Creating order from single restaurant cart');

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

            // Validate restaurant
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
            await this.notifyMerchantNewOrder(order);
            logger.info(`Order saved: ${order.orderId}`);

            // Cache
            try {
                await cacheService.setOrder(order.orderId, order.toObject());
            } catch (cacheError) {
                logger.warn(`Cache error: ${cacheError.message}`);
            }

            // Publish event
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
                logger.error(`RabbitMQ error: ${rabbitError.message}`);
            }

            return order;
        } catch (error) {
            logger.error('Create order error:', error.message);
            throw error;
        }
    }

    // Create orders from multi-restaurant cart (Batch Checkout)
    async createOrdersFromCart(userId, token, paymentMethod) {
        try {
            logger.info(`Creating orders from cart for user: ${userId}`);

            // Get user's cart
            const cart = await Cart.findOne({ userId });

            if (!cart || cart.restaurants.length === 0) {
                throw new Error('Cart is empty');
            }

            if (!paymentMethod) {
                throw new Error('paymentMethod is required');
            }

            const createdOrders = [];
            const failedRestaurants = [];

            // Validate user once
            let user;
            try {
                user = await this.validateUser(userId, token);
                logger.info(`User validated: ${user.email || user.id}`);
            } catch (userError) {
                logger.error(`User validation failed: ${userError.message}`);
                throw userError;
            }

            // Create order for each restaurant in cart
            for (const restaurantCart of cart.restaurants) {
                try {
                    logger.info(`Processing restaurant: ${restaurantCart.restaurantId}`);

                    // Validate restaurant
                    const restaurant = await this.validateRestaurant(restaurantCart.restaurantId);

                    // Create order
                    const order = new Order({
                        orderId: this.generateOrderId(),
                        userId,
                        restaurantId: restaurant.id,
                        restaurantName: restaurant.name,
                        restaurantSlug: restaurant.slug,
                        restaurantImage: restaurant.imageURL,
                        items: restaurantCart.items,
                        deliveryAddress: restaurantCart.deliveryAddress,
                        subtotal: restaurantCart.subtotal,
                        tax: restaurantCart.tax,
                        deliveryFee: restaurantCart.deliveryFee,
                        discount: restaurantCart.discount,
                        totalAmount: restaurantCart.subtotal,
                        finalAmount: restaurantCart.totalAmount,
                        paymentMethod,
                        orderNote: restaurantCart.notes || '',
                        estimatedDeliveryTime: new Date(Date.now() + (restaurant.duration || 45) * 60000),
                        status: 'pending',
                        paymentStatus: 'pending',
                    });

                    await order.save();
                    await this.notifyMerchantNewOrder(order);
                    logger.info(`Order created: ${order.orderId}`);

                    createdOrders.push(order.toObject());

                    // Cache
                    try {
                        await cacheService.setOrder(order.orderId, order.toObject());
                    } catch (cacheError) {
                        logger.warn(`Cache error: ${cacheError.message}`);
                    }

                    // Publish event
                    try {
                        await rabbitmqConnection.publishMessage(rabbitmqConnection.exchanges.ORDER, 'order.created', {
                            orderId: order.orderId,
                            userId,
                            restaurantId: restaurant.id,
                            restaurantName: restaurant.name,
                            totalAmount: order.finalAmount,
                            paymentMethod,
                            items: restaurantCart.items,
                            deliveryAddress: restaurantCart.deliveryAddress,
                            timestamp: new Date().toISOString(),
                        });
                    } catch (rabbitError) {
                        logger.error(`RabbitMQ error: ${rabbitError.message}`);
                    }
                } catch (error) {
                    logger.error(`Failed to create order for restaurant: ${error.message}`);
                    failedRestaurants.push({
                        restaurantId: restaurantCart.restaurantId,
                        restaurantName: restaurantCart.restaurantName,
                        error: error.message,
                    });
                }
            }

            // Clear cart after successful checkout
            if (createdOrders.length > 0) {
                try {
                    await Cart.deleteOne({ userId });
                    await cacheService.deleteCart(userId);
                    logger.info(`Cart cleared after checkout: ${userId}`);
                } catch (error) {
                    logger.warn(`Error clearing cart: ${error.message}`);
                }
            }

            return {
                success: createdOrders.length > 0,
                ordersCreated: createdOrders.length,
                orders: createdOrders,
                failedRestaurants: failedRestaurants.length > 0 ? failedRestaurants : null,
                message:
                    createdOrders.length > 0
                        ? `${createdOrders.length} order(s) created successfully`
                        : 'Failed to create any orders',
            };
        } catch (error) {
            logger.error('Create orders from cart error:', error.message);
            throw error;
        }
    }

    async getOrderById(orderId) {
        try {
            let order = await cacheService.getOrder(orderId);

            if (!order) {
                order = await Order.findOne({ orderId });
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
            logger.error('Get user orders error:', error);
            throw error;
        }
    }

    async updateOrderStatus(orderId, statusData) {
        try {
            const order = await Order.findOne({ orderId });

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
            await cacheService.setOrder(order.orderId, order.toObject());
            await cacheService.invalidateUserOrders(order.userId);

            // Publish event
            await rabbitmqConnection.publishMessage(rabbitmqConnection.exchanges.ORDER, 'order.status.updated', {
                orderId: order.orderId,
                userId: order.userId,
                previousStatus: prevStatus,
                newStatus: statusData.status,
                timestamp: new Date().toISOString(),
            });

            // If order is completed, publish order.completed event to trigger wallet crediting
            if (statusData.status === 'completed') {
                // KIỂM TRA THANH TOÁN TRƯỚC KHI CỘNG TIỀN!
                if (order.paymentStatus !== 'paid' && order.paymentStatus !== 'completed') {
                    logger.warn(`Order ${order.orderId} completed but payment not paid yet. Skip wallet credit.`, {
                        paymentStatus: order.paymentStatus,
                    });
                    // KHÔNG publish event → không cộng tiền
                } else {
                    // MỚI ĐƯỢC CỘNG TIỀN!
                    await rabbitmqConnection.publishMessage(
                        rabbitmqConnection.exchanges.ORDER,
                        'order.completed', // ← event này mới kích hoạt cộng tiền
                        {
                            orderId: order.orderId,
                            userId: order.userId,
                            restaurantId: order.restaurantId,
                            restaurantName: order.restaurantName,
                            totalAmount: order.finalAmount,
                            platformFee: Math.round(order.finalAmount * 0.1),
                            amountForRestaurant: Math.round(order.finalAmount * 0.9),
                            items: order.items,
                            completedAt: new Date().toISOString(),
                            paymentMethod: order.paymentMethod,
                            paymentStatus: order.paymentStatus,
                        },
                    );
                    logger.info(`Order completed + PAID → Published wallet credit event: ${order.orderId}`);
                }
            }

            logger.info(`Order status updated: ${order.orderId} -> ${statusData.status}`);
            return order;
        } catch (error) {
            logger.error('Update order status error:', error);
            throw error;
        }
    }

    async updatePaymentStatus(orderId, paymentStatus, paymentData = {}) {
        try {
            const order = await Order.findOne({ orderId });

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
            await cacheService.setOrder(order.orderId, order.toObject());
            await cacheService.invalidateUserOrders(order.userId);

            logger.info(`Payment status updated: ${orderId} -> ${paymentStatus}`);
            return order;
        } catch (error) {
            logger.error('Update payment status error:', error);
            throw error;
        }
    }

    async cancelOrder(orderId, userId, reason) {
        try {
            const order = await Order.findOne({ orderId, userId });

            if (!order) {
                throw new Error('Order not found');
            }

            if (!['pending', 'confirmed'].includes(order.status)) {
                throw new Error('Order cannot be cancelled at this stage');
            }

            order.status = 'cancelled';
            order.cancellationReason = reason;
            await order.save();

            // Update cache
            await cacheService.deleteOrder(order.orderId);
            await cacheService.invalidateUserOrders(userId);

            // Publish event
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

            await cacheService.setOrder(order.orderId, order.toObject());

            return order;
        } catch (error) {
            logger.error('Add rating error:', error);
            throw error;
        }
    }

    async getRestaurantOrders(restaurantId, filters = {}) {
        try {
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

    async acceptOrderByMerchant(orderId, merchantId) {
        const order = await Order.findOne({ orderId });

        if (!order) {
            throw new Error('Order not found');
        }

        const restaurant = await this.validateRestaurant(order.restaurantId);
        if (restaurant.merchantId !== merchantId) {
            throw new Error('You are not authorized to manage this restaurant');
        }

        if (order.status !== 'pending') {
            throw new Error(`Cannot accept order. Current status: ${order.status}`);
        }

        // Chuyển từ pending → confirmed
        order.status = 'confirmed';
        await order.save();

        // Cập nhật cache
        await cacheService.setOrder(order.orderId, order.toObject());
        await cacheService.invalidateUserOrders(order.userId);

        // Publish event: merchant accepted order
        // await rabbitmqConnection.publishMessage(rabbitmqConnection.exchanges.ORDER, 'order.accepted', {
        //     orderId: order.orderId,
        //     userId: order.userId,
        //     restaurantId: order.restaurantId,
        //     restaurantName: order.restaurantName,
        //     merchantId,
        //     timestamp: new Date().toISOString(),
        // });

        logger.info(`Merchant ${merchantId} accepted order ${orderId}`);
        return order;
    }

    async rejectOrderByMerchant(orderId, merchantId, reason) {
        if (!reason || reason.trim() === '') {
            throw new Error('Rejection reason is required');
        }

        const order = await Order.findOne({ orderId });
        if (!order) {
            throw new Error('Order not found');
        }

        const restaurant = await this.validateRestaurant(order.restaurantId);
        if (restaurant.merchantId !== merchantId) {
            throw new Error('You are not authorized to manage this restaurant');
        }

        if (order.status !== 'pending') {
            throw new Error(`Cannot reject order. Current status: ${order.status}`);
        }

        order.status = 'cancelled';
        order.cancellationReason = `Restaurant rejected: ${reason}`;
        await order.save();

        await cacheService.setOrder(order.orderId, order.toObject());
        await cacheService.invalidateUserOrders(order.userId);

        // Publish event: merchant rejected
        // await rabbitmqConnection.publishMessage(rabbitmqConnection.exchanges.ORDER, 'order.rejected', {
        //     orderId: order.orderId,
        //     userId: order.userId,
        //     restaurantId: order.restaurantId,
        //     restaurantName: order.restaurantName,
        //     merchantId,
        //     reason,
        //     timestamp: new Date().toISOString(),
        // });

        logger.info(`Merchant ${merchantId} rejected order ${orderId}: ${reason}`);
        return order;
    }

    async cancelOrderByMerchant(orderId, merchantId, reason) {
        if (!reason || reason.trim() === '') {
            throw new Error('Cancellation reason is required');
        }

        const order = await Order.findOne({ orderId });
        if (!order) {
            throw new Error('Order not found');
        }

        // Kiểm tra quyền merchant
        const restaurant = await this.validateRestaurant(order.restaurantId);
        if (restaurant.merchantId !== merchantId) {
            throw new Error('You are not authorized to manage this restaurant');
        }

        // Chỉ cho phép hủy khi đơn chưa giao xong
        const allowedCancelStatuses = ['confirmed', 'preparing'];
        if (!allowedCancelStatuses.includes(order.status)) {
            throw new Error(`Cannot cancel order at status: ${order.status}`);
        }

        const previousStatus = order.status;

        // Cập nhật trạng thái
        order.status = 'cancelled';
        order.cancellationReason = `Restaurant cancelled: ${reason}`;
        await order.save();

        // Cập nhật cache
        await cacheService.setOrder(order.orderId, order.toObject());
        await cacheService.invalidateUserOrders(order.userId);

        // Publish event: merchant cancelled order
        await rabbitmqConnection.publishMessage(rabbitmqConnection.exchanges.ORDER, 'order.cancelled.by.merchant', {
            orderId: order.orderId,
            userId: order.userId,
            restaurantId: order.restaurantId,
            restaurantName: order.restaurantName,
            merchantId,
            reason,
            previousStatus,
            refundRequired: order.paymentStatus === 'completed' || order.paymentStatus === 'paid',
            timestamp: new Date().toISOString(),
        });

        logger.info(`Merchant ${merchantId} cancelled order ${orderId}. Reason: ${reason}`);
        return order;
    }

    async notifyMerchantNewOrder(order) {
        try {
            notifyNewOrder(order.restaurantId, {
                orderId: order.orderId,
                totalAmount: order.finalAmount,
                itemCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
                customerNote: order.orderNote,
                createdAt: order.createdAt,
            });
        } catch (err) {
            logger.warn('Failed to send realtime notification to merchant', err.message);
        }
    }
}

export default new OrderService();
