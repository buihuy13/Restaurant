import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connectDB } from './config/database.js';
import logger from './utils/logger.js';
import helmet from 'helmet';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';
import rabbitmqConnection from './config/rabbitmq.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { startOrderConsumer } from './consumers/orderConsumer.js';
import eurekaClient from './config/eureka.js';
import { swaggerSpec } from './config/swagger.js';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = process.env.PAYMENT_PORT || 8083;

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        service: 'payment-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
    });
});

// Swagger Documentation
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Payment Service API Docs',
    }),
);

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

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

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});

// Error handler
app.use(errorHandler);

const startServer = async () => {
    try {
        logger.info('Starting Payment Service...');
        await connectDB();
        await rabbitmqConnection.connect();
        await startOrderConsumer();

        app.listen(PORT, () => {
            logger.info(`Payment Service running on port ${PORT}`);
            logger.info(`Swagger Docs: http://localhost:${PORT}/api-docs`);

            eurekaClient.start((error) => {
                if (error) {
                    logger.error('Eureka registration failed:', error);
                } else {
                    logger.info('Order Service successfully registered with Eureka');
                }
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
