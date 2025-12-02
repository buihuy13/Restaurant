// src/config/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    swagger: '2.0',
    info: {
        title: 'FoodEats Blog Service API',
        version: '1.0.0',
        description: 'API quản lý blog, comment, upload ảnh cho hệ thống FoodEats',
        contact: {
            name: 'Dev Team',
        },
    },
    host: 'localhost:8087',
    basePath: '/api/blogs',
    schemes: ['http', 'https'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            scheme: 'bearer',
            in: 'header',
            bearerFormat: 'JWT',
        },
    },
    security: [{ bearerAuth: [] }],
    definitions: {
        Blog: {
            type: 'object',
            properties: {
                _id: { type: 'string' },
                title: { type: 'string', example: 'Top 10 món chay ngon nhất Hà Nội' },
                slug: { type: 'string' },
                excerpt: { type: 'string' },
                content: { type: 'string' },
                featuredImage: { type: 'string', format: 'url' },
                author: {
                    type: 'object',
                    properties: {
                        userId: { type: 'string' },
                        name: { type: 'string' },
                        avatar: { type: 'string', format: 'url' },
                    },
                },
                category: { type: 'string', enum: ['recipe', 'review', 'tips', 'news', 'health', 'other'] },
                tags: { type: 'array', items: { type: 'string' } },
                status: { type: 'string', enum: ['draft', 'published', 'archived'] },
                views: { type: 'integer' },
                likesCount: { type: 'integer' },
                commentsCount: { type: 'integer' },
                readTime: { type: 'integer' },
                publishedAt: { type: 'string', format: 'date-time' },
                createdAt: { type: 'string', format: 'date-time' },
            },
        },
        Comment: {
            type: 'object',
            properties: {
                _id: { type: 'string' },
                blogId: { type: 'string' },
                parentId: { type: 'string', nullable: true },
                content: { type: 'string' },
                images: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            url: { type: 'string' },
                            public_id: { type: 'string' },
                            width: { type: 'integer' },
                            height: { type: 'integer' },
                        },
                    },
                },
                author: {
                    type: 'object',
                    properties: {
                        userId: { type: 'string' },
                        name: { type: 'string' },
                        avatar: { type: 'string' },
                    },
                },
                likesCount: { type: 'integer' },
                createdAt: { type: 'string', format: 'date-time' },
            },
        },
        Error: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string' },
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: [
        './src/routes/blogRoutes.js',
        './src/routes/commentRoutes.js',
        './src/routes/uploadRoutes.js',
        './src/controllers/*.js', // nếu bạn để JSDoc trong controller
    ],
};

export const swaggerSpec = swaggerJSDoc(options);
