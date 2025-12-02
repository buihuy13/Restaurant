// src/config/swagger.js
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    swagger: '2.0',
    info: {
        title: 'FoodEats Blog Service API',
        version: '1.0.0',
        description: 'API quản lý blog, comment, upload ảnh – Full test trên Swagger',
    },
    host: 'localhost:8087',
    basePath: '/api/blogs',
    schemes: ['http'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Nhập JWT token theo định dạng: Bearer <token>',
        },
    },
    definitions: {
        Blog: {
            type: 'object',
            properties: {
                _id: { type: 'string', example: '67a1b2c3d4e5f67890123456' },
                title: { type: 'string', example: 'Top 10 món chay ngon nhất Hà Nội 2025' },
                slug: { type: 'string', example: 'top-10-mon-chay-ngon-nhat-ha-noi-2025-abc123' },
                content: { type: 'string' },
                excerpt: { type: 'string', example: 'Khám phá ngay 10 quán chay ngon nhất...' },
                featuredImage: { type: 'string', format: 'url' },
                author: {
                    type: 'object',
                    properties: {
                        userId: { type: 'string', example: '60d5ecb74b3d3f001c8b4567' },
                        name: { type: 'string', example: 'Nguyễn Văn A' },
                        avatar: { type: 'string', format: 'url' },
                    },
                },
                category: { type: 'string', enum: ['recipe', 'review', 'tips', 'news', 'health', 'other'] },
                tags: { type: 'array', items: { type: 'string' } },
                status: { type: 'string', enum: ['draft', 'published', 'archived'] },
                views: { type: 'integer', example: 0 },
                likesCount: { type: 'integer', example: 0 },
                commentsCount: { type: 'integer', example: 0 },
                readTime: { type: 'integer', example: 7 },
                publishedAt: { type: 'string', format: 'date-time' },
                createdAt: { type: 'string', format: 'date-time' },
            },
        },
        Error: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Title is required' },
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/blogRoutes.js', './src/routes/commentRoutes.js', './src/routes/uploadRoutes.js'],
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
