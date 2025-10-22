const amqp = require("amqplib");
const logger = require("../../utils/logger");

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);

    connection.on("error", (err) => {
      logger.error("RabbitMQ connection error:", err);
    });

    connection.on("close", () => {
      logger.warn("RabbitMQ connection closed");
      setTimeout(connectRabbitMQ, 5000); // Reconnect after 5s
    });

    channel = await connection.createChannel();
    await channel.prefetch(10); // Process 10 messages at a time

    logger.info("RabbitMQ connected successfully");

    return channel;
  } catch (error) {}
  A;
};

const getChannel = async () => {
  if (!channel) {
    await connectRabbitMQ();
  }
  return channel;
};

const closeConnection = async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
  } catch (error) {
    logger.error("Error closing RabbitMQ connection:", error);
  }
};

module.exports = { connectRabbitMQ, getChannel, closeConnection };
