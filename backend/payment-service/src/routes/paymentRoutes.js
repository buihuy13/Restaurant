// src/routes/paymentRoutes.js
import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Tạo thanh toán mới (gọi từ Order Service)
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, userId, amount, paymentMethod]
 *             properties:
 *               orderId: { type: string }
 *               userId: { type: string }
 *               amount: { type: number }
 *               paymentMethod: { type: string, enum: [cash, card, wallet] }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', paymentController.createPayment);

// Dev/admin endpoint to force-complete a payment (for testing)
router.post('/:paymentId/complete', paymentController.completePayment);

/**
 * @swagger
 * /api/payments/order/{orderId}:
 *   get:
 *     summary: Lấy thông tin thanh toán theo orderId
 *     tags: [Payment]
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Thành công
 *         schema:
 *           $ref: '#/definitions/Payment'
 */
router.get('/order/:orderId', paymentController.getPaymentByOrderId);

/**
 * @swagger
 * /api/payments/{paymentId}:
 *   get:
 *     summary: Lấy thông tin thanh toán theo paymentId
 *     tags: [Payment]
 *     parameters:
 *       - name: paymentId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/:paymentId', paymentController.getPaymentById);

/**
 * @swagger
 * /api/payments/user/{userId}:
 *   get:
 *     summary: Lịch sử thanh toán của user
 *     tags: [Payment]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Danh sách thanh toán
 */
router.get('/user/:userId', paymentController.getUserPayments);

/**
 * @swagger
 * /api/payments/{paymentId}/refund:
 *   post:
 *     summary: Hoàn tiền (Refund)
 *     tags: [Payment]
 *     parameters:
 *       - name: paymentId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Hoàn tiền thành công
 */
router.post('/:paymentId/refund', paymentController.refundPayment);

/**
 * @swagger
 * /api/payments/webhook/stripe:
 *   post:
 *     summary: Stripe Webhook (không cần auth)
 *     tags: [Payment]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *     responses:
 *       200:
 *         description: Webhook received
 */
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

export default router;
