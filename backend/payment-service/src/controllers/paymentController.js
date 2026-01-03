import { createPaymentSchema } from '../dtos/createPaymentDto.js';
import paymentService from '../services/paymentService.js';
import stripeService from '../services/stripeService.js';
import logger from '../utils/logger.js';

class PaymentController {
    async handleWebhook(req, res) {
        const sig = req.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        // Kiểm tra cấu hình webhook secret
        if (!webhookSecret) {
            logger.error('STRIPE_WEBHOOK_SECRET is not set');
            return res.status(500).send('Server configuration error');
        }

        let event;
        // Xác thực webhook từ Stripe
        try {
            event = stripeService.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
            logger.info(`Webhook received: ${event.type}`);
        } catch (err) {
            logger.error(`Webhook signature verification failed: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Trả 200 NGAY LẬP TỨC để Stripe không retry
        res.status(200).json({ received: true });

        // Xử lý bất đồng bộ - không block response
        try {
            await paymentService.handleStripeWebhook(event);
        } catch (err) {
            logger.error(`Error in handleStripeWebhook: ${err.message}`);
            // Không trả lỗi về Stripe vì đã 200 rồi
        }
    }

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
