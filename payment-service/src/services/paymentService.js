import Payment from '../models/Payment.js';
import logger from '../utils/logger';
import stripeService from '../services/stripeService.js';
import rabbitmqConnection from '../config/rabbitmq.js';

class PaymentService {
    generatePaymentId() {
        return `PAY${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    }

    // Tạo thanh toán mới
    async createPayment(paymentData) {
        try {
            const paymentId = this.generatePaymentId();

            const payment = await Payment.create({
                paymentId,
                orderId: paymentData.orderId,
                userId: paymentData.userId,
                amount: paymentData.amount,
                currency: paymentData.currency || 'VND',
                paymentMethod: paymentData.paymentMethod,
                status: 'pending',
                metadata: paymentData.metadata || {},
            });

            logger.info(`Created payment ${paymentId} (${paymentData.paymentMethod})`);

            switch (paymentData.paymentMethod) {
                case 'card':
                    return await this.processCardPayment(payment);
                case 'wallet':
                    return await this.processWalletPayment(payment);
                case 'cash':
                default:
                    payment.status = 'pending';
                    await payment.save();
                    return payment;
            }
        } catch (error) {
            logger.error(`Create payment failed: ${error.message}`);
            throw error;
        }
    }

    // Thanh toán bằng thẻ (Stripe)
    async processCardPayment(payment) {
        try {
            // cập nhật trạng thái sang "processing"
            payment.status = 'processing';
            await payment.save();

            // Tạo PaymentIntent trên Stripe
            const paymentIntent = await stripeService.createPaymentIntent(
                payment.amount,
                payment.currency.toLowerCase(),
                {
                    paymentId: payment.paymentId,
                    orderId: payment.orderId,
                    userId: payment.userId,
                },
            );

            // Lưu lại thông tin giao dịch Stripe
            payment.transactionId = paymentIntent.id;
            payment.metadata = {
                ...payment.metadata,
                clientSecret: paymentIntent.client_secret,
            };
            await payment.save();

            logger.info(
                `PaymentIntent created successfully for paymentId=${payment.paymentId}, amount=${payment.amount} ${payment.currency}`,
            );

            return {
                clientSecret: paymentIntent.client_secret,
                paymentId: payment.paymentId,
                status: payment.status,
            };
        } catch (error) {
            logger.error(`Stripe payment failed: ${error.message}`);

            // cập nhật trạng thái thất bại và lưu lý do
            payment.status = 'failed';
            payment.failureReason = error.message;
            await payment.save();

            // gửi sự kiện để notification-service/ order-service biết thanh toán lỗi
            await this.publishPaymentFailed(payment);

            throw new Error(`Payment processing failed: ${error.message}`);
        }
    }

    // Thanh toán qua ví
    async processWalletPayment(payment) {
        try {
            payment.status = 'processing';
            await payment.save();

            // Giả lập thanh toán thành công sau 2 giây
            const transactionId = `WALLET_${uuidv4()}`;
            payment.transactionId = transactionId;
            payment.status = 'completed';
            payment.processedAt = new Date();
            await payment.save();

            // Gửi thông báo thành công qua RabbitMQ
            await this.publishPaymentCompleted(payment);

            logger.info(`Wallet payment completed: ${payment.paymentId}`);
            return payment;
        } catch (error) {
            // Cập nhật thất bại
            payment.status = 'failed';
            payment.failureReason = error.message;
            await payment.save();
            await this.publishPaymentFailed(payment);

            logger.error(`processWalletPayment failed: ${error.message}`);
            throw error;
        }
    }

    async completePayment(paymentId, transactionId) {}

    // Xử lý webhook từ Stripe
    async handleStripeWebhook(event) {
        const { type, data } = event;

        try {
            if (type === 'payment_intent.succeeded') {
                const paymentIntent = data.object;
                const payment = await Payment.findOne({ where: { transactionId: paymentIntent.id } });

                if (!payment) return logger.warn(`No payment found for transaction ${paymentIntent.id}`);

                // Đánh dấu hoàn tất
                payment.status = 'completed';
                payment.processedAt = new Date();
                await payment.save();

                // Gửi event sang RabbitMQ
                await this.publishPaymentCompleted(payment);
                logger.info(`Stripe payment succeeded: ${payment.paymentId}`);
            }

            if (type === 'payment_intent.payment_failed') {
                const paymentIntent = data.object;
                const payment = await Payment.findOne({ where: { transactionId: paymentIntent.id } });

                if (!payment) return logger.warn(`⚠️ No payment found for transaction ${paymentIntent.id}`);

                payment.status = 'failed';
                payment.failureReason = paymentIntent.last_payment_error?.message || 'Unknown error';
                await payment.save();

                await this.publishPaymentFailed(payment);
                logger.warn(`Stripe payment failed: ${payment.paymentId}`);
            }
        } catch (error) {
            logger.error(`handleStripeWebhook error: ${error.message}`);
        }
    }

    // Hoàn tiền
    async refundPayment(paymentId, refundData) {}

    async publishPaymentCompleted(payment) {}

    async publishPaymentFailed(payment) {}

    async publishPaymentRefunded(payment) {}

    // Khi nhận được event "order.created" từ RabbitMQ -> Tự động tạo giao dịch thanh toán tương ứng
    async handleOrderCreated(orderData) {}
}

export default new PaymentService();
