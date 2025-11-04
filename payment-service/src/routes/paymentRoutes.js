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
router.get('/user/:userId', authenticate, paymentController.getUserPayments);

// Refund payment
router.post('/:paymentId/refund', authenticate, paymentController.refundPayment);

export default router;
