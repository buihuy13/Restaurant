import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import logger from './utils/logger.js';
import { startEurekaClient } from './config/eureka.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8087;

const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // mỗi 15p, limit sẽ được reset
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // số lượng request tối đa được phép gửi từ 1 IP
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' })); // parse dữ liệu JSON từ body của request -> chuyển thành object của JS
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // xử lý dữ liệu gửi từ form
app.use('/api/', limiter);

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

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

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});

const startServer = async () => {
    try {
        logger.info('Starting Blog Service...');

        app.listen(PORT, () => {
            logger.info(`Blog Service running on port ${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV}`);
            logger.info(`Swagger Docs: http://localhost:${PORT}/api-docs`);

            // Register with Eureka
            setTimeout(() => {
                logger.info('🔗 Registering with Eureka...');
                startEurekaClient();
            }, 3000);
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
        process.exit(0); // 0 -> success
    } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1); // 1 -> error
    }
};

process.on('SIGTERM', gracefulShutdown); // do docker
process.on('SIGINT', gracefulShutdown); // tắt do Ctrl + C

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();

export default app;
