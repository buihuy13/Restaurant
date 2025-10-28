import amqp from "amqplib";
import logger from "../utils/logger.js";

class RabbitMQConnection {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queues = {
      ORDER_CREATED: process.env.RABBITMQ_QUEUE_ORDER_CREATED,
      ORDER_UPDATED: process.env.RABBITMQ_QUEUE_ORDER_UPDATED,
      ORDER_CANCELLED: process.env.RABBITMQ_QUEUE_ORDER_CANCELLED,
      PAYMENT_COMPLETED: process.env.RABBITMQ_QUEUE_PAYMENT_COMPLETED,
      PAYMENT_FAILED: process.env.RABBITMQ_QUEUE_PAYMENT_FAILED,
    };
  }

  async connect() {
    try {
      const url = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
      
      logger.info(`Connecting to RabbitMQ at ${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}...`);
      
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      // Declare exchange
      await this.channel.assertExchange(
        process.env.RABBITMQ_ORDER_EXCHANGE,
        "topic",
        {
          durable: true,
        }
      );
      await this.channel.assertExchange(
        process.env.RABBITMQ_PAYMENT_EXCHANGE,
        "topic",
        {
          durable: true,
        }
      );

      // Declare queues
      for (const queue of Object.values(this.queues)) {
        await this.channel.assertQueue(queue, { durable: true });
      }

      // Bind queues to exchange
      await this.channel.bindQueue(
        this.queues.PAYMENT_COMPLETED,
        process.env.RABBITMQ_PAYMENT_EXCHANGE,
        "payment.completed"
      );

      await this.channel.bindQueue(
        this.queues.PAYMENT_FAILED,
        process.env.RABBITMQ_PAYMENT_EXCHANGE,
        "payment.failed"
      );

      logger.info("RabbitMQ connected successfully");

      // Handle connection errors
      this.connection.on("error", (err) => {
        logger.error("RabbitMQ connection error:", err);
      });

      this.connection.on("close", () => {
        logger.warn("RabbitMQ connection closed. Reconnecting...");
        setTimeout(() => this.connect(), 5000);
      });
    } catch (error) {
      logger.error("RabbitMQ connection failed:", error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async publishMessage(exchange, routingKey, message) {
    try {
      if (!this.channel) {
        throw new Error("RabbitMQ channel not initialized");
      }

      const messageBuffer = Buffer.from(JSON.stringify(message));

      this.channel.publish(exchange, routingKey, messageBuffer, {
        persistent: true, // ghi message xuống đĩa (disk) => message sẽ không mất
      });

      logger.info(`Message published to ${exchange}:${routingKey}`);
    } catch (error) {
      logger.error("Error publishing message:", error);
      throw error;
    }
  }

  async consumeMessage(queue, callback) {
    try {
      if (!this.channel) {
        throw new Error("RabbitMQ channel not initialized");
      }

      await this.channel.consume(queue, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            await callback(content);
            this.channel.ack(msg);
          } catch (error) {
            logger.error("Error processing message:", error);
            this.channel.nack(msg, false, false);
          }
        }
      });

      logger.info(`Consuming messages from queue: ${queue}`);
    } catch (error) {
      logger.error("Error consuming message:", error);
      throw error;
    }
  }

  async close() {
    try {
      await this.channel?.close();
      await this.connection?.close();
      logger.info("RabbitMQ connection closed");
    } catch (error) {
      logger.error("Error closing RabbitMQ connection:", error);
    }
  }
}

export default new RabbitMQConnection();
