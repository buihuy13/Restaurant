// src/services/walletService.js
import Wallet from '../models/Wallet.js';
import WalletTransaction from '../models/WalletTransaction.js';
import PayoutRequest from '../models/PayoutRequest.js';
import logger from '../utils/logger.js';

class WalletService {
    // 1. CỘNG TIỀN KHI ĐƠN HOÀN TẤT (Order Service gọi)
    async credit(restaurantId, orderId, amount, description = '') {
        // Validate đầu vào
        if (!restaurantId || !orderId || !amount || amount <= 0) {
            throw new Error('Thiếu hoặc sai thông tin: restaurantId, orderId, amount');
        }

        // Idempotency: if we already recorded a COMPLETED EARN transaction for this order, skip
        try {
            const existingTx = await WalletTransaction.findOne({
                where: { orderId, type: 'EARN', status: 'COMPLETED' },
            });
            if (existingTx) {
                logger.info('walletService.credit - skipping duplicate credit for order', {
                    restaurantId,
                    orderId,
                    amount,
                });
                return; // already credited
            }
        } catch (err) {
            logger.warn('walletService.credit - failed to check existing transactions, continuing', {
                error: err.stack || err,
            });
        }

        const t = await Wallet.sequelize.transaction(); // BẮT ĐẦU TRANSACTION – QUAN TRỌNG NHẤT!

        try {
            let wallet = await Wallet.findOne({
                where: { restaurantId },
                lock: t.LOCK.UPDATE, // khóa record để tránh race condition
                transaction: t,
            });

            if (!wallet) {
                wallet = await Wallet.create(
                    {
                        restaurantId,
                        balance: 0,
                        totalEarned: 0,
                        totalWithdrawn: 0,
                    },
                    { transaction: t },
                );
                logger.info(`Tạo ví mới cho nhà hàng: ${restaurantId}`);
            }

            // Cộng tiền vào ví
            await wallet.increment({ balance: amount, totalEarned: amount }, { transaction: t });

            // Tạo lịch sử giao dịch – BẮT BUỘC PHẢI THÀNH CÔNG
            await WalletTransaction.create(
                {
                    walletId: wallet.id,
                    orderId,
                    type: 'EARN',
                    amount,
                    status: 'COMPLETED',
                    description: description || `Đơn #${orderId} – giao thành công`,
                },
                { transaction: t },
            );

            // Thành công → commit
            await t.commit();

            logger.info(`Cộng tiền thành công: +${amount.toLocaleString()}đ → ví ${restaurantId} (đơn #${orderId})`);
        } catch (error) {
            // Có lỗi → rollback hết, không để tiền "bốc hơi"
            await t.rollback();
            logger.error('Cộng tiền ví thất bại – đã rollback:', {
                restaurantId,
                orderId,
                amount,
                error: error.stack || error,
            });
            throw error; // ném ra để Order Service biết và retry sau
        }
    }

    async getByRestaurantId(restaurantId) {
        const wallet = await Wallet.findOne({ where: { restaurantId } });
        if (!wallet) return { balance: 0, totalEarned: 0, totalWithdrawn: 0 };
        return {
            balance: parseFloat(wallet.balance),
            totalEarned: parseFloat(wallet.totalEarned),
            totalWithdrawn: parseFloat(wallet.totalWithdrawn),
        };
    }

