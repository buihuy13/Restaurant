import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        swagger: '2.0',
        info: {
            title: 'Order Service API',
            version: '1.0.0',
            description: 'API documentation for Order Service',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        host: process.env.ORDER_SERVICE_URL || 'localhost:8080',
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
            // Order Item
            OrderItem: {
                type: 'object',
                properties: {
                    productId: { type: 'string' },
                    productName: { type: 'string' },
                    quantity: { type: 'integer' },
                    price: { type: 'number' },
                    customizations: { type: 'string' },
                },
                required: ['productId', 'productName', 'quantity', 'price'],
            },
            // Address
            Address: {
                type: 'object',
                properties: {
                    street: { type: 'string' },
                    city: { type: 'string' },
                    state: { type: 'string' },
                    zipCode: { type: 'string' },
                },
                required: ['street', 'city', 'state', 'zipCode'],
            },
            // Create Order Request
            CreateOrderRequest: {
                type: 'object',
                properties: {
                    userId: { type: 'string' },
                    restaurantId: { type: 'string' },
                    restaurantName: { type: 'string' },
                    items: {
                        type: 'array',
                        items: { $ref: '#/definitions/OrderItem' },
                    },
                    deliveryAddress: {
                        $ref: '#/definitions/Address',
                    },
                    discount: { type: 'number' },
                    deliveryFee: { type: 'number' },
                    paymentMethod: {
                        type: 'string',
                        enum: ['cash', 'card', 'wallet'],
                    },
                    orderNote: { type: 'string' },
                    userLat: {
                        type: 'number',
                        description: 'Latitude of user',
                        example: 10.762622,
                    },
                    userLon: {
                        type: 'number',
                        description: 'Longitude of user',
                        example: 106.660172,
                    },
                },
                required: [
                    'userId',
                    'restaurantId',
                    'restaurantName',
                    'items',
                    'deliveryAddress',
                    'paymentMethod',
                    'userLat',
                    'userLon',
                ],
            },
            // Update Order Status Request
            UpdateOrderStatusRequest: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
                    },
                    cancellationReason: { type: 'string' },
                },
                required: ['status'],
            },
            // Cancel Order Request
            CancelOrderRequest: {
                type: 'object',
                properties: {
                    userId: { type: 'string' },
                    reason: { type: 'string' },
                },
                required: ['userId'],
            },
            // Add Rating Request
            AddRatingRequest: {
                type: 'object',
                properties: {
                    userId: { type: 'string' },
                    rating: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 5,
                    },
                    review: { type: 'string' },
                },
                required: ['userId', 'rating'],
            },
            // Restaurant
            Restaurant: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    image: { type: 'string' },
                    rating: { type: 'number' },
                },
            },
            // Order Response
            OrderResponse: {
                type: 'object',
                properties: {
                    orderId: { type: 'string' },
                    slug: { type: 'string' },
                    userId: { type: 'string' },
                    restaurant: {
                        $ref: '#/definitions/Restaurant',
                    },
                    items: {
                        type: 'array',
                        items: { $ref: '#/definitions/OrderItem' },
                    },
                    deliveryAddress: {
                        $ref: '#/definitions/Address',
                    },
                    subtotal: { type: 'number' },
                    totalAmount: { type: 'number' },
                    discount: { type: 'number' },
                    deliveryFee: { type: 'number' },
                    tax: { type: 'number' },
                    finalAmount: { type: 'number' },
                    paymentMethod: { type: 'string' },
                    paymentStatus: {
                        type: 'string',
                        enum: ['pending', 'completed', 'failed', 'refunded'],
                    },
                    status: {
                        type: 'string',
                        enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
                    },
                    estimatedDeliveryTime: { type: 'string', format: 'date-time' },
                    actualDeliveryTime: { type: 'string', format: 'date-time' },
                    orderNote: { type: 'string' },
                    rating: { type: 'integer' },
                    review: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            CartItem: {
                type: 'object',
                properties: {
                    productId: { type: 'string' },
                    productName: { type: 'string' },
                    price: { type: 'number' },
                    quantity: { type: 'integer' },
                    customizations: { type: 'string' },
                    subtotal: { type: 'number' },
                },
                required: ['productId', 'productName', 'price', 'quantity'],
            },
            RestaurantCart: {
                type: 'object',
                properties: {
                    restaurantId: { type: 'string' },
                    restaurantName: { type: 'string' },
                    restaurantSlug: { type: 'string' },
                    restaurantImage: { type: 'string' },
                    items: {
                        type: 'array',
                        items: { $ref: '#/definitions/CartItem' },
                    },
                    subtotal: { type: 'number' },
                    tax: { type: 'number' },
                    deliveryFee: { type: 'number' },
                    discount: { type: 'number' },
                    totalAmount: { type: 'number' },
                    notes: { type: 'string' },
                    deliveryAddress: { type: 'string' },
                },
            },
            CartResponse: {
                type: 'object',
                properties: {
                    userId: { type: 'string' },
                    restaurants: {
                        type: 'array',
                        items: { $ref: '#/definitions/RestaurantCart' },
                    },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                },
            },
            // API Response
            ApiResponse: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        enum: ['success', 'error'],
                    },
                    message: { type: 'string' },
                    data: { type: 'object' },
                    pagination: {
                        type: 'object',
                        properties: {
                            total: { type: 'integer' },
                            limit: { type: 'integer' },
                            offset: { type: 'integer' },
                        },
                    },
                },
            },
            // Error Response
            ErrorResponse: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    errors: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                },
            },
            Cart: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        example: '507f1f77bcf86cd799439011',
                    },
                    userId: {
                        type: 'string',
                        example: 'USER123',
                    },
                    restaurants: {
                        type: 'array',
                        items: { $ref: '#/definitions/RestaurantCart' },
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
            CartSummary: {
                type: 'object',
                properties: {
                    totalRestaurants: {
                        type: 'integer',
                        example: 1,
                    },
                    totalItems: {
                        type: 'integer',
                        example: 4,
                    },
                    grandTotal: {
                        type: 'number',
                        example: 152000,
                    },
                    restaurants: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                restaurantId: { type: 'string' },
                                restaurantName: { type: 'string' },
                                itemCount: { type: 'integer' },
                                totalAmount: { type: 'number' },
                            },
                        },
                    },
                },
            },
            CartEstimate: {
                type: 'object',
                properties: {
                    subtotal: {
                        type: 'number',
                        example: 120000,
                    },
                    tax: {
                        type: 'number',
                        example: 12000,
                    },
                    deliveryFee: {
                        type: 'number',
                        example: 20000,
                    },
                    discount: {
                        type: 'number',
                        example: 0,
                    },
                    grandTotal: {
                        type: 'number',
                        example: 152000,
                    },
                    breakdown: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                restaurantId: { type: 'string' },
                                restaurantName: { type: 'string' },
                                subtotal: { type: 'number' },
                                tax: { type: 'number' },
                                deliveryFee: { type: 'number' },
                                discount: { type: 'number' },
                                total: { type: 'number' },
                            },
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
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
                displayOperationId: false,
                defaultModelsExpandDepth: 1,
                defaultModelExpandDepth: 1,
            },
            customCss: `
                .swagger-ui .topbar { 
                    display: none; 
                }
                .swagger-ui {
                    font-family: "Segoe UI", Roboto, sans-serif;
                }
                .swagger-ui .scheme-container {
                    background: #fafafa;
                    padding: 30px;
                }
            `,
            customSiteTitle: 'Order Service API Documentation',
        }),
    );

    app.get('/v3/api-docs/order-service', (req, res) => {
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
