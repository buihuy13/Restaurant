// src/services/walletService.js
import Wallet from '../models/Wallet.js';
import WalletTransaction from '../models/WalletTransaction.js';
import PayoutRequest from '../models/PayoutRequest.js';
import logger from '../utils/logger.js';

class WalletService {
    // Cộng tiền khi đơn hoàn tất
    async credit(restaurantId, orderId, amount, description = '') {
        let wallet = await Wallet.findOne({ where: { restaurantId } });

        if (!wallet) {
            wallet = await Wallet.create({
                restaurantId,
                balance: 0,
                totalEarned: 0,
                totalWithdrawn: 0,
            });
            logger.info(`Tạo ví mới cho nhà hàng: ${restaurantId}`);
        }

        // Dùng increment để tránh race condition
        await wallet.increment({
            balance: amount,
            totalEarned: amount,
        });

        await WalletTransaction.create({
            walletId: wallet.id,
            orderId,
            type: 'EARN',
            amount,
            status: 'COMPLETED',
            description: description || `Đơn hàng #${orderId}`,
        });

        logger.info(`Cộng ${amount}đ vào ví ${restaurantId} | Đơn: ${orderId}`);
        return wallet;
    }

    async getByRestaurantId(restaurantId) {
        const wallet = await Wallet.findOne({ where: { restaurantId } });
        if (!wallet) {
            return { balance: 0, totalEarned: 0, totalWithdrawn: 0 };
        }
        return {
            balance: parseFloat(wallet.balance),
            totalEarned: parseFloat(wallet.totalEarned),
            totalWithdrawn: parseFloat(wallet.totalWithdrawn),
        };
    }

    async getTransactions(restaurantId, page = 1, limit = 20) {
        const wallet = await Wallet.findOne({ where: { restaurantId } });
        if (!wallet) {
            return { transactions: [], pagination: { page, limit, total: 0, totalPages: 0 } };
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await WalletTransaction.findAndCountAll({
            where: { walletId: wallet.id },
            order: [['createdAt', 'DESC']],
            offset,
            limit,
        });

        return {
            transactions: rows.map((t) => ({
                id: t.id,
                type: t.type,
                amount: parseFloat(t.amount),
                status: t.status,
                description: t.description,
                createdAt: t.createdAt,
            })),
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        };
    }

    async requestWithdraw(restaurantId, amount, bankInfo, note = '') {
        const wallet = await Wallet.findOne({ where: { restaurantId } });
        if (!wallet) throw new Error('Ví không tồn tại');
        if (parseFloat(wallet.balance) < amount) throw new Error('Số dư không đủ');

        // Tạo yêu cầu rút
        const payout = await PayoutRequest.create({
            walletId: wallet.id,
            amount,
            bankInfo,
            note,
            status: 'pending',
        });

        // Trừ tiền ví
        await wallet.decrement('balance', { by: amount });
        await wallet.increment('totalWithdrawn', { by: amount });

        // Ghi lịch sử
        await WalletTransaction.create({
            walletId: wallet.id,
            payoutRequestId: payout.id,
            type: 'WITHDRAW',
            amount: -amount,
            status: 'PENDING',
            description: `Rút ${amount.toLocaleString()}đ về ${bankInfo.bankName}`,
        });

        logger.info(`Nhà hàng ${restaurantId} yêu cầu rút ${amount}đ`);
        return payout;
    }
}

export default new WalletService();
