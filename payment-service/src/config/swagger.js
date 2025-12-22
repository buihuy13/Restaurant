import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Payment Service API',
            version: '1.0.0',
            description: 'Food Delivery Payment Management API',
            contact: {
                name: 'API Support',
                email: 'support@foodeats.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:8083',
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
                Payment: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        paymentId: {
                            type: 'string',
                            example: 'PAY1234567890ABC',
                        },
                        orderId: {
                            type: 'string',
                            example: 'ORD1234567890ABC',
                        },
                        userId: {
                            type: 'string',
                        },
                        amount: {
                            type: 'number',
                            example: 50.0,
                        },
                        currency: {
                            type: 'string',
                            example: 'USD',
                        },
                        paymentMethod: {
                            type: 'string',
                            enum: ['cash', 'card', 'wallet'],
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
                        },
                        transactionId: {
                            type: 'string',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                        },
                    },
                },
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
