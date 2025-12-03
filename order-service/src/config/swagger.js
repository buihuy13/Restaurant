// src/config/swagger.js
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    swagger: '2.0',
    info: {
        title: 'FoodEats - Order Service API',
        version: '1.0.0',
        description: `
## FoodEats Order Service
Quản lý giỏ hàng, đặt hàng, merchant xác nhận/hủy đơn, trạng thái realtime.

**Tính năng chính:**
- Giỏ hàng đa quán (multi-restaurant cart)
- Tạo đơn từ giỏ hàng (1 hoặc nhiều quán)
- Merchant: Accept / Reject / Cancel đơn
- Trạng thái đơn: pending → confirmed → preparing → ready → completed
- Tự động hoàn tiền khi hủy
- Event-driven qua RabbitMQ
- Cache Redis + Swagger test full
        `,
        contact: {
            name: 'FoodEats Dev Team',
            email: 'dev@foodeats.vn',
        },
    },
    host: process.env.ORDER_SERVICE_URL || 'localhost:8082',
    basePath: '/api',
    schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'JWT Token: `Bearer <your-jwt-token-here>`',
        },
    },
    definitions: {
        // === ORDER ITEM ===
        OrderItem: {
            type: 'object',
            required: ['productId', 'productName', 'price', 'quantity'],
            properties: {
                productId: { type: 'string', example: '60d5ecb74b3d3f001c8b4567' },
                productName: { type: 'string', example: 'Phở bò tái nạm' },
                price: { type: 'number', example: 85000 },
                quantity: { type: 'integer', example: 2, minimum: 1 },
                customizations: { type: 'string', example: 'Ít hành, thêm giá, không rau mùi' },
            },
        },

        // === DELIVERY ADDRESS ===
        DeliveryAddress: {
            type: 'object',
            properties: {
                street: { type: 'string', example: '123 Đường Láng' },
                city: { type: 'string', example: 'Hà Nội' },
                state: { type: 'string', example: 'Hoàn Kiếm' },
                zipCode: { type: 'string', example: '100000' },
            },
        },

        // === ORDER RESPONSE ===
        Order: {
            type: 'object',
            properties: {
                _id: { type: 'string' },
                orderId: { type: 'string', example: 'ORD1737456123000ABCDE' },
                userId: { type: 'string' },
                restaurantId: { type: 'string' },
                restaurantName: { type: 'string', example: 'Phở Thìn Lò Đúc' },
                restaurantSlug: { type: 'string' },
                restaurantImage: { type: 'string', format: 'url' },
                items: { type: 'array', items: { $ref: '#/definitions/OrderItem' } },
                deliveryAddress: { $ref: '#/definitions/DeliveryAddress' },
                subtotal: { type: 'number', example: 170000 },
                tax: { type: 'number', example: 17000 },
                deliveryFee: { type: 'number', example: 25000 },
                discount: { type: 'number', example: 0 },
                totalAmount: { type: 'number', example: 170000 },
                finalAmount: { type: 'number', example: 212000 },
                status: {
                    type: 'string',
                    enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
                    example: 'pending',
                },
                paymentStatus: {
                    type: 'string',
                    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
                    example: 'pending',
                },
                paymentMethod: { type: 'string', enum: ['cash', 'card', 'wallet'] },
                estimatedDeliveryTime: { type: 'string', format: 'date-time' },
                actualDeliveryTime: { type: 'string', format: 'date-time', nullable: true },
                orderNote: { type: 'string', example: 'Giao nhanh giúp mình nhé' },
                cancellationReason: { type: 'string', nullable: true },
                rating: { type: 'integer', minimum: 1, maximum: 5, nullable: true },
                review: { type: 'string', nullable: true },
                slug: { type: 'string', example: 'pho-thin-lo-duc-ord1737456123000abcde' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },

        // === CART RESTAURANT ===
        CartRestaurant: {
            type: 'object',
            properties: {
                restaurantId: { type: 'string' },
                restaurantName: { type: 'string' },
                restaurantSlug: { type: 'string' },
                restaurantImage: { type: 'string', format: 'url' },
                items: { type: 'array', items: { $ref: '#/definitions/OrderItem' } },
                subtotal: { type: 'number' },
                tax: { type: 'number' },
                deliveryFee: { type: 'number' },
                discount: { type: 'number' },
                totalAmount: { type: 'number' },
                notes: { type: 'string' },
                deliveryAddress: { type: 'string' },
            },
        },

        Cart: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                restaurants: { type: 'array', items: { $ref: '#/definitions/CartRestaurant' } },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },

        // === RESPONSE TYPES ===
        SuccessResponse: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Order created successfully' },
                data: { type: 'object' },
            },
        },

        ErrorResponse: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Order not found' },
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app) => {
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(specs, {
            customCss: `
                .swagger-ui .topbar {
                    background: linear-gradient(135deg, #ff6b35, #f7931e);
                }
                .swagger-ui .topbar .download-url-wrapper { display: none; }
                .swagger-ui .info { margin: 50px 0; font-family: 'Segoe UI', sans-serif; }
                .swagger-ui .scheme-container { background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 10px; }
                .swagger-ui .opblock { border-radius: 8px; margin: 15px 0; }
                .swagger-ui .btn.authorize { background-color: #ff6b35; border-color: #ff6b35; }
                .swagger-ui .btn.authorize:hover { background-color: #e55a2b; }
            `,
            customSiteTitle: 'FoodEats - Order Service API',
            customfavIcon: 'https://foodeats.vn/favicon.ico',
        }),
    );

    // Route để export JSON spec (dùng cho Postman, frontend, v.v.)
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });

    console.log(`Swagger UI: http://localhost:${process.env.ORDER_SERVICE_URL || 8082}/api-docs`);
    console.log(`Swagger JSON: http://localhost:${process.env.ORDER_SERVICE_URL || 8082}/api-docs.json`);
};
