import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    swaggerDefinition: {
        swagger: '2.0',
        info: {
            title: 'Payment & Wallet Service API',
            version: '1.0.0',
            description: 'Thanh toán khách hàng + Ví đối tác (nhà hàng)',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        host: process.env.PAYMENT_SERVICE_URL || 'localhost:8083',
        basePath: '/api',
        schemes: ['http', 'https'],
        securityDefinitions: {
            Bearer: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
                description: 'Nhập token theo định dạng: Bearer <your-jwt-token>',
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
                    paymentMethod: { type: 'string', enum: ['card'] },
                    status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed', 'refunded'] },
                    transactionId: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },

            Wallet: {
                type: 'object',
                properties: {
                    balance: { type: 'number', example: 1850000 },
                    totalEarned: { type: 'number', example: 2100000 },
                    totalWithdrawn: { type: 'number', example: 250000 },
                },
            },

            WalletTransaction: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    type: { type: 'string', enum: ['EARN', 'WITHDRAW'] },
                    amount: { type: 'number' },
                    status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'FAILED'] },
                    description: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },

            PayoutRequest: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    amount: { type: 'number' },
                    bankInfo: {
                        type: 'object',
                        properties: {
                            bankName: { type: 'string' },
                            accountNumber: { type: 'string' },
                            accountHolderName: { type: 'string' },
                        },
                    },
                    status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'] },
                    note: { type: 'string' },
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
    },
    apis: ['./src/routes/**/*.js', './src/controllers/**/*.js', './src/routes/adminWalletRoutes.js'],
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
                .swagger-ui .info { margin: 20px 0; }
            `,
            customSiteTitle: 'Payment & Wallet Service API',
        }),
    );

    // Cho API Gateway gọi
    app.get('/v3/api-docs/payment-service', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    app.get('/swagger-health', (req, res) => {
        res.json({ status: 'ok', url: '/api-docs' });
    });
};
