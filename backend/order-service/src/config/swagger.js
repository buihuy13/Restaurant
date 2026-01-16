// src/config/openapi.js
import { readFileSync } from 'fs';
import path from 'path';

const packageJson = JSON.parse(readFileSync(path.resolve('package.json'), 'utf-8'));

export const orderServiceOpenAPI = {
    openapi: '3.0.3',
    info: {
        title: 'FoodEats - Order Service API',
        version: packageJson.version || '1.0.0',
        description: `
**Order Service** – Hệ thống đặt món ăn hiện đại nhất Việt Nam

**Tính năng nổi bật:**
- Giỏ hàng đa quán (mua cùng lúc 5 quán vẫn ok!)
- Checkout hàng loạt tự động tách đơn theo quán
- Merchant nhận "Ting ting!" realtime khi có đơn mới
- Accept/Reject/Cancel có lý do + hoàn tiền tự động
- Đánh giá sao + bình luận sau khi nhận món
- WebSocket + RabbitMQ + Redis Cache
        `.trim(),
        contact: { name: 'CNTTK18 Dev Team', email: 'cnttk18@foodeats.vn' },
    },
    servers: [
        { url: 'http://localhost:8080/api', description: 'Local Development (via Gateway)' },
        { url: 'https://api.foodeats.vn/order/api', description: 'Production' },
    ],
    tags: [
        { name: 'Cart', description: 'Giỏ hàng đa quán – mua thoải mái' },
        { name: 'Orders - User', description: 'Khách hàng đặt món, theo dõi, hủy, đánh giá' },
        { name: 'Orders - Merchant', description: 'Chủ quán: Xem đơn, Accept, Reject, Cancel' },
        { name: 'Orders - Admin', description: 'Quản trị viên toàn hệ thống' },
        { name: 'Admin Dashboard', description: 'Admin analytics and system-wide statistics' },
        { name: 'Merchant Dashboard', description: 'Merchant-specific analytics and performance metrics' },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Nhập JWT token từ Auth Service',
            },
        },
        schemas: {
            // ==================== COMMON ====================
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Order not found' },
                },
            },

            // ==================== ORDER ====================
            OrderItem: {
                type: 'object',
                required: ['productId', 'productName', 'price', 'quantity'],
                properties: {
                    productId: { type: 'string', example: '66f8a1b2c3d4e5f6789abc12' },
                    productName: { type: 'string', example: 'Phở bò tái nạm' },
                    price: { type: 'number', example: 85000 },
                    quantity: { type: 'integer', example: 2 },
                    customizations: { type: 'string', example: 'Ít hành, thêm giá đỗ', nullable: true },
                    cartItemImage: {
                        type: 'string',
                        format: 'uri',
                        example: 'https://images.foodeats.vn/prod/123.jpg',
                        nullable: true,
                    },
                },
                example: {
                    productId: '66f8a1b2c3d4e5f6789abc12',
                    productName: 'Phở bò tái nạm',
                    price: 85000,
                    quantity: 2,
                    customizations: 'Thêm giá, không hành',
                },
            },
            DeliveryAddress: {
                type: 'object',
                required: ['street', 'city'],
                properties: {
                    street: { type: 'string', example: '123 Đường Láng, Đống Đa' },
                    ward: { type: 'string', example: 'Láng Thượng' },
                    district: { type: 'string', example: 'Đống Đa' },
                    city: { type: 'string', example: 'Hà Nội' },
                    zipCode: { type: 'string', example: '100000' },
                },
            },
            Order: {
                type: 'object',
                properties: {
                    orderId: { type: 'string', example: 'ORD1737456123000ABCDE' },
                    userId: { type: 'string', example: 'USER123' },
                    restaurantId: { type: 'string', example: 'REST678' },
                    restaurantName: { type: 'string', example: 'Phở Thìn Lò Đúc' },
                    items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
                    deliveryAddress: { $ref: '#/components/schemas/DeliveryAddress' },
                    subtotal: { type: 'number', example: 170000 },
                    tax: { type: 'number', example: 17000 },
                    deliveryFee: { type: 'number', example: 25000 },
                    discount: { type: 'number', example: 10000 },
                    totalAmount: { type: 'number', example: 202000 },
                    finalAmount: { type: 'number', example: 192000 },
                    status: {
                        type: 'string',
                        enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
                        example: 'pending',
                    },
                    paymentMethod: { type: 'string', enum: ['card'], example: 'card' },
                    orderNote: { type: 'string', example: 'Giao nhanh giúp mình nhé!' },
                    estimatedDeliveryTime: { type: 'string', format: 'date-time', example: '2025-04-06T12:30:00Z' },
                    createdAt: { type: 'string', format: 'date-time' },
                    slug: { type: 'string', example: 'pho-thin-lo-duc-ord1737456123000abcde' },
                },
                example: {
                    orderId: 'ORD1737456123000ABCDE',
                    userId: 'USER123',
                    restaurantName: 'Phở Thìn Lò Đúc',
                    items: [
                        {
                            productName: 'Phở bò tái nạm',
                            price: 85000,
                            quantity: 2,
                            customizations: 'Thêm giá',
                        },
                    ],
                    totalAmount: 192000,
                    status: 'pending',
                    paymentMethod: 'card',
                    createdAt: '2025-04-05T10:00:00Z',
                },
            },
            PaginatedOrders: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                    pagination: {
                        type: 'object',
                        properties: {
                            total: { type: 'integer', example: 156 },
                            page: { type: 'integer', example: 1 },
                            limit: { type: 'integer', example: 20 },
                            totalPages: { type: 'integer', example: 8 },
                        },
                    },
                },
            },

            // ==================== CART ====================
            CartItem: {
                type: 'object',
                required: ['productId', 'productName', 'price', 'quantity'],
                properties: {
                    productId: { type: 'string', example: '66f8a1b2c3d4e5f6789abc12' },
                    productName: { type: 'string', example: 'Trà sữa trân châu đường đen' },
                    price: { type: 'number', example: 35000 },
                    quantity: { type: 'integer', example: 3 },
                    customizations: { type: 'string', example: 'Ít đá, 30% đường', nullable: true },
                    cartItemImage: {
                        type: 'string',
                        format: 'uri',
                        example: 'https://images.foodeats.vn/prod/123.jpg',
                        nullable: true,
                    },
                    subtotal: { type: 'number', example: 105000 },
                },
                example: {
                    productId: '66f8a1b2c3d4e5f6789abc12',
                    productName: 'Trà sữa trân châu đường đen',
                    price: 35000,
                    quantity: 3,
                    customizations: 'Ít đá',
                    subtotal: 105000,
                },
            },
            CartRestaurant: {
                type: 'object',
                properties: {
                    restaurantId: { type: 'string', example: 'REST678' },
                    restaurantName: { type: 'string', example: 'Phở Thìn Lò Đúc' },
                    restaurantSlug: { type: 'string', example: 'pho-thin-lo-duc' },
                    restaurantImage: {
                        type: 'string',
                        format: 'uri',
                        example: 'https://images.foodeats.vn/rest/678.jpg',
                    },
                    items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
                    subtotal: { type: 'number', example: 205000 },
                    tax: { type: 'number', example: 20500 },
                    deliveryFee: { type: 'number', example: 25000 },
                    discount: { type: 'number', example: 15000 },
                    totalAmount: { type: 'number', example: 215500 },
                    notes: { type: 'string', example: 'Gọi trước khi giao giúp mình' },
                    deliveryAddress: { type: 'string', example: '113 Hàn Thuyên, Linh Trung, TP. Thủ Đức' },
                },
            },
            CartResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Lấy giỏ hàng thành công' },
                    data: {
                        type: 'object',
                        properties: {
                            userId: { type: 'string', example: 'USER123' },
                            restaurants: { type: 'array', items: { $ref: '#/components/schemas/CartRestaurant' } },
                            updatedAt: { type: 'string', format: 'date-time' },
                        },
                    },
                },
                example: {
                    success: true,
                    message: 'Lấy giỏ hàng thành công',
                    data: {
                        userId: 'USER123',
                        restaurants: [
                            {
                                restaurantId: 'REST678',
                                restaurantName: 'Phở Thìn Lò Đúc',
                                items: [
                                    {
                                        productName: 'Phở bò tái nạm',
                                        price: 85000,
                                        quantity: 2,
                                        subtotal: 170000,
                                    },
                                ],
                                subtotal: 170000,
                                deliveryFee: 25000,
                                totalAmount: 195000,
                            },
                            {
                                restaurantId: 'REST999',
                                restaurantName: 'Trà sữa TOCOTOCO',
                                items: [
                                    {
                                        productName: 'Trà sữa trân châu',
                                        price: 35000,
                                        quantity: 3,
                                        subtotal: 105000,
                                    },
                                ],
                                subtotal: 105000,
                                deliveryFee: 20000,
                                totalAmount: 125000,
                            },
                        ],
                        updatedAt: '2025-04-05T10:15:00Z',
                    },
                },
            },
            CartSummary: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                        type: 'object',
                        properties: {
                            totalRestaurants: { type: 'integer', example: 2 },
                            totalItems: { type: 'integer', example: 5 },
                            grandTotal: { type: 'number', example: 320000 },
                        },
                    },
                },
                example: {
                    success: true,
                    data: {
                        totalRestaurants: 2,
                        totalItems: 5,
                        grandTotal: 320000,
                    },
                },
            },

            // ==================== DASHBOARD SCHEMAS ====================
            AdminSystemOverview: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                        type: 'object',
                        properties: {
                            totalOrders: { type: 'integer', example: 15234 },
                            totalRevenue: { type: 'number', example: 2456789000 },
                            totalMerchants: { type: 'integer', example: 156 },
                            totalUsers: { type: 'integer', example: 8945 },
                            averageOrderValue: { type: 'number', example: 161234 },
                            completedOrders: { type: 'integer', example: 12456 },
                            cancelledOrders: { type: 'integer', example: 1234 },
                        },
                    },
                },
            },
            MerchantPerformance: {
                type: 'object',
                properties: {
                    merchantId: { type: 'string', example: 'MERCHANT123' },
                    merchantName: { type: 'string', example: 'Phở Thìn Lò Đúc' },
                    totalOrders: { type: 'integer', example: 456 },
                    totalRevenue: { type: 'number', example: 45678000 },
                    averageOrderValue: { type: 'number', example: 100171 },
                    completedOrders: { type: 'integer', example: 389 },
                    cancelledOrders: { type: 'integer', example: 23 },
                },
            },
            RevenueAnalytics: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                        type: 'object',
                        properties: {
                            totalRevenue: { type: 'number', example: 45678000 },
                            totalOrders: { type: 'integer', example: 456 },
                            averageOrderValue: { type: 'number', example: 100171 },
                            revenueByRestaurant: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        restaurantId: { type: 'string', example: 'REST123' },
                                        restaurantName: { type: 'string', example: 'Phở Thìn Lò Đúc' },
                                        totalOrders: { type: 'integer', example: 234 },
                                        totalRevenue: { type: 'number', example: 23456000 },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            OrderStatusBreakdown: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                status: { type: 'string', example: 'completed' },
                                count: { type: 'integer', example: 389 },
                                totalAmount: { type: 'number', example: 38900000 },
                            },
                        },
                    },
                },
            },
            TopProduct: {
                type: 'object',
                properties: {
                    productId: { type: 'string', example: 'PROD123' },
                    productName: { type: 'string', example: 'Phở bò tái nạm' },
                    totalQuantity: { type: 'integer', example: 234 },
                    totalRevenue: { type: 'number', example: 19890000 },
                },
            },
            RatingStatistics: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                        type: 'object',
                        properties: {
                            totalRatings: { type: 'integer', example: 234 },
                            averageRating: { type: 'number', example: 4.5 },
                            ratingDistribution: {
                                type: 'object',
                                properties: {
                                    '1': { type: 'integer', example: 5 },
                                    '2': { type: 'integer', example: 12 },
                                    '3': { type: 'integer', example: 34 },
                                    '4': { type: 'integer', example: 89 },
                                    '5': { type: 'integer', example: 94 },
                                },
                            },
                        },
                    },
                },
            },
            TimeAnalytics: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                        type: 'object',
                        properties: {
                            peakHour: {
                                type: 'object',
                                properties: {
                                    hour: { type: 'integer', example: 12 },
                                    totalOrders: { type: 'integer', example: 45 },
                                },
                            },
                            busiestDay: {
                                type: 'object',
                                properties: {
                                    dayName: { type: 'string', example: 'Saturday' },
                                    totalOrders: { type: 'integer', example: 123 },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    paths: {}, // swagger-jsdoc sẽ tự động sinh từ @swagger trong routes
};
