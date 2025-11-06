import { createPaymentSchema } from '../dtos/createPaymentDto.js';
import paymentService from '../services/paymentService.js';
import logger from '../utils/logger.js';

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management API
 */
class PaymentController {
    /**
     * @swagger
     * /api/payments:
     *   post:
     *     summary: Create a new payment
     *     tags: [Payments]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - orderId
     *               - userId
     *               - amount
     *               - paymentMethod
     *             properties:
     *               orderId:
     *                 type: string
     *               userId:
     *                 type: string
     *               amount:
     *                 type: number
     *               paymentMethod:
     *                 type: string
     *                 enum: [cash, card, wallet]
     *               currency:
     *                 type: string
     *                 default: USD
     *     responses:
     *       201:
     *         description: Payment created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 data:
     *                   $ref: '#/components/schemas/Payment'
     */
    async createPayment(req, res, next) {
        try {
            const { error } = createPaymentSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message,
                });
            }

            const payment = await paymentService.createPayment(req.body);

            res.status(201).json({
                success: true,
                message: 'Payment created successfully',
                data: payment,
            });
        } catch (error) {
            logger.error('Create payment controller error:', error);
            next(error);
        }
    }

    /**
     * @swagger
     * /api/payments/order/{orderId}:
     *   get:
     *     summary: Get payment by order ID
     *     tags: [Payments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: orderId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Payment details
     *       404:
     *         description: Payment not found
     */
    async getPaymentByOrderId(req, res, next) {
        try {
            const { orderId } = req.params;
            const payment = await paymentService.getPaymentByOrderId(orderId);

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found',
                });
            }

            res.status(200).json({
                success: true,
                data: payment,
            });
        } catch (error) {
            logger.error('Get payment controller error:', error);
            next(error);
        }
    }

    /**
     * @swagger
     * /api/payments/{paymentId}:
     *   get:
     *     summary: Get payment by payment ID
     *     tags: [Payments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: paymentId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Payment details
     *       404:
     *         description: Payment not found
     */
    async getPaymentById(req, res, next) {
        try {
            const { paymentId } = req.params;
            const payment = await paymentService.getPaymentById(paymentId);

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found',
                });
            }

            res.status(200).json({
                success: true,
                data: payment,
            });
        } catch (error) {
            logger.error('Get payment by ID controller error:', error);
            next(error);
        }
    }

    /**
     * @swagger
     * /api/payments/user/{userId}:
     *   get:
     *     summary: Get user's payment history
     *     tags: [Payments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *       - in: query
     *         name: status
     *         schema:
     *           type: string
     *           enum: [pending, processing, completed, failed, refunded]
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *     responses:
     *       200:
     *         description: List of payments
     */
    async getUserPayments(req, res, next) {
        try {
            const { userId } = req.params;
            const filters = req.query;

            const result = await paymentService.getUserPayments(userId, filters);

            res.status(200).json({
                success: true,
                data: result.payments,
                pagination: result.pagination,
            });
        } catch (error) {
            logger.error('Get user payments controller error:', error);
            next(error);
        }
    }
    /**
     * @swagger
     * /api/payments/{paymentId}/refund:
     *   post:
     *     summary: Refund a payment
     *     tags: [Payments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: paymentId
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
     *               amount:
     *                 type: number
     *               reason:
     *                 type: string
     *     responses:
     *       200:
     *         description: Payment refunded successfully
     */
    async refundPayment(req, res, next) {
        try {
            const { paymentId } = req.params;
            const { error } = refundPaymentSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message,
                });
            }

            const payment = await paymentService.refundPayment(paymentId, req.body);

            res.status(200).json({
                success: true,
                message: 'Payment refunded successfully',
                data: payment,
            });
        } catch (error) {
            logger.error('Refund payment controller error:', error);
            next(error);
        }
    }
}

export default new PaymentController();
