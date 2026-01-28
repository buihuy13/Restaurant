import Payment from '../models/Payment.js';
import logger from '../utils/logger.js';
import stripeService from '../services/stripeService.js';
import rabbitmqConnection from '../config/rabbitmq.js';
import walletService from './walletService.js';
import axios from 'axios';
// import { Error } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

class PaymentService {
    generatePaymentId() {
        return `PAY${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    }

    // Tạo thanh toán mới (Phiên bản rút gọn)
    async createPayment(paymentData) {
        try {
            const paymentId = this.generatePaymentId();

            // Sử dụng metadata trực tiếp từ dữ liệu gửi lên, gán cả 2 loại key để an toàn
            const inputMeta = paymentData.metadata || {};
            const restaurantId = inputMeta.restaurantId || inputMeta.restaurant_id || inputMeta.merchantId || inputMeta.merchant_id;
            const amountForMerchant = inputMeta.amountForMerchant || inputMeta.amountForRestaurant || inputMeta.amount_for_merchant;

            const metadata = {
                ...inputMeta,
                restaurantId: restaurantId,
                amountForMerchant: amountForMerchant,
            };

            const payment = await Payment.create({
                paymentId,
                orderId: paymentData.orderId,
                userId: paymentData.userId,
                amount: paymentData.amount,
                currency: paymentData.currency ? paymentData.currency.toLowerCase() : 'usd',
                paymentMethod: paymentData.paymentMethod,
                status: 'pending',
                metadata,
            });

            logger.info(`Created payment ${paymentId} (${paymentData.paymentMethod})`);

            switch (paymentData.paymentMethod) {
                case 'card':
                    return await this.processCardPayment(payment);
                default:
                    throw new Error(`Unsupported payment method: ${payment.paymentMethod}`);
            }
        } catch (error) {
            logger.error(`Create payment failed: ${error.message}`);
            throw error;
        }
    }

    // Thanh toán bằng thẻ (Stripe)
    async processCardPayment(payment) {
        try {
            // Kiểm tra xem có hỗ trợ currency không
            if (payment.currency.toLowerCase() === 'vnd') {
                throw new Error('Stripe does not support VND. Use USD instead.');
            }

            // cập nhật trạng thái sang "processing"
            payment.status = 'processing';
            await payment.save();

            // Tạo PaymentIntent trên Stripe
            const paymentIntent = await stripeService.createPaymentIntent(
                payment.amount,
                payment.currency.toLowerCase() || 'usd',
                {
                    paymentId: payment.paymentId,
                    orderId: payment.orderId,
                    userId: payment.userId,
                    restaurantId: payment.metadata?.restaurantId,
                    amountForMerchant: payment.metadata?.amountForMerchant,
                },
            );

            if (!paymentIntent || !paymentIntent.client_secret) {
                throw new Error('PaymentIntent created but missing client_secret');
            }

            // Lưu lại thông tin giao dịch Stripe
            payment.transactionId = paymentIntent.id;
            // Persist paymentId into metadata so webhook can lookup reliably
            payment.metadata = {
                ...payment.metadata,
                paymentId: payment.paymentId,
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

    async completePayment(paymentId, transactionId) {
        try {
            const payment = await Payment.findOne({ where: { paymentId } });

            if (!payment) {
                throw new Error('Payment not found');
            }

            // Idempotent: if already completed, avoid re-processing credit but attempt publish if not credited
            if (payment.status === 'completed') {
                const metadata = payment.metadata || {};
                if (!metadata.merchantCredited) {
                    logger.info(
                        'completePayment called but payment already completed; attempting publishPaymentCompleted if not credited',
                        {
                            paymentId,
                        },
                    );
                    await this.publishPaymentCompleted(payment);
                } else {
                    logger.info(
                        'completePayment called but payment already completed and merchantCredited=true; skipping',
                        { paymentId },
                    );
                }
                return payment;
            }

            payment.status = 'completed';
            payment.transactionId = transactionId;
            payment.processedAt = new Date();
            await payment.save();

            await this.publishPaymentCompleted(payment);

            logger.info(`Payment completed: ${paymentId}`);
            return payment;
        } catch (error) {
            logger.error('Complete payment error:', error);
            throw error;
        }
    }

    async getPaymentByOrderId(orderId) {
        try {
            const payment = await Payment.findOne({
                where: { orderId },
                order: [['createdAt', 'DESC']],
            });

            return payment;
        } catch (error) {
            logger.error('Get payment error:', error);
            throw error;
        }
    }

    async getPaymentById(paymentId) {
        try {
            const payment = await Payment.findOne({ where: { paymentId } });
            return payment;
        } catch (error) {
            logger.error('Get payment by ID error:', error);
            throw error;
        }
    }

    async getUserPayments(userId, filters = {}) {
        try {
            const where = { userId };

            if (filters.status) {
                where.status = filters.status;
            }

            const page = parseInt(filters.page) || 1;
            const limit = parseInt(filters.limit) || 10;
            const offset = (page - 1) * limit;

            const { count, rows } = await Payment.findAndCountAll({
                where,
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });

            return { count, rows };
        } catch (error) {
            logger.error('Get user payments error:', error);
            throw error;
        }
    }

    // Xử lý webhook từ Stripe
    async handleStripeWebhook(event) {
        const { type, data } = event;

        logger.info('=== STRIPE WEBHOOK RECEIVED ===', {
            type,
            paymentIntentId: data.object?.id,
            metadata: data.object?.metadata,
        });

        try {
            // Prefer paymentId from metadata (more reliable), fall back to transactionId
            if (type === 'payment_intent.succeeded') {
                const paymentIntent = data.object;
                const metaPaymentId = paymentIntent.metadata?.paymentId || paymentIntent.metadata?.payment_id;

                let payment = null;
                if (metaPaymentId) {
                    payment = await Payment.findOne({ where: { paymentId: metaPaymentId } });
                }

                if (!payment) {
                    payment = await Payment.findOne({ where: { transactionId: paymentIntent.id } });
                }

                if (!payment)
                    return logger.warn(
                        `No payment found for intent ${paymentIntent.id} (metaPaymentId=${metaPaymentId})`,
                    );

                // Ensure transactionId is set and mark completed (transition from processing -> completed)
                const prevStatus = payment.status;
                payment.transactionId = payment.transactionId || paymentIntent.id;
                if (payment.status !== 'completed') {
                    payment.status = 'completed';
                    payment.processedAt = new Date();
                    await payment.save();
                    logger.info(`Payment status transition: ${prevStatus} -> completed for ${payment.paymentId}`);
                } else {
                    // still ensure transactionId persisted
                    await payment.save();
                }

                // Gửi event sang RabbitMQ
                await this.publishPaymentCompleted(payment);
                logger.info(`Stripe payment succeeded: ${payment.paymentId}`);
            }

            if (type === 'payment_intent.payment_failed') {
                const paymentIntent = data.object;
                const metaPaymentId = paymentIntent.metadata?.paymentId || paymentIntent.metadata?.payment_id;

                let payment = null;
                if (metaPaymentId) {
                    payment = await Payment.findOne({ where: { paymentId: metaPaymentId } });
                }

                if (!payment) {
                    payment = await Payment.findOne({ where: { transactionId: paymentIntent.id } });
                }

                if (!payment)
                    return logger.warn(
                        `No payment found for failed intent ${paymentIntent.id} (metaPaymentId=${metaPaymentId})`,
                    );

                payment.transactionId = payment.transactionId || paymentIntent.id;
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
    async refundPayment(paymentId, refundData) {
        try {
            // Kiểm tra tính hợp lệ của giao dịch
            const payment = await Payment.findOne({ where: { paymentId } });
            if (!payment) throw new Error('Payment not found');
            if (payment.status !== 'completed') throw new Error('Only completed payments can be refunded');

            const refundAmount = refundData.amount || payment.amount;
            if (refundAmount > payment.amount) throw new Error('Refund exceeds original payment');

            let refundId = null;
            if (payment.paymentMethod === 'card') {
                const refund = await stripeService.createRefund(payment.transactionId, refundAmount, refundData.reason);
                refundId = refund.id;
            }

            payment.status = 'refunded';
            payment.refundAmount = refundAmount;
            payment.refundReason = refundData.reason;
            payment.refundedAt = new Date();
            payment.refundTransactionId = refundId;
            await payment.save();

            await this.publishPaymentRefunded(payment);
            logger.info(`Payment refunded: ${payment.paymentId}`);
            return payment;
        } catch (error) {
            logger.error(`Refund payment error: ${error.message}`);
            throw error;
        }
    }

    async publishPaymentCompleted(payment) {
        await this.publishEvent('payment.completed', {
            paymentId: payment.paymentId,
            orderId: payment.orderId,
            email: payment.userEmail,
            amount: parseFloat(payment.amount),
            transactionId: payment.transactionId,
            url: `/api/orders/user/${payment.userId}`,
            timestamp: new Date().toISOString(),
        });

        // Try to credit merchant wallet immediately if we have restaurant info in metadata
        try {
            const metadata = payment.metadata || {};
            logger.info('publishPaymentCompleted - payment metadata:', { paymentId: payment.paymentId, metadata });
            let restaurantId = metadata.restaurantId;
            let rawAmount = metadata.amountForMerchant;
            let amountForMerchant = Number(rawAmount);

            // Fallback: if metadata missing merchant info, try to fetch order from Order Service
            if ((!restaurantId || !Number.isFinite(amountForMerchant) || amountForMerchant <= 0) && payment.orderId) {
                const orderServiceUrl =
                    process.env.ORDER_SERVICE_URL || process.env.ORDER_SERVICE || process.env.ORDER_SERVICE_URL_BASE;
                if (orderServiceUrl) {
                    try {
                        const url = `${orderServiceUrl.replace(/\/$/, '')}/api/orders/${encodeURIComponent(
                            payment.orderId,
                        )}`;
                        logger.info('publishPaymentCompleted - fetching order for fallback metadata', {
                            url,
                            orderId: payment.orderId,
                        });
                        const resp = await axios.get(url, { timeout: 5000 });
                        const order = resp.data?.data || resp.data;
                        if (order) {
                            restaurantId = restaurantId || order.restaurantId || order.restaurant_id || order.merchantId || order.merchant_id;
                            const total = Number(
                                order.totalAmount || order.total_amount || order.total || payment.amount || 0,
                            );
                            amountForMerchant = amountForMerchant || Math.round(total * 0.9);

                            // persist enriched metadata back to payment so future retries don't need lookup
                            payment.metadata = { ...metadata, restaurantId, amountForMerchant };
                            await payment.save();
                            logger.info('publishPaymentCompleted - enriched payment metadata from order service', {
                                paymentId: payment.paymentId,
                                restaurantId,
                                amountForMerchant,
                            });
                        }
                    } catch (err) {
                        logger.warn('publishPaymentCompleted - failed to fetch order for metadata fallback', {
                            orderId: payment.orderId,
                            error: err.message,
                        });
                    }
                } else {
                    logger.warn('publishPaymentCompleted - ORDER_SERVICE_URL not configured, cannot enrich metadata');
                }
            }

            // Do NOT auto-credit merchant here. Crediting must wait until the Order Service
            // emits an explicit order.completed event (which guarantees the order lifecycle
            // reached 'completed' state). Defer all crediting to the orderCompleted consumer
            // to ensure both order.status === 'completed' and payment.status === 'paid'.
            logger.info('publishPaymentCompleted - deferred merchant credit to order.completed consumer', {
                paymentId: payment.paymentId,
                orderId: payment.orderId,
                restaurantId,
                amountForMerchant,
            });
        } catch (creditError) {
            logger.error(`Auto credit to merchant wallet failed: ${creditError.message}`, {
                stack: creditError.stack || creditError,
            });
        }
    }

    async publishPaymentFailed(payment) {
        await this.publishEvent('payment.failed', {
            paymentId: payment.paymentId,
            orderId: payment.orderId,
            userId: payment.userId,
            amount: parseFloat(payment.amount),
            timestamp: new Date().toISOString(),
        });
    }

    async publishPaymentPending(payment) {
        await this.publishEvent('payment.pending', {
            paymentId: payment.paymentId,
            orderId: payment.orderId,
            userId: payment.userId,
            amount: parseFloat(payment.amount),
            timestamp: new Date().toISOString(),
        });
    }

    async publishPaymentRefunded(payment) {
        await this.publishEvent('payment.refunded', {
            paymentId: payment.paymentId,
            orderId: payment.orderId,
            userId: payment.userId,
            refundAmount: parseFloat(payment.refundAmount),
            refundReason: payment.refundReason,
            timestamp: new Date().toISOString(),
        });
    }

    async publishEvent(eventType, payload) {
        try {
            await rabbitmqConnection.publishMessage(rabbitmqConnection.exchanges.PAYMENT, eventType, payload);
            logger.info(`Published event: ${eventType}`);
        } catch (error) {
            logger.error(`Failed to publish ${eventType}: ${error.message}`);
        }
    }

    // Khi nhận được event "order.created" từ RabbitMQ -> Tự động tạo giao dịch thanh toán tương ứng
    async handleOrderCreated(orderData) {
        try {
            logger.info(`Received order.created for ${orderData.orderId}`);
            const paymentData = {
                orderId: orderData.orderId,
                userId: orderData.userId,
                amount: orderData.totalAmount,
                paymentMethod: orderData.paymentMethod,
                currency: (orderData.currency || 'USD').toLowerCase(),
                // pass restaurant info into metadata so later when payment completes we can credit merchant
                metadata: {
                    restaurantId: orderData.restaurantId || orderData.merchantId,
                    amountForMerchant: Math.round((orderData.totalAmount || 0) * 0.9), // default 10% platform fee
                },
            };

            // Check if payment already exists for this order to avoid duplicates (idempotency)
            const existingPayment = await Payment.findOne({ where: { orderId: orderData.orderId } });
            if (existingPayment) {
                logger.info(`Payment already exists for order ${orderData.orderId}, skipping creation`);
                return;
            }

            await this.createPayment(paymentData);
        } catch (error) {
            logger.error(`handleOrderCreated failed: ${error.message}`);
        }
    }
}

export default new PaymentService();
