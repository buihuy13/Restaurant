import express from 'express';
import orderController from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createOrderSchema } from '../dtos/request/createOrderDto.js';
import { updateOrderStatusSchema, addRatingSchema } from '../dtos/request/updateOrderDto.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lấy tất cả đơn hàng
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 */
router.get('/', orderController.getAllOrders);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', validateRequest(createOrderSchema), orderController.createOrder);

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng theo ID
 *     tags: [Orders]
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết đơn hàng
 */
router.get('/:orderId', orderController.getOrderById);

/**
 * @swagger
 * /api/orders/user/{userId}:
 *   get:
 *     summary: Lấy tất cả đơn hàng của user
 *     tags: [Orders]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng của user
 */
router.get('/user/:userId', orderController.getUserOrders);

/**
 * @swagger
 * /api/orders/restaurant/{restaurantId}:
 *   get:
 *     summary: Lấy tất cả đơn hàng của restaurant
 *     tags: [Orders]
 *     parameters:
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng của nhà hàng
 */
router.get('/restaurant/:restaurantId', orderController.getRestaurantOrders);

/**
 * @swagger
 * /api/orders/{orderId}/status:
 *   patch:
 *     summary: Cập nhật trạng thái đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusRequest'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch('/:orderId/status', validateRequest(updateOrderStatusSchema), orderController.updateOrderStatus);

/**
 * @swagger
 * /api/orders/{orderId}/cancel:
 *   patch:
 *     summary: Hủy đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hủy đơn hàng thành công
 */
router.patch('/:orderId/cancel', orderController.cancelOrder);

/**
 * @swagger
 * /api/orders/{orderId}/rating:
 *   post:
 *     summary: Thêm đánh giá cho đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddRatingRequest'
 *     responses:
 *       201:
 *         description: Thêm đánh giá thành công
 */
router.post('/:orderId/rating', validateRequest(addRatingSchema), orderController.addRating);

export default router;
