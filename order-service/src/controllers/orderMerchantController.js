import { orderResponseDTO } from '../dtos/response/orderResponseDto.js';
import orderService from '../services/orderService.js';
import logger from '../utils/logger.js';

class OrderMerchantController {
    async acceptOrder(req, res) {
        try {
            const { orderId } = req.params;
            const merchantId = req.user?.id || req.query?.merchantId;

            const order = await orderService.acceptOrderByMerchant(orderId, merchantId);

            return res.status(200).json({
                success: true,
                message: 'Order accepted successfully',
                data: order,
            });
        } catch (error) {
            logger.error('Accept order error:', error.message);
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    async rejectOrder(req, res) {
        try {
            const { orderId } = req.params;
            const { reason } = req.body;
            const merchantId = req.user?.id || req.query?.merchantId;

            const order = await orderService.rejectOrderByMerchant(orderId, merchantId, reason);

            return res.status(200).json({
                success: true,
                message: 'Order rejected successfully',
                data: order,
            });
        } catch (error) {
            logger.error('Reject order error:', error.message);
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    async cancelAcceptedOrder(req, res) {
        try {
            const { orderId } = req.params;
            const { reason } = req.body;
            const merchantId = req.user?.id || req.query?.merchantId;

            if (!reason || reason.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Lý do hủy đơn là bắt buộc',
                });
            }

            const order = await orderService.cancelOrderByMerchant(orderId, merchantId, reason);

            return res.status(200).json({
                success: true,
                message: 'Đơn hàng đã được hủy thành công',
                data: order,
            });
        } catch (error) {
            logger.error('Merchant cancel order error:', error.message);
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    async getRestaurantOrders(req, res, next) {
        try {
            const { restaurantId } = req.params;
            const merchantId = req.user?.id || req.query?.merchantId;

            const filters = req.query;

            const result = await orderService.getRestaurantOrders(restaurantId, merchantId, filters);

            res.status(200).json({
                success: true,
                data: result.orders.map(orderResponseDTO),
                pagination: result.pagination,
            });
        } catch (error) {
            logger.error('Get restaurant orders controller error:', error);
            next(error);
        }
    }
}

export default new OrderMerchantController();
