import Stripe from 'stripe';
import logger from '../utils/logger.js';

class StripeService {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    async createPaymentIntent(amount, currency, metadata) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount),
                currency: currency.toLowerCase(),
                metadata,
                automatic_payment_methods: {
                    enabled: true, // tự động chọn phương thức tối ưu
                },
            });

            logger.info('Stripe payment intent created:', paymentIntent.id);
            return paymentIntent;
        } catch (error) {
            logger.error('Stripe payment intent creation error:', error);
            throw new Error('Failed to create payment intent');
        }
    }

    // Kiểm tra tình trạng thanh toán
    async confirmPayment(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

            if (paymentIntent.status === 'succeeded') {
                return { success: true, paymentIntent };
            }

            return { success: false, paymentIntent };
        } catch (error) {
            logger.error('Stripe payment confirmation error:', error);
            throw error;
        }
    }

    // Tạo yêu cầu hoàn tiền
    async createRefund(paymentIntentId, amount, reason) {
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: paymentIntentId,
                amount: amount ? Math.round(amount) : undefined,
                reason: reason || 'requested_by_customer',
            });

            logger.info('Stripe refund created:', refund.id);
            return refund;
        } catch (error) {
            logger.error('Stripe refund creation error:', error);
            throw new Error('Failed to create refund');
        }
    }

    // Lấy thông tin chi tiết của Payment Intent
    async retrievePaymentIntent(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return paymentIntent;
        } catch (error) {
            logger.error('Stripe retrieve payment intent error:', error);
            throw error;
        }
    }
}

export default new StripeService();
