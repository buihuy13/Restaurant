import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

// Create payment
router.post('/', paymentController.createPayment);

// Get payment by order ID
router.get('/order/:orderId', paymentController.getPaymentByOrderId);

// Get payment by payment ID
router.get('/:paymentId', paymentController.getPaymentById);

// Get user payments
router.get('/user/:userId', paymentController.getUserPayments);

// Refund payment
router.post('/:paymentId/refund', paymentController.refundPayment);

router.post(
    '/webhook/stripe',
    express.raw({ type: 'application/json' }), // QUAN TRỌNG: nhận raw body
    paymentController.handleWebhook, // controller xử lý webhook
);

export default router;
