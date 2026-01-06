import express from 'express';
import groupOrderController from '../controllers/groupOrderController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Group Orders
 *     description: API cho chức năng đặt món chung
 */

/**
 * @swagger
 * /api/group-orders:
 *   post:
 *     summary: Tạo group order mới và nhận link chia sẻ
 *     tags: [Group Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [restaurantId, restaurantName, deliveryAddress]
 *             properties:
 *               restaurantId:
 *                 type: string
 *                 example: "RES123456"
 *               restaurantName:
 *                 type: string
 *                 example: "Nhà hàng ABC"
 *               deliveryAddress:
 *                 type: object
 *                 properties:
 *                   street: { type: string }
 *                   city: { type: string }
 *                   state: { type: string }
 *                   zipCode: { type: string }
 *               groupNote:
 *                 type: string
 *                 example: "Đặt chung cho team"
 *               expiresInHours:
 *                 type: number
 *                 default: 2
 *                 example: 2
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, wallet, split]
 *                 default: split
 *     responses:
 *       201:
 *         description: Tạo group order thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     groupOrderId: { type: string }
 *                     shareToken: { type: string }
 *                     shareLink: { type: string }
 *                     status: { type: string }
 */
router.post('/', authenticate, groupOrderController.createGroupOrder);

/**
 * @swagger
 * /api/group-orders/my-orders:
 *   get:
 *     summary: Lấy danh sách group orders của user
 *     tags: [Group Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, locked, ordered, cancelled]
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get('/my-orders', authenticate, groupOrderController.getUserGroupOrders);

/**
 * @swagger
 * /api/group-orders/{shareToken}:
 *   get:
 *     summary: Xem thông tin group order bằng link
 *     tags: [Group Orders]
 *     parameters:
 *       - in: path
 *         name: shareToken
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *       404:
 *         description: Group order không tồn tại hoặc đã hết hạn
 */
router.get('/:shareToken', groupOrderController.getGroupOrderByToken);

/**
 * @swagger
 * /api/group-orders/{shareToken}/join:
 *   post:
 *     summary: Tham gia group order và thêm món
 *     tags: [Group Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shareToken
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: string }
 *                     productName: { type: string }
 *                     quantity: { type: number }
 *                     price: { type: number }
 *                     customizations: { type: string }
 *     responses:
 *       200:
 *         description: Tham gia thành công
 */
router.post('/:shareToken/join', authenticate, groupOrderController.joinGroupOrder);

/**
 * @swagger
 * /api/group-orders/{shareToken}/participants/{userId}:
 *   delete:
 *     summary: Xóa participant khỏi group order
 *     tags: [Group Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shareToken
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:shareToken/participants/:userId', authenticate, groupOrderController.removeParticipant);

/**
 * @swagger
 * /api/group-orders/{shareToken}/lock:
 *   post:
 *     summary: Khóa group order (không cho tham gia thêm)
 *     tags: [Group Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shareToken
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Khóa thành công
 */
router.post('/:shareToken/lock', authenticate, groupOrderController.lockGroupOrder);

/**
 * @swagger
 * /api/group-orders/{shareToken}/confirm:
 *   post:
 *     summary: Xác nhận và tạo order chính thức
 *     tags: [Group Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shareToken
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Confirm thành công, order đã được tạo
 */
router.post('/:shareToken/confirm', authenticate, groupOrderController.confirmGroupOrder);

/**
 * @swagger
 * /api/group-orders/{shareToken}/cancel:
 *   post:
 *     summary: Hủy group order
 *     tags: [Group Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shareToken
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Hủy thành công
 */
router.post('/:shareToken/cancel', authenticate, groupOrderController.cancelGroupOrder);

/**
 * @swagger
 * /api/group-orders/{shareToken}/pay:
 *   post:
 *     summary: Thanh toán riêng cho phần của mình
 *     tags: [Group Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shareToken
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentMethod]
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, wallet]
 *                 example: card
 *     responses:
 *       200:
 *         description: Thanh toán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     amountPaid: { type: number }
 *                     paymentResult: { type: object }
 */
router.post('/:shareToken/pay', authenticate, groupOrderController.payForParticipant);

/**
 * @swagger
 * /api/group-orders/{shareToken}/pay-all:
 *   post:
 *     summary: Thanh toán toàn bộ cho group order (người tạo hoặc ai đó trả hết)
 *     tags: [Group Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shareToken
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentMethod]
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, wallet]
 *                 example: card
 *     responses:
 *       200:
 *         description: Thanh toán toàn bộ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     amountPaid: { type: number }
 *                     message: { type: string }
 */
router.post('/:shareToken/pay-all', authenticate, groupOrderController.payForWholeGroup);

/**
 * @swagger
 * /api/group-orders/{shareToken}/payment-status:
 *   get:
 *     summary: Kiểm tra trạng thái thanh toán của tất cả participants
 *     tags: [Group Orders]
 *     parameters:
 *       - in: path
 *         name: shareToken
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lấy trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     allPaid: { type: boolean }
 *                     totalParticipants: { type: integer }
 *                     paidParticipants: { type: integer }
 *                     pendingParticipants: { type: integer }
 *                     participants:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId: { type: string }
 *                           userName: { type: string }
 *                           paymentStatus: { type: string }
 *                           paidAmount: { type: number }
 *                           totalAmount: { type: number }
 */
router.get('/:shareToken/payment-status', groupOrderController.checkPaymentStatus);

export default router;
