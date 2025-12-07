// src/routes/orderRoutes.js
import express from 'express';
import orderController from '../controllers/orderController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createOrderSchema } from '../dtos/request/createOrderDto.js';
import { updateOrderStatusSchema, addRatingSchema } from '../dtos/request/updateOrderDto.js';

const router = express.Router();

// Public routes (không cần token)
router.get('/:orderId', orderController.getOrderById);
router.get('/slug/:slug', orderController.getOrderBySlug);

/**
 * @swagger
 * tags:
 *   - name: Orders - User
 *     description: API dành cho khách hàng đặt hàng
 *   - name: Orders - Admin
 *     description: API dành cho Admin
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lấy tất cả đơn hàng (Admin only)
 *     tags: [Orders - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, ready, completed, cancelled]
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: restaurantId
 *         schema: { type: string }
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 */
router.get('/', orderController.getAllOrders);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders - User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [restaurantId, items, deliveryAddress]
 *             properties:
 *               restaurantId: { type: string }
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *               deliveryAddress:
 *                 $ref: '#/components/schemas/DeliveryAddress'
 *               orderNote: { type: string }
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, wallet]
 *     responses:
 *       201:
 *         description: Tạo đơn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 */
router.post('/', validateRequest(createOrderSchema), orderController.createOrder);

/**
 * @swagger
 * /api/orders/user/{userId}:
 *   get:
 *     summary: Lấy danh sách đơn hàng của người dùng
 *     tags: [Orders - User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
router.get('/user/:userId', orderController.getUserOrders);

/**
 * @swagger
 * /api/orders/{orderId}/status:
 *   patch:
 *     summary: Cập nhật trạng thái đơn hàng (Merchant & Admin)
 *     tags: [Orders - User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, preparing, ready, completed]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.patch('/:orderId/status', validateRequest(updateOrderStatusSchema), orderController.updateOrderStatus);

/**
 * @swagger
 * /api/orders/{orderId}/cancel:
 *   patch:
 *     summary: Hủy đơn hàng (chỉ pending/confirmed)
 *     tags: [Orders - User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Đổi ý không ăn nữa"
 *     responses:
 *       200:
 *         description: Hủy thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Không thể hủy ở trạng thái hiện tại
 */
router.patch('/:orderId/cancel', orderController.cancelOrder);

/**
 * @swagger
 * /api/orders/{orderId}/rating:
 *   post:
 *     summary: Đánh giá đơn hàng (chỉ khi completed)
 *     tags: [Orders - User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Đánh giá thành công
 */
router.post('/:orderId/rating', validateRequest(addRatingSchema), orderController.addRating);

/**
 * @swagger
 * /api/orders/checkout/cart:
 *   post:
 *     summary: Thanh toán hàng loạt từ giỏ hàng đa quán
 *     description: Tạo nhiều đơn hàng từ toàn bộ giỏ hàng (hỗ trợ nhiều quán)
 *     tags: [Orders - User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, paymentMethod]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: USER123
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, wallet]
 *                 example: card
 *     responses:
 *       201:
 *         description: Tạo đơn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 ordersCreated: { type: integer, example: 3 }
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 failedRestaurants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       restaurantId: { type: string }
 *                       restaurantName: { type: string }
 *                       error: { type: string }
 */
router.post('/checkout/cart', orderController.createOrdersFromCart);

export default router;
