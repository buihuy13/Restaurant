import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Order Service API',
            version: '1.0.0',
            description: 'API documentation for Order Service',
        },
        servers: [
            {
                url: process.env.ORDER_SERVICE_URL,
            },
        ],
        components: {
            schemas: {
                OrderItem: {
                    type: 'object',
                    properties: {
                        productId: { type: 'string' },
                        productName: { type: 'string' },
                        quantity: { type: 'integer' },
                        price: { type: 'number' },
                        customizations: { type: 'string', nullable: true },
                    },
                    required: ['productId', 'productName', 'quantity', 'price'],
                },
                CreateOrderRequest: {
                    type: 'object',
                    properties: {
                        userId: { type: 'string' },
                        restaurantId: { type: 'string' },
                        restaurantName: { type: 'string' },
                        items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
                        deliveryAddress: {
                            type: 'object',
                            properties: {
                                street: { type: 'string' },
                                city: { type: 'string' },
                                state: { type: 'string' },
                                zipCode: { type: 'string' },
                            },
                            required: ['street', 'city', 'state', 'zipCode'],
                        },
                        discount: { type: 'number' },
                        deliveryFee: { type: 'number' },
                        paymentMethod: { type: 'string', enum: ['cash', 'card', 'wallet'] },
                        orderNote: { type: 'string', nullable: true },
                    },
                    required: ['userId', 'restaurantId', 'restaurantName', 'items', 'deliveryAddress', 'paymentMethod'],
                },
                UpdateOrderStatusRequest: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
                        },
                        cancellationReason: { type: 'string', nullable: true },
                    },
                    required: ['status'],
                },
                AddRatingRequest: {
                    type: 'object',
                    properties: {
                        rating: { type: 'number', minimum: 1, maximum: 5 },
                        review: { type: 'string', nullable: true },
                    },
                    required: ['rating'],
                },
            },
        },
    },
    apis: ['./src/routes/*.js'], // đường dẫn đến file routes có comment Swagger
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
    app.use(
        '/swagger.json',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            explorer: true,
            customCss: '.swagger-ui .topbar { display: none }',
            customSiteTitle: 'Order Service API Docs',
        }),
    );

    app.get('/v3/api-docs/order-service', (req, res) => {
        res.json(swaggerSpec);
    });
};
