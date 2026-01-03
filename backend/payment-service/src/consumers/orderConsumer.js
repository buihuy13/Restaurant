import rabbitmqConnection from '../config/rabbitmq.js';
import paymentService from '../services/paymentService.js';
import logger from '../utils/logger.js';

export const startOrderConsumer = async () => {
    try {
        await rabbitmqConnection.consumeMessage(rabbitmqConnection.queues.ORDER_CREATED, async (message) => {
            logger.info('Order created event received:', message);
            await paymentService.handleOrderCreated(message);
        });
        logger.info('Order consumer started successfully');
    } catch (error) {
        logger.error('Error starting order consumer:', error);
    }
};
