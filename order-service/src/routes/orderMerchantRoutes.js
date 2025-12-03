import express from 'express';
import orderMerchantController from '../controllers/orderMerchantController.js';

const router = express.Router();

/**
 * @swagger
 * /api/merchant/orders/{orderId}/accept:
 *   post:
 *     summary: Merchant chấp nhận đơn hàng
 *     tags: [Merchant Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID đơn hàng (ví dụ: ORD1700000000000ABCDEF)
 *     responses:
 *       200:
 *         description: Đơn hàng đã được chấp nhận
 *       400:
 *         description: Lỗi (không phải chủ quán, trạng thái không hợp lệ...)
 */
router.post('/:orderId/accept', orderMerchantController.acceptOrder);

/**
 * @swagger
 * /api/merchant/orders/{orderId}/reject:
 *   post:
 *     summary: Merchant từ chối đơn hàng
 *     tags: [Merchant Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Hết nguyên liệu món này"
 *     responses:
 *       200:
 *         description: Đơn hàng đã bị từ chối
 *       400:
 *         description: Thiếu lý do hoặc không hợp lệ
 */
router.post('/:orderId/reject', orderMerchantController.rejectOrder);

/**
 * @swagger
 * /api/merchant/orders/{orderId}/cancel:
 *   post:
 *     summary: Merchant hủy đơn hàng đã chấp nhận
 *     description: Chỉ áp dụng cho đơn đang ở trạng thái confirmed hoặc preparing
 *     tags: [Merchant Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Hết nguyên liệu làm món gà rán"
 *     responses:
 *       200:
 *         description: Đơn hàng đã được hủy thành công
 *       400:
 *         description: Lỗi (không phải chủ quán, trạng thái không cho phép, thiếu lý do...)
 */
router.post('/:orderId/cancel', orderMerchantController.cancelAcceptedOrder);

/**
 * @swagger
 * /merchant/restaurants/{restaurantId}/orders:
 *   get:
 *     summary: Lấy danh sách đơn hàng của quán (dành cho Merchant)
 *     description: Chỉ trả về đơn của chính quán đó. Mặc định lọc pending + confirmed
 *     tags: [Merchant Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, ready, completed, cancelled]
 *         description: Lọc theo trạng thái (mặc định pending,confirmed)
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count: { type: integer }
 *                 newOrdersCount: { type: integer, description: "Số đơn pending (chưa xem)" }
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Order'
 */
router.get('/restaurants/:restaurantId/orders', orderMerchantController.getRestaurantOrders);

export default router;
