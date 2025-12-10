import express from 'express';
import orderMerchantController from '../controllers/orderMerchantController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Orders - Merchant
 *     description: API dành riêng cho chủ quán (Merchant)
 */

/**
 * @swagger
 * /api/merchant/orders/{orderId}/accept:
 *   post:
 *     summary: Chấp nhận đơn hàng
 *     description: Merchant xác nhận nhận đơn → chuyển trạng thái thành "confirmed"
 *     tags: [Orders - Merchant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: ORD1737456123000ABCDE
 *         description: ID đơn hàng
 *     responses:
 *       200:
 *         description: Đơn hàng đã được chấp nhận thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Không thể chấp nhận (đơn đã bị hủy, đã xác nhận, hết món, v.v.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.post('/:orderId/accept', authenticate, orderMerchantController.acceptOrder);

/**
 * @swagger
 * /api/merchant/orders/{orderId}/reject:
 *   post:
 *     summary: Từ chối đơn hàng
 *     description: Merchant từ chối đơn → hoàn tiền tự động cho khách
 *     tags: [Orders - Merchant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: ORD1737456123000ABCDE
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
 *                 example: "Hết nguyên liệu nấu món này"
 *                 description: Lý do từ chối (sẽ gửi thông báo cho khách)
 *     responses:
 *       200:
 *         description: Đơn hàng đã bị từ chối & hoàn tiền thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Không thể từ chối (đơn đã được chuẩn bị, đã giao, v.v.)
 */
router.post('/:orderId/reject', authenticate, orderMerchantController.rejectOrder);

/**
 * @swagger
 * /api/merchant/orders/{orderId}/cancel:
 *   post:
 *     summary: Hủy đơn đã chấp nhận
 *     description: Merchant hủy đơn sau khi đã accept → hoàn tiền + phạt nếu cần
 *     tags: [Orders - Merchant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: ORD1737456123000ABCDE
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
 *                 example: "Quán đóng cửa đột xuất"
 *     responses:
 *       200:
 *         description: Hủy đơn thành công, đã hoàn tiền cho khách
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Không thể hủy ở trạng thái hiện tại
 */
router.post('/:orderId/cancel', authenticate, orderMerchantController.cancelAcceptedOrder);

/**
 * @swagger
 * /api/merchant/restaurants/{restaurantId}/orders:
 *   get:
 *     summary: Lấy danh sách đơn hàng của quán
 *     description: Merchant xem tất cả đơn hàng thuộc quán mình quản lý
 *     tags: [Orders - Merchant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID quán ăn
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, ready, completed, cancelled]
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: Lấy danh sách đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedOrders'
 *       403:
 *         description: Không có quyền truy cập quán này
 */
router.get('/restaurants/:restaurantId/orders', authenticate, orderMerchantController.getRestaurantOrders);

export default router;
