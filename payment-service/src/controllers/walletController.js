import walletService from '../services/walletService.js';
import logger from '../utils/logger.js';

class WalletController {
    async getWallet(req, res) {
        try {
            const data = await walletService.getByRestaurantId(req.user.restaurantId);
            res.json({ success: true, data });
        } catch (error) {
            logger.error('getWallet error:', error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }

    async getTransactions(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = Math.min(parseInt(req.query.limit) || 20, 100); // giới hạn max 100
            const result = await walletService.getTransactions(req.user.restaurantId, page, limit);
            res.json({ success: true, data: result });
        } catch (error) {
            logger.error('getTransactions error:', error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }

    async requestWithdraw(req, res) {
        try {
            const { amount, bankInfo, note } = req.body;

            // Validate đẹp hơn
            if (!amount || amount < 50000) {
                return res.status(400).json({
                    success: false,
                    message: 'Số tiền rút phải ≥ 50.000đ',
                });
            }
            if (!bankInfo?.bankName || !bankInfo?.accountNumber || !bankInfo?.accountHolderName) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng nhập đầy đủ thông tin ngân hàng',
                });
            }

            const result = await walletService.requestWithdraw(req.user.restaurantId, amount, bankInfo, note);

            res.json({
                success: true,
                message: 'Yêu cầu rút tiền đã được gửi thành công!',
                data: result.data,
            });
        } catch (error) {
            logger.error('requestWithdraw error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Gửi yêu cầu thất bại',
            });
        }
    }
}

export default new WalletController();
