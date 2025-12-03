import orderService from '../services/orderService.js';
import { createOrderSchema } from '../dtos/request/createOrderDto.js';
import { updateOrderStatusSchema } from '../dtos/request/updateOrderDto.js';
import { orderResponseDTO } from '../dtos/response/orderResponseDto.js';
import logger from '../utils/logger.js';

class OrderController {
    async createOrder(req, res, next) {
        try {
            const { error } = createOrderSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message,
                });
            }

            const token = req.headers.authorization?.split(' ')[1];
            const order = await orderService.createOrder(req.body, token);

            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: orderResponseDTO(order),
            });
        } catch (error) {
            logger.error('Create order controller error:', error);
            next(error);
        }
    }

    async getOrderById(req, res, next) {
        try {
            const { orderId } = req.params;
            const order = await orderService.getOrderById(orderId);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
            }

            res.status(200).json({
                success: true,
                data: orderResponseDTO(order),
            });
        } catch (error) {
            logger.error('Get order controller error:', error);
            next(error);
        }
    }

    async getOrderBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const order = await orderService.getOrderBySlug(slug);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
            }

            res.status(200).json({
                success: true,
                data: orderResponseDTO(order),
            });
        } catch (error) {
            logger.error('Get order by slug controller error:', error);
            next(error);
        }
    }

    async getUserOrders(req, res, next) {
        try {
            const { userId } = req.params;
            const filters = req.query;

            const result = await orderService.getUserOrders(userId, filters);

            res.status(200).json({
                success: true,
                data: result.orders.map(orderResponseDTO),
                pagination: result.pagination,
            });
        } catch (error) {
            logger.error('Get user orders controller error:', error);
            next(error);
        }
    }

    async updateOrderStatus(req, res, next) {
        try {
            const { slug } = req.params;
            const { error } = updateOrderStatusSchema.validate(req.body);
            if (error) return res.status(400).json({ success: false, message: error.details[0].message });

            const order = await orderService.updateOrderStatus(slug, req.body);

            res.status(200).json({
                success: true,
                message: 'Order status updated successfully',
                data: orderResponseDTO(order),
            });
        } catch (error) {
            logger.error('Update order status controller error:', error);
            next(error);
        }
    }

    async cancelOrder(req, res, next) {
        try {
            const { slug } = req.params;
            const { userId, reason } = req.body;
            if (!reason) return res.status(400).json({ success: false, message: 'Cancellation reason is required' });

            const order = await orderService.cancelOrder(slug, userId, reason);

            res.status(200).json({
                success: true,
                message: 'Order cancelled successfully',
                data: orderResponseDTO(order),
            });
        } catch (error) {
            logger.error('Cancel order controller error:', error);
            next(error);
        }
    }

    async addRating(req, res, next) {
        try {
            const { slug } = req.params;
            const { userId, rating, review } = req.body;

            if (!rating || rating < 1 || rating > 5)
                return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });

            const order = await orderService.addRating(slug, userId, rating, review);

            res.status(200).json({
                success: true,
                message: 'Rating added successfully',
                data: orderResponseDTO(order),
            });
        } catch (error) {
            logger.error('Add rating controller error:', error);
            next(error);
        }
    }

    async getAllOrders(req, res, next) {
        try {
            const filters = req.query;
            const order = await orderService.getAllOrders(filters);

            res.status(200).json({
                status: 'success',
                message: 'All orders retrieved successfully',
                data: {
                    orders: order.orders.map(orderResponseDTO),
                    pagination: order.pagination,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new OrderController();
