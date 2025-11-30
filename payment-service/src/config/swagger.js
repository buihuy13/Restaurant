import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        swagger: '2.0',
        info: {
            title: 'Payment Service API',
            version: '1.0.0',
            description: 'API documentation for Payment Service',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        host: process.env.PAYMENT_SERVICE_URL || 'localhost:8083',
        basePath: '/api',
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],

        securityDefinitions: {
            Bearer: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
                description: 'JWT Bearer Token',
            },
        },

        definitions: {
            Payment: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    paymentId: { type: 'string' },
                    orderId: { type: 'string' },
                    userId: { type: 'string' },
                    amount: { type: 'number' },
                    currency: { type: 'string' },
                    paymentMethod: {
                        type: 'string',
                        enum: ['cash', 'card', 'wallet'],
                    },
                    status: {
                        type: 'string',
                        enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
                    },
                    transactionId: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['paymentId', 'orderId', 'userId', 'amount', 'currency', 'paymentMethod', 'status'],
            },

            ConfirmPaymentResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    payment: { $ref: '#/definitions/Payment' },
                },
            },

            Error: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                },
            },
        },

        components: { schemas: {} },
    },

    apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            explorer: true,
            swaggerOptions: {
                persistAuthorization: true,
            },
            customCss: `
                .swagger-ui .topbar { display: none; }
            `,
            customSiteTitle: 'Payment Service API Documentation',
        }),
    );

    // API Gateway cần endpoint này
    app.get('/v3/api-docs/payment-service', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    app.get('/swagger-health', (req, res) => {
        res.json({
            status: 'ok',
            swaggerVersion: '2.0',
            url: '/api-docs',
        });
    });
};