    async getTransactions(restaurantId, page = 1, limit = 20) {
        const wallet = await Wallet.findOne({ where: { restaurantId } });
        if (!wallet) return { transactions: [], pagination: { page, limit, total: 0, totalPages: 0 } };

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
            pagination: { page: +page, limit: +limit, total: count, totalPages: Math.ceil(count / limit) },
        };
    }

    // 4. NHÀ HÀNG RÚT TIỀN → NHẬP BANKINFO ĐỂ FAKE, NHƯNG CHỈ TRỪ TIỀN TRONG VÍ
    async requestWithdraw(restaurantId, amount, bankInfo, note = '') {
        const wallet = await Wallet.findOne({ where: { restaurantId } });
        if (!wallet) throw new Error('Ví không tồn tại');
        if (parseFloat(wallet.balance) < amount) throw new Error('Số dư không đủ');
        if (amount < 50000) throw new Error('Rút tối thiểu 50.000đ');

        // Validate bankInfo (fake nhưng vẫn phải hợp lệ)
        if (!bankInfo?.bankName || !bankInfo?.accountNumber || !bankInfo?.accountHolderName) {
            throw new Error('Vui lòng nhập đầy đủ thông tin ngân hàng');
        }

        const t = await Wallet.sequelize.transaction();
        try {
            const payout = await PayoutRequest.create(
                {
                    walletId: wallet.id,
                    amount,
                    bankInfo, // Lưu lại để admin thấy
                    note,
                    status: 'pending',
                },
                { transaction: t },
            );

            await wallet.decrement('balance', { by: amount, transaction: t });
            await wallet.increment('totalWithdrawn', { by: amount, transaction: t });

            await WalletTransaction.create(
                {
                    walletId: wallet.id,
                    payoutRequestId: payout.id,
                    type: 'WITHDRAW',
                    amount: -amount,
                    status: 'PENDING',
                    description: `Rút ${amount.toLocaleString()}đ → ${bankInfo.bankName}`,
                },
                { transaction: t },
            );

            await t.commit();
            return { success: true, message: 'Đã gửi yêu cầu rút tiền', data: payout };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    // 5. ADMIN DUYỆT → CHỈ ĐỔI STATUS, HIỂN THỊ BANKINFO ĐỂ "GIẢ VỜ CHUYỂN"
    async approvePayout(payoutId) {
        const t = await Wallet.sequelize.transaction();
        try {
            const payout = await PayoutRequest.findByPk(payoutId, {
                include: [{ model: Wallet, attributes: ['restaurantId'] }],
            });
            if (!payout || payout.status !== 'pending') throw new Error('Yêu cầu không hợp lệ');

            await payout.update(
                {
                    status: 'completed',
                    processedAt: new Date(),
                },
                { transaction: t },
            );

            await WalletTransaction.update(
                { status: 'COMPLETED' },
                { where: { payoutRequestId: payout.id }, transaction: t },
            );

            await t.commit();

            const bank = payout.bankInfo;
            logger.warn(
                `[FAKE CHUYỂN KHOẢN] ĐÃ DUYỆT #${payoutId} | ${payout.amount.toLocaleString()}đ | ${
                    bank.bankName
                } - STK: ${bank.accountNumber} - CTK: ${bank.accountHolderName}`,
            );

            return {
                success: true,
                message: 'Đã duyệt thành công!',
                fakeTransferInfo: {
                    amount: payout.amount,
                    bankName: bank.bankName,
                    accountNumber: bank.accountNumber,
                    accountHolderName: bank.accountHolderName,
                },
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    // 6. TỪ CHỐI → HOÀN TIỀN
    async rejectPayout(payoutId, reason = 'Thông tin không hợp lệ') {
        const t = await Wallet.sequelize.transaction();
        try {
            const payout = await PayoutRequest.findByPk(payoutId, { include: [Wallet] });
            if (!payout || payout.status !== 'pending') throw new Error('Yêu cầu không hợp lệ');

            await payout.wallet.increment('balance', { by: payout.amount, transaction: t });
            await payout.wallet.decrement('totalWithdrawn', { by: payout.amount, transaction: t });

            await payout.update({ status: 'rejected', note: reason }, { transaction: t });
            await WalletTransaction.update(
                { status: 'REJECTED' },
                { where: { payoutRequestId: payout.id }, transaction: t },
            );

            await t.commit();
            return { success: true, message: 'Đã từ chối và hoàn tiền vào ví' };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

export default new WalletService();
