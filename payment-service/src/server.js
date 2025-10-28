import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./config/database.js";
import logger from "./utils/logger.js";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import rabbitmqConnection from "./config/rabbitmq.js";

const app = express();
const PORT = process.env.PORT || 8083;

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "payment-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Routes
// app.use("/api/payments", paymentRoutes);

// Error handler
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await rabbitmqConnection.connect();

    app.listen(PORT, () => {
      logger.info(`Payment Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  await rabbitmqConnection.close();
  process.exit(0);
});

startServer();

export default app;
