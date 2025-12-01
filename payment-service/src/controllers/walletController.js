// src/controllers/walletController.js
import walletService from '../services/walletService.js';
import logger from '../utils/logger.js';

class WalletController {
    async getWallet(req, res) {
        try {
            const data = await walletService.getByRestaurantId(req.user.restaurantId);
            res.json({ success: true, data });
        } catch (error) {
            logger.error('getWallet error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getTransactions(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await walletService.getTransactions(req.user.restaurantId, page, limit);
            res.json({ success: true, data: result });
        } catch (error) {
            logger.error('getTransactions error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async requestWithdraw(req, res) {
        try {
            const { amount, bankInfo, note } = req.body;
            if (
                !amount ||
                amount <= 0 ||
                !bankInfo?.bankName ||
                !bankInfo?.accountNumber ||
                !bankInfo?.accountHolderName
            ) {
                return res.status(400).json({ success: false, message: 'Thông tin không hợp lệ' });
            }

            const payout = await walletService.requestWithdraw(req.user.restaurantId, amount, bankInfo, note);

            res.json({
                success: true,
                message: 'Yêu cầu rút tiền đã được gửi',
                data: payout,
            });
        } catch (error) {
            logger.error('requestWithdraw error:', error);
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

export default new WalletController();
