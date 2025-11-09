import { createClient } from "redis";
import logger from "../utils/logger.js";

class RedisConnection {
  constructor() {
    this.client = null;
  }

  async connect() {
    try {
      logger.info(
        `Connecting to Redis at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}...`
      );

      this.client = createClient({
        socket: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        },
        password: process.env.REDIS_PASSWORD,
      });

      this.client.on("error", (err) => {
        logger.error("Redis Client Error:", err);
      });

      this.client.on("connect", () => {
        logger.info("Redis connected successfully");
      });

      await this.client.connect();
    } catch (error) {
      logger.error("Failed to connect to Redis:", error);
      throw error;
    }
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error("Redis GET error:", error);
      return null;
    }
  }

  async set(key, value, expirationInSeconds = 3600) {
    try {
      await this.client.setEx(key, expirationInSeconds, value);
    } catch (error) {
      logger.error("Redis SET error:", error);
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error("Redis DEL error:", error);
    }
  }

  async close() {
    try {
      await this.client?.quit();
      logger.info("Redis connection closed");
    } catch (error) {
      logger.error("Error closing Redis connection:", error);
    }
  }
}

export default new RedisConnection();
