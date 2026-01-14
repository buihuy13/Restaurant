import rabbitmqConnection from '../config/rabbitmq.js';
import Wallet from '../models/Wallet.js';
import WalletTransaction from '../models/WalletTransaction.js';
import logger from '../utils/logger.js';
import Payment from '../models/Payment.js';
import walletService from '../services/walletService.js';

export const startOrderCompletedConsumer = async () => {
    try {
        await rabbitmqConnection.consumeMessage(rabbitmqConnection.queues.ORDER_COMPLETED, async (orderData) => {
            try {
                logger.info('Order completed event received:', orderData);

                // Khi nhận event order.completed, chỉ cộng tiền nếu:
                // - Có payment liên quan và payment.status === 'completed'
                // - payment.metadata cho biết merchantId và amountForMerchant
                // - payment chưa được đánh dấu merchantCredited (idempotency)

                const orderId = orderData.orderId || orderData.id || orderData.order_id;
                if (!orderId) {
                    logger.warn('order.completed missing orderId, skipping credit');
                    return;
                }

                logger.info(`Order completed event received for ${orderId}`);

                try {
                    // Ensure the order itself is in completed state before attempting to credit
                    const orderStatusRaw = orderData.status || orderData.orderStatus || orderData.state;
                    const orderStatus = orderStatusRaw ? String(orderStatusRaw).toLowerCase() : null;
                    if (orderStatus !== 'completed') {
                        logger.info(
                            `Order ${orderId} event received but order status is not completed (status=${orderStatusRaw}), skipping credit`,
                        );
                        return;
                    }
                    const payment = await Payment.findOne({ where: { orderId }, order: [['createdAt', 'DESC']] });
                    if (!payment) {
                        logger.info(`No payment found for order ${orderId}, skipping wallet credit`);
                        return;
                    }

                    // We expect payment.status to be 'paid' in the new convention
                    if (String(payment.status).toLowerCase() !== 'paid') {
                        logger.info(
                            `Payment for order ${orderId} not paid (status=${payment.status}), skipping credit`,
                        );
                        return;
                    }

                    const metadata = payment.metadata || {};
                    const merchantId = metadata.merchantId || metadata.merchant_id;
                    const rawAmount =
                        metadata.amountForMerchant ||
                        metadata.amount_for_merchant ||
                        metadata.amountForRestaurant ||
                        metadata.amount_for_restaurant;
                    const amountForMerchant = Number(rawAmount);

                    if (!merchantId || !Number.isFinite(amountForMerchant) || amountForMerchant <= 0) {
                        logger.warn(
                            `Missing merchant metadata or invalid amount for payment ${payment.paymentId}, skipping credit`,
                            {
                                paymentId: payment.paymentId,
                                merchantId,
                                amountForMerchant: rawAmount,
                            },
                        );
                        return;
                    }

                    if (payment.metadata?.merchantCredited) {
                        logger.info(
                            `Payment ${payment.paymentId} already credited to merchant ${merchantId}, skipping`,
                        );
                        return;
                    }

                    // Perform credit
                    await walletService.credit(
                        merchantId,
                        payment.orderId,
                        amountForMerchant,
                        `Auto credit from payment ${payment.paymentId} after order completed`,
                    );

                    // mark as credited
                    payment.metadata = { ...(payment.metadata || {}), merchantCredited: true };
                    await payment.save();

                    logger.info(
                        `Auto-credited wallet for merchant ${merchantId} amount ${amountForMerchant} for order ${orderId}`,
                    );
                } catch (err) {
                    logger.error('Error processing wallet credit on order completed:', err);
                }
            } catch (error) {
                logger.error('Error processing order completed event:', error);
            }
        });
    } catch (error) {
        logger.error('Error starting order completed consumer:', error);
        setTimeout(startOrderCompletedConsumer, 5000);
    }
};
