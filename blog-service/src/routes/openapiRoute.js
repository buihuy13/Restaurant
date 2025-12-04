// src/routes/openapiRoute.js
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import { blogServiceOpenAPI } from '../config/openapi.js';

const router = express.Router();

const swaggerSpec = swaggerJSDoc({
    definition: blogServiceOpenAPI,
    apis: ['./src/routes/blogRoutes.js', './src/routes/commentRoutes.js', './src/routes/uploadRoutes.js'],
});

router.get('/v3/api-docs/blog-service', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

export default router;
