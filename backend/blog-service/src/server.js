import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/database.js';
import blogRoutes from './routes/blogRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { startEurekaClient } from './config/eureka.js';
import logger from './utils/logger.js';
import openapiRoute from './routes/openapiRoute.js';

const app = express();
const PORT = process.env.PORT || 8087;

// Middlewares
// CORS must be applied BEFORE helmet to avoid conflicts
app.use(
    cors({
        origin: ['http://localhost:8080', 'http://api-gateway:8080'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }),
);
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/blogs', blogRoutes);

// Swagger Documentation
app.use('/v3/api-docs/blog-service', openapiRoute);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        service: 'blog-service',
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// API Info
app.get('/', (req, res) => {
    res.status(200).json({
        service: 'Blog Service',
        version: '1.0.0',
        description: 'Food Delivery Blog & Content Management Service',
        documentation: '/api-docs',
        endpoints: {
            health: '/health',
            blogs: '/api/blogs',
            swagger: '/api-docs',
        },
        features: [
            'Blog CRUD operations',
            'Comments & Replies',
            'Like system',
            'Category & Tags',
            'Full-text search',
            'SEO optimization',
        ],
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});

// Error handler
app.use(errorHandler);

// Initialize and start server
const startServer = async () => {
    try {
        logger.info('Starting Blog Service...');

        // Connect to MongoDB
        await connectDB();

        // Start server
        app.listen(PORT, () => {
            logger.info(`Blog Service running on port ${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV}`);
            logger.info(`Swagger Docs: http://localhost:${PORT}/api-docs`);

            // Register with Eureka
            setTimeout(() => {
                logger.info('Registering with Eureka...');
                startEurekaClient();
            }, 5000);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
const gracefulShutdown = async () => {
    logger.info('Received shutdown signal, closing gracefully...');

    try {
        logger.info('All connections closed');
        process.exit(0);
    } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();

export default app;
