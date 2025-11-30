import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import rabbitmqConnection from './config/rabbitmq.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import rateLimit from 'express-rate-limit';
import orderRouter from './routes/orderRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import redisClient from './config/redis.js';
import startPaymentConsumer from './consumers/paymentConsumer.js';
import eurekaClient from './config/eureka.js';
import { setupSwagger } from './config/swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8082;

// Middlewares
app.use(helmet());
app.use(
    cors({
        origin: ['http://localhost:8080', 'http://api-gateway:8080'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        service: 'order-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
    });
});

// Routes
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);

// Setup swagger
setupSwagger(app);

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Initialize connections and start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Connect to Redis
        await redisClient.connect();

        // Connect to RabbitMQ
        await rabbitmqConnection.connect();

        // Start payment consumer
        startPaymentConsumer();

        // Start server
        app.listen(PORT, () => {
            logger.info(`Order Service running on port ${PORT}`);
            logger.info('Swagger docs: http://localhost:8082/v3/api-docs/order-service');

            eurekaClient.start((error) => {
                if (error) {
                    logger.error('Eureka registration failed:', error);
                } else {
                    logger.info('Order Service successfully registered with Eureka');
                }
            });
        });
    } catch (error) {
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await rabbitmqConnection.close();
    await redisClient.close();

    eurekaClient.stop(() => {
        logger.info('Deregistered from Eureka');
        process.exit(0);
    });
    process.exit(0);
});

startServer();

export default app;
