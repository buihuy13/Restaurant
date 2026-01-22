// src/services/walletService.js
import Wallet from '../models/Wallet.js';
import WalletTransaction from '../models/WalletTransaction.js';
import PayoutRequest from '../models/PayoutRequest.js';
import logger from '../utils/logger.js';

class WalletService {
    // 1. CỘNG TIỀN KHI ĐƠN HOÀN TẤT (Order Service gọi)
    async credit(restaurantId, orderId, amount, description = '') {
        // Validate đầu vào
        logger.info('walletService.credit - entry', { restaurantId, orderId, amount, description });

        if (!restaurantId || !orderId || !amount || amount <= 0) {
            logger.error('walletService.credit - invalid input', { restaurantId, orderId, amount });
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
                    existingTxId: existingTx.id,
                    existingTxAmount: existingTx.amount,
                    existingTxCreatedAt: existingTx.createdAt,
                });
                return; // already credited
            }
        } catch (err) {
            logger.warn('walletService.credit - failed to check existing transactions, continuing', {
                error: err.stack || err,
            });
        }

        const t = await Wallet.sequelize.transaction(); // BEGIN TRANSACTION

        try {
            // Use findOrCreate to lazy-init wallet if missing
            const [wallet, created] = await Wallet.findOrCreate({
                where: { restaurantId },
                defaults: {
                    restaurantId,
                    balance: 0,
                    totalEarned: 0,
                    totalWithdrawn: 0,
                },
                transaction: t,
            });

            if (created) {
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
            // Log post-commit wallet state for debugging
            try {
                const freshWallet = await Wallet.findOne({ where: { restaurantId } });
                logger.info(
                    `Cộng tiền thành công: +${amount.toLocaleString()} → ví ${restaurantId} (đơn #${orderId})`,
                    {
                        walletBalance: freshWallet ? parseFloat(freshWallet.balance) : null,
                        walletTotalEarned: freshWallet ? parseFloat(freshWallet.totalEarned) : null,
                    },
                );
            } catch (logErr) {
                logger.info(
                    `Cộng tiền thành công: +${amount.toLocaleString()}đ → ví ${restaurantId} (đơn #${orderId})`,
                );
            }
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
        if (amount < 2) throw new Error('Rút tối thiểu 2 USD');

        // Validate bankInfo (fake nhưng vẫn phải hợp lệ)
        if (!bankInfo?.bankName || !bankInfo?.accountNumber || !bankInfo?.accountHolderName) {
            throw new Error('Vui lòng nhập đầy đủ thông tin ngân hàng');
        }

        const t = await Wallet.sequelize.transaction();
        try {
            // Create payout request but DO NOT deduct wallet balance yet.
            // Admin must approve to perform actual debit.
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

            // Create a pending wallet transaction record for audit/UI purposes.
            await WalletTransaction.create(
                {
                    walletId: wallet.id,
                    payoutRequestId: payout.id,
                    type: 'WITHDRAW',
                    amount: -amount,
                    status: 'PENDING',
                    description: `Rút ${amount.toLocaleString()}$ → ${bankInfo.bankName}`,
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
                include: [{ model: Wallet, attributes: ['restaurantId', 'id', 'balance', 'totalWithdrawn'] }],
            });
            if (!payout || payout.status !== 'pending') throw new Error('Yêu cầu không hợp lệ');

            // Perform actual wallet debit now that admin approved
            await payout.wallet.decrement('balance', { by: payout.amount, transaction: t });
            await payout.wallet.increment('totalWithdrawn', { by: payout.amount, transaction: t });

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
                `[FAKE CHUYỂN KHOẢN] ĐÃ DUYỆT #${payoutId} | ${payout.amount.toLocaleString()}$ | ${bank.bankName
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

            // Since balance was NOT deducted at request time, do not add money back.
            await payout.update({ status: 'failed', note: reason }, { transaction: t });
            await WalletTransaction.update(
                { status: 'FAILED' },
                { where: { payoutRequestId: payout.id }, transaction: t },
            );

            await t.commit();
            return { success: true, message: 'Đã từ chối yêu cầu rút tiền' };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

export default new WalletService();
