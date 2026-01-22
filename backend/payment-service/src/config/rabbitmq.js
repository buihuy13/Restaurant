import amqp from 'amqplib';
import logger from '../utils/logger.js';

class RabbitMQConnection {
    constructor() {
        this.connection = null;
        this.channel = null;

        this.exchanges = {
            ORDER: 'order_exchange',
            PAYMENT: 'payment_exchange',
            NOTIFICATION: 'notification_exchange',
        };

        this.queues = {
            ORDER_CREATED: 'order.created',
            ORDER_UPDATED: 'order.updated',
            ORDER_CANCELLED: 'order.cancelled',
            ORDER_COMPLETED: 'order.completed',
            PAYMENT_COMPLETED: 'payment.completed',
            PAYMENT_FAILED: 'payment.failed',
        };

        this.deadLetter = {
            EXCHANGE: 'dead_letter_exchange',
            QUEUE: 'dead_letter_queue',
            ROUTING_KEY: 'dead_letter_routingKey',
        };
    }

    async connect() {
        try {
            const url =
                process.env.RABBITMQ_URL ||
                `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;

            logger.info(`Connecting to RabbitMQ at ${url}...`);

            this.connection = await amqp.connect(url);
            this.channel = await this.connection.createChannel();

            // Setup exchanges
            for (const exchange of Object.values(this.exchanges)) {
                await this.channel.assertExchange(exchange, 'topic', { durable: true });
            }

            // Setup dead-letter exchange and queue
            await this.channel.assertExchange(this.deadLetter.EXCHANGE, 'direct', { durable: true });
            await this.channel.assertQueue(this.deadLetter.QUEUE, { durable: true });
            await this.channel.bindQueue(this.deadLetter.QUEUE, this.deadLetter.EXCHANGE, this.deadLetter.ROUTING_KEY);

            // Setup main queues with dead-letter arguments
            for (const queue of Object.values(this.queues)) {
                await this.channel.assertQueue(queue, {
                    durable: true,
                    arguments: {
                        'x-dead-letter-exchange': this.deadLetter.EXCHANGE,
                        'x-dead-letter-routing-key': this.deadLetter.ROUTING_KEY,
                    },
                });
            }

            // Bind queues to exchanges
            await this.channel.bindQueue(this.queues.ORDER_CREATED, this.exchanges.ORDER, 'order.created');
            await this.channel.bindQueue(this.queues.ORDER_UPDATED, this.exchanges.ORDER, 'order.updated');
            await this.channel.bindQueue(this.queues.ORDER_CANCELLED, this.exchanges.ORDER, 'order.cancelled');
            await this.channel.bindQueue(this.queues.ORDER_COMPLETED, this.exchanges.ORDER, 'order.completed');
            await this.channel.bindQueue(this.queues.PAYMENT_COMPLETED, this.exchanges.PAYMENT, 'payment.completed');
            await this.channel.bindQueue(this.queues.PAYMENT_FAILED, this.exchanges.PAYMENT, 'payment.failed');

            logger.info('RabbitMQ connected successfully');

            // Event handlers
            this.connection.on('error', (err) => {
                logger.error('RabbitMQ connection error:', err);
            });

            this.connection.on('close', () => {
                logger.warn('RabbitMQ connection closed. Reconnecting in 5s...');
                setTimeout(() => this.connect(), 5000);
            });
        } catch (error) {
            logger.error('Failed to connect to RabbitMQ:', error);
            setTimeout(() => this.connect(), 5000);
        }
    }

    async publishMessage(exchange, routingKey, message) {
        try {
            if (!this.channel) throw new Error('RabbitMQ channel not initialized');

            const buffer = Buffer.from(JSON.stringify(message));
            this.channel.publish(exchange, routingKey, buffer, { persistent: true });

            logger.info(`Message published to ${exchange}:${routingKey}`);
        } catch (error) {
            logger.error('Error publishing message:', error);
            throw error;
        }
    }

    async consumeMessage(queue, callback) {
        try {
            if (!this.channel) throw new Error('RabbitMQ channel not initialized');

            await this.channel.consume(queue, async (msg) => {
                if (msg) {
                    try {
                        const content = JSON.parse(msg.content.toString());
                        await callback(content);
                        this.channel.ack(msg);
                    } catch (error) {
                        logger.error('Error processing message:', error);
                        this.channel.nack(msg, false, false);
                    }
                }
            });

            logger.info(`Consuming messages from queue: ${queue}`);
        } catch (error) {
            logger.error('Error consuming message:', error);
            throw error;
        }
    }

    async close() {
        try {
            await this.channel?.close();
            await this.connection?.close();
            logger.info('RabbitMQ connection closed');
        } catch (error) {
            logger.error('Error closing RabbitMQ connection:', error);
        }
    }
}

export default new RabbitMQConnection();
