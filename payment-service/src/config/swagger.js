import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    swaggerDefinition: {
        swagger: '2.0',
        info: {
            title: 'Payment Service API',
            version: '1.0.0',
            description: 'Food Delivery Payment Management API',
            contact: {
                name: 'API Support',
                email: 'support@foodeats.com',
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
                description: 'JWT Authorization header using the Bearer scheme',
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
                    paymentMethod: { type: 'string', enum: ['cash', 'card', 'wallet'] },
                    status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed', 'refunded'] },
                    transactionId: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['paymentId', 'orderId', 'userId', 'amount', 'currency', 'paymentMethod', 'status'],
            },
            Error: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string' },
                },
            },
        },
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'], // nơi khai báo các JSDoc comment
};

export const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
    // Swagger UI
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            explorer: true,
            customSiteTitle: 'Payment Service API Docs',
            customCss: '.swagger-ui .topbar { display: none }',
        }),
    );

    // Optional: endpoint JSON cho Swagger 2.0
    app.get('/v3/api-docs/payment-service', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(swaggerSpec);
    });
};
