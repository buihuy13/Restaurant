import rabbitmqConnection from '../config/rabbitmq.js';
import orderService from '../services/orderService.js';
import logger from '../utils/logger.js';

const startPaymentConsumer = async () => {
    try {
        // Listen for payment completed events
        rabbitmqConnection.consumeMessage(rabbitmqConnection.queues.PAYMENT_COMPLETED, async (message) => {
            logger.info('Payment completed event received:', message);

            await orderService.updatePaymentStatus(message.orderId, 'completed', message);
        });

        // Listen for payment failed events
        rabbitmqConnection.consumeMessage(rabbitmqConnection.queues.PAYMENT_FAILED, async (message) => {
            logger.info('Payment failed event received:', message);

            await orderService.updatePaymentStatus(message.orderId, 'failed', message);
        });

        logger.info('Payment consumers started successfully');
    } catch (error) {
        logger.error('Error starting payment consumers:', error);
    }
};

export default startPaymentConsumer;
