import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Blog Service API',
            version: '1.0.0',
            description: 'Food Delivery Blog & Content Management API',
            contact: {
                name: 'API Support',
                // email: 'support@foodeats.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3006',
                description: 'Development server',
            },
            {
                url: 'http://localhost:8080',
                description: 'API Gateway',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Blog: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                        },
                        title: {
                            type: 'string',
                            example: 'Top 10 Vegetarian Restaurants',
                        },
                        slug: {
                            type: 'string',
                            example: 'top-10-vegetarian-restaurants-1234567890',
                        },
                        content: {
                            type: 'string',
                        },
                        excerpt: {
                            type: 'string',
                        },
                        author: {
                            type: 'object',
                            properties: {
                                userId: { type: 'string' },
                                name: { type: 'string' },
                                avatar: { type: 'string' },
                            },
                        },
                        category: {
                            type: 'string',
                            enum: ['recipe', 'review', 'tips', 'news', 'health', 'other'],
                        },
                        tags: {
                            type: 'array',
                            items: { type: 'string' },
                        },
                        status: {
                            type: 'string',
                            enum: ['draft', 'published', 'archived'],
                        },
                        views: {
                            type: 'number',
                        },
                        likesCount: {
                            type: 'number',
                        },
                        commentsCount: {
                            type: 'number',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                // Comment: {
                //     type: 'object',
                //     properties: {
                //         _id: { type: 'string' },
                //         blogId: { type: 'string' },
                //         author: {
                //             type: 'object',
                //             properties: {
                //                 userId: { type: 'string' },
                //                 name: { type: 'string' },
                //             },
                //         },
                //         content: { type: 'string' },
                //         likesCount: { type: 'number' },
                //         createdAt: { type: 'string', format: 'date-time' },
                //     },
                // },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
