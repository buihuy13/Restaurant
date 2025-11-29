import Stripe from 'stripe';
import logger from '../utils/logger.js';

class StripeService {
    constructor() {
        if (!process.env.STRIPE_SECRET_KEY) {
            logger.error('STRIPE_SECRET_KEY is not defined');
            throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
        }

        if (
            !process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') &&
            !process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')
        ) {
            logger.error('STRIPE_SECRET_KEY format is invalid');
            throw new Error('STRIPE_SECRET_KEY must start with sk_test_ or sk_live_');
        }

        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        logger.info('StripeService initialized successfully');
    }

    async createPaymentIntent(amount, currency, metadata) {
        try {
            // Convert amount to cents (Stripe required)
            const normalizedAmount = Math.round(Number(amount) * 100);

            if (!normalizedAmount || normalizedAmount <= 0) {
                throw new Error(`Invalid Stripe amount: ${amount}`);
            }

            // Force USD because Stripe không support VND
            const normalizedCurrency = (currency || 'usd').toLowerCase();
            const supportedCurrencies = ['usd', 'eur', 'sgd'];

            if (!supportedCurrencies.includes(normalizedCurrency)) {
                logger.warn(`Unsupported currency ${currency}, fallback to USD`);
            }

            logger.info(`Creating PaymentIntent: amount=${normalizedAmount}, currency=usd`);

            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: normalizedAmount,
                currency: 'usd', // luôn USD cho chắc
                metadata,
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            logger.info(`Stripe PaymentIntent created: ${paymentIntent.id}`);
            return paymentIntent;
        } catch (error) {
            logger.error('STRIPE ERROR:', {
                message: error.message,
                type: error.type,
                code: error.code,
                decline_code: error.decline_code,
                raw: error.raw || error,
            });
            throw error;
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
