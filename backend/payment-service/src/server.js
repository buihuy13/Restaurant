import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import sequelize, { connectDB } from './config/database.js';
import logger from './utils/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import rabbitmqConnection from './config/rabbitmq.js';
import eurekaClient from './config/eureka.js';
import paymentRoutes from './routes/paymentRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import { startOrderConsumer } from './consumers/orderConsumer.js';
import { setupSwagger } from './config/swagger.js';
import { startOrderCompletedConsumer } from './consumers/orderCompletedConsumer.js';
import adminWalletRoutes from './routes/adminWalletRoutes.js';
import internalWalletRoutes from './routes/internalWalletRoutes.js';

const app = express();
const PORT = process.env.PAYMENT_PORT || 8083;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// CORS
app.use(
    cors({
        origin: ['http://localhost:8080', 'http://api-gateway:8080'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        service: 'payment-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
    });
});

// Swagger setup
setupSwagger(app);

// API Info
app.get('/', (req, res) => {
    res.status(200).json({
        service: 'Payment Service',
        version: '1.0.0',
        description: 'Food Delivery Payment Management Service',
        documentation: '/api-docs',
        endpoints: {
            health: '/health',
            payments: '/api/payments',
            swagger: '/api-docs',
        },
    });
});

// Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/admin/wallets', adminWalletRoutes);
app.use('/api/internal/wallet', internalWalletRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        logger.info('Starting Payment Service...');
        await connectDB();
        await rabbitmqConnection.connect();
        await startOrderConsumer();
        await startOrderCompletedConsumer();
        // Syncing models is handled in connectDB(); avoid duplicate sync here to prevent ALTER conflicts

        app.listen(PORT, () => {
            logger.info(`Payment Service running on port ${PORT}`);
            logger.info(`Swagger Docs: http://localhost:${PORT}/api-docs`);

            eurekaClient.start((error) => {
                if (error) logger.error('Eureka registration failed:', error);
                else logger.info('Payment Service successfully registered with Eureka');
            });
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await rabbitmqConnection.close();
    process.exit(0);
});

startServer();

export default app;
