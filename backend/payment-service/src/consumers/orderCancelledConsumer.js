import rabbitmqConnection from '../config/rabbitmq.js';
import paymentService from '../services/paymentService.js';
import logger from '../utils/logger.js';

/**
 * Consumer để lắng nghe event order.cancelled
 * Tự động refund khi merchant hoặc customer cancel order đã paid
 * Event order.cancelled được publish bởi cả customer và merchant cancellation
 */
class OrderCancelledConsumer {
    /**
     * Khởi động consumer
     */
    async start() {
        try {
            // Lắng nghe queue ORDER_CANCELLED
            // Queue này nhận event order.cancelled từ cả customer và merchant cancellation
            await rabbitmqConnection.consumeMessage(
                rabbitmqConnection.queues.ORDER_CANCELLED,
                async (eventData) => {
                    await this.handleOrderCancelled(eventData);
                }
            );

            logger.info('OrderCancelledConsumer started successfully');
        } catch (error) {
            logger.error('Failed to start OrderCancelledConsumer:', error);
            throw error;
        }
    }

    /**
     * Xử lý event order cancelled
     * @param {Object} eventData - Event data từ RabbitMQ
     */
    async handleOrderCancelled(eventData) {
        const {
            orderId,
            userId,
            restaurantName,
            reason,
            refundRequired,
            merchantId,
        } = eventData;

        logger.info(`Received order.cancelled event for order ${orderId}`, {
            refundRequired,
            reason,
            merchantId: merchantId || 'customer',
        });

        // Nếu không cần refund, skip
        if (!refundRequired) {
            logger.info(
                `Order ${orderId} cancelled but refund not required (payment not completed yet)`
            );
            return;
        }

        try {
            // Lấy payment theo orderId
            const payment = await paymentService.getPaymentByOrderId(orderId);

            if (!payment) {
                logger.warn(`No payment found for order ${orderId}, skip refund`);
                return;
            }

            // Kiểm tra payment đã completed chưa
            if (payment.status !== 'completed') {
                logger.warn(
                    `Payment ${payment.paymentId} status is ${payment.status}, cannot refund`
                );
                return;
            }

            // Kiểm tra đã refund chưa (prevent duplicate)
            if (payment.status === 'refunded') {
                logger.warn(`Payment ${payment.paymentId} already refunded, skip`);
                return;
            }

            // Tự động refund toàn bộ
            logger.info(
                `Auto-refunding payment ${payment.paymentId} for cancelled order ${orderId}`
            );

            const refundData = {
                amount: payment.amount, // Full refund
                reason: merchantId
                    ? `Order cancelled by restaurant: ${reason}`
                    : `Order cancelled by customer: ${reason}`,
            };

            const refundedPayment = await paymentService.refundPayment(
                payment.paymentId,
                refundData
            );

            logger.info(`Auto-refund successful for order ${orderId}`, {
                paymentId: payment.paymentId,
                refundAmount: refundedPayment.refundAmount,
                refundTransactionId: refundedPayment.refundTransactionId,
            });

            // TODO: Gửi email thông báo cho customer
            // await emailService.sendRefundNotification(userId, {
            //     orderId,
            //     restaurantName,
            //     refundAmount: refundedPayment.refundAmount,
            //     reason: refundData.reason
            // });
        } catch (error) {
            logger.error(`Failed to auto-refund for order ${orderId}:`, {
                error: error.message,
                stack: error.stack,
            });

            // TODO: Gửi alert cho admin để xử lý thủ công
            // await alertService.notifyAdminRefundFailed({
            //     orderId,
            //     paymentId: payment?.paymentId,
            //     error: error.message
            // });

            // Không throw error để không block queue
            // Admin sẽ nhận alert và xử lý thủ công
        }
    }

    /**
     * Dừng consumer (graceful shutdown)
     */
    async stop() {
        try {
            logger.info('Stopping OrderCancelledConsumer...');
            // RabbitMQ connection sẽ tự đóng khi service shutdown
        } catch (error) {
            logger.error('Error stopping OrderCancelledConsumer:', error);
        }
    }
}

export default new OrderCancelledConsumer();
