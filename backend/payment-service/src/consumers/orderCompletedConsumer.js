import rabbitmqConnection from '../config/rabbitmq.js';
import Wallet from '../models/Wallet.js';
import WalletTransaction from '../models/WalletTransaction.js';
import logger from '../utils/logger.js';

export const startOrderCompletedConsumer = async () => {
    try {
        await rabbitmqConnection.consumeMessage(rabbitmqConnection.queues.ORDER_COMPLETED, async (orderData) => {
            try {
                logger.info('Order completed event received:', orderData);

                if (!['completed'].includes(orderData.paymentStatus?.toLowerCase())) {
                    logger.error(
                        `BLOCKED: Order ${orderData.orderId} not paid but received completed event!`,
                        orderData,
                    );
                    return; // KHÔNG CỘNG TIỀN
                }

                const platformFee = Math.round(orderData.totalAmount * 0.1); // 10% phí nền tảng
                const amountForRestaurant = orderData.totalAmount - platformFee;

                // Cập nhật ví của nhà hàng
                let wallet = await Wallet.findOne({ where: { restaurantId: orderData.restaurantId } });
                if (!wallet) {
                    wallet = await Wallet.create({
                        restaurantId: orderData.restaurantId,
                        balance: 0,
                        totalEarned: 0,
                        totalWithdrawn: 0,
                    });
                    logger.info(`Created new wallet for restaurant ${orderData.restaurantId}`);
                }
                // Idempotency: avoid duplicate credit for same order
                const existing = await WalletTransaction.findOne({
                    where: { orderId: orderData.orderId, type: 'EARN', status: 'COMPLETED' },
                });
                if (existing) {
                    logger.info('OrderCompletedConsumer - duplicate wallet credit detected, skipping', {
                        orderId: orderData.orderId,
                    });
                } else {
                    // Update wallet amounts atomically using increment
                    await wallet.increment({ balance: amountForRestaurant, totalEarned: amountForRestaurant });

                    // Record transaction history
                    await WalletTransaction.create({
                        walletId: wallet.id,
                        orderId: orderData.orderId,
                        type: 'EARN',
                        amount: amountForRestaurant,
                        status: 'COMPLETED',
                        description: `Đơn hàng ${orderData.orderId} hoàn thành`,
                    });
                }

                logger.info(`Đã cập nhật ví cho nhà hàng ${orderData.restaurantId} với số tiền ${amountForRestaurant}`);
            } catch (error) {
                logger.error('Error processing order completed event:', error);
            }
        });
    } catch (error) {
        logger.error('Error starting order completed consumer:', error);
        setTimeout(startOrderCompletedConsumer, 5000); // Thử lại sau 5 giây
    }
};
