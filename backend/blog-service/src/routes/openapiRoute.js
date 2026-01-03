// src/routes/openapiRoute.js
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import { blogServiceOpenAPI } from '../config/swagger.js';

const router = express.Router();

const swaggerSpec = swaggerJSDoc({
    definition: blogServiceOpenAPI,
    apis: ['./src/routes/blogRoutes.js', './src/routes/commentRoutes.js', './src/routes/uploadRoutes.js'],
});

router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

export default router;
