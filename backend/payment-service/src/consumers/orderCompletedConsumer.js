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

                const orderId = orderData.orderId || orderData.id || orderData.order_id;
                if (!orderId) {
                    logger.warn('order.completed missing orderId, skipping credit');
                    return;
                }

                // FIX 1: Verify order status and payment status from event
                const orderStatus = String(orderData.status || '').toLowerCase();
                const paymentStatus = String(orderData.paymentStatus || '').toLowerCase();

                if (orderStatus !== 'completed') {
                    logger.info(`Order ${orderId} event received but order status is ${orderStatus}, skipping credit`);
                    return;
                }

                if (paymentStatus !== 'paid' && paymentStatus !== 'completed') {
                    logger.info(`Payment for order ${orderId} not paid (status=${paymentStatus}), skipping credit`);
                    return;
                }

                // FIX 2: Check for existing payment for idempotency
                const payment = await Payment.findOne({
                    where: { orderId },
                    order: [['createdAt', 'DESC']],
                });

                if (!payment) {
                    logger.warn(`No payment record found for order ${orderId}, cannot verify account consistency but proceeding with credit based on event`);
                    // Note: In a production system, you might want to wait or fail if no payment record exists
                }

                // FIX 3: Check merchantCredited flag (idempotency)
                if (payment && payment.metadata?.merchantCredited) {
                    logger.info(`Already credited for order ${orderId}, skipping`);
                    return;
                }

                // FIX 4: Get info from EVENT
                const restaurantId = orderData.restaurantId;
                const merchantId = orderData.merchantId;

                // Calculate amount for merchant (90% of total if not provided)
                const totalAmount = Number(orderData.totalAmount || 0);
                const platformFee = Number(orderData.platformFee || totalAmount * 0.1);
                const amountForMerchant = Number(
                    orderData.amountForMerchant || (totalAmount - platformFee)
                );

                if (!restaurantId) {
                    logger.error(`Missing restaurantId for order ${orderId}, cannot credit wallet`);
                    return;
                }

                if (!Number.isFinite(amountForMerchant) || amountForMerchant <= 0) {
                    logger.error(`Invalid amountForMerchant: ${amountForMerchant} for order ${orderId}`);
                    return;
                }

                logger.info(`Crediting wallet for restaurant ${restaurantId}`, {
                    orderId,
                    amountForMerchant,
                    totalAmount,
                    platformFee,
                });

                // FIX 5: Credit wallet
                await walletService.credit(
                    restaurantId,
                    orderId,
                    amountForMerchant,
                    `Payment for completed order ${orderId}`,
                );

                // FIX 6: Mark as credited
                if (payment) {
                    payment.metadata = {
                        ...(payment.metadata || {}),
                        merchantCredited: true,
                        creditedAt: new Date().toISOString(),
                    };
                    await payment.save();
                }

                logger.info(`Successfully credited ${amountForMerchant} to restaurant ${restaurantId} for order ${orderId}`);

            } catch (error) {
                logger.error('Error processing order completed event:', error);
                // FIX 7: Throw error to allow RabbitMQ retry
                throw error;
            }
        });
    } catch (error) {
        logger.error('Error starting order completed consumer:', error);
        setTimeout(startOrderCompletedConsumer, 5000);
    }
};
