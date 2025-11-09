import amqp from "amqplib";
import logger from "../utils/logger.js";

class RabbitMQConnection {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.exchanges = {
      ORDER: "order_exchange",
      PAYMENT: "payment_exchange",
      NOTIFICATION: "notification_exchange",
    };
    this.queues = {
      ORDER_CREATED: "order.created",
      PAYMENT_COMPLETED: "payment.completed",
      PAYMENT_FAILED: "payment.failed",
      PAYMENT_REFUNDED: "payment.refunded",
    };
  }

  async connect() {
    try {
      const url = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;

      logger.info(
        `Connecting to RabbitMQ at ${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}...`
      );

      this.connection = await amqp.connect(process.env.RABBITMQ_URL || url);
      this.channel = await this.connection.createChannel();

      // Setup exchanges
      await this.channel.assertExchange(this.exchanges.ORDER, "topic", {
        durable: true,
      });
      await this.channel.assertExchange(this.exchanges.PAYMENT, "topic", {
        durable: true,
      });
      await this.channel.assertExchange(this.exchanges.NOTIFICATION, "topic", {
        durable: true,
      });

      // Setup queues
      for (const queue of Object.values(this.queues)) {
        await this.channel.assertQueue(queue, { durable: true });
      }

      // Bind order.created queue
      await this.channel.bindQueue(
        this.queues.ORDER_CREATED,
        this.exchanges.ORDER,
        "order.created"
      );

      logger.info("RabbitMQ connected successfully");

      this.connection.on("error", (err) => {
        logger.error("RabbitMQ connection error:", err);
      });

      this.connection.on("close", () => {
        logger.warn("RabbitMQ connection closed");
        setTimeout(() => this.connect(), 5000);
      });
    } catch (error) {
      logger.error("Failed to connect to RabbitMQ:", error);
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
        persistent: true,
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
