import rabbitmqConnection from '../config/rabbitmq.js';
import axios from 'axios';
import logger from '../utils/logger.js';
import Order from '../models/Order.js';
import cacheService from './cacheService.js';

class OrderService {
    generateOrderId() {
        return `ORD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }

    async validateRestaurant(restaurantId) {
        try {
            const response = await axios.get(
                `${process.env.RESTAURANT_SERVICE_URL}/api/restaurant/admin/${restaurantId}`,
                {
                    timeout: 5000,
                },
            );

            return response.data;
        } catch (error) {
            logger.error('Restaurant validation error:', error);
            throw new Error('Restaurant not found or unavailable');
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
            // Validate restaurant
            const restaurant = await this.validateRestaurant(orderData.restaurantId);

            // Validate user
            await this.validateUser(orderData.userId, token);

            // Calculate amounts
            const amounts = this.calculateOrderAmounts(
                orderData.items,
                restaurant.deliveryFee || 0,
                orderData.discount || 0,
            );

            // Create Order
            const order = new Order({
                orderId: this.generateOrderId(),
                userId: orderData.userId,
                restaurantId: orderData.restaurantId,
                restaurantName: orderData.restaurantName,
                items: orderData.items,
                deliveryAddress: orderData.deliveryAddress,
                ...amounts,
                paymentMethod: orderData.paymentMethod,
                orderNote: orderData.orderNote,
                estimatedDeliveryTime: new Date(Date.now() + 45 * 60000), // 45 minutes
            });

            await order.save();

            // Cache the order
            await cacheService.setOrder(order.slug, order.toObject());

            // Publish order created event
            await rabbitmqConnection.publishMessage(rabbitmqConnection.exchanges.ORDER, 'order.created', {
                orderId: order.orderId,
                userId: order.userId,
                restaurantId: order.restaurantId,
                restaurantName: orderData.restaurantName,
                totalAmount: order.finalAmount,
                paymentMethod: order.paymentMethod,
                timestamp: new Date().toISOString(),
            });

            logger.info(`Order created successfully: ${order.orderId}`);
            return order;
        } catch (error) {
            logger.error('Create order error:', error);
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
            logger.info(`Order status updated: ${orderId} -> ${statusData.status}`);
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
