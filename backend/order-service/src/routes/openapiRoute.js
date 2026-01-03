// src/routes/openapiRoute.js
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import { orderServiceOpenAPI } from '../config/swagger.js';

const router = express.Router();

// Cấu hình swagger-jsdoc để tự động quét @swagger trong tất cả routes
const swaggerSpec = swaggerJSDoc({
    definition: orderServiceOpenAPI,
    apis: [
        './src/routes/*.js', // quét tất cả file routes
        './src/routes/**/*.js', // nếu bạn có thư mục con
    ],
});

// Endpoint chính thức theo chuẩn Spring Cloud Gateway + SpringDoc
router.get('/v3/api-docs/order-service', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(swaggerSpec);
});

export default router;
