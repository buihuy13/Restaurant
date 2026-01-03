// src/controllers/adminWalletController.js
import walletService from '../services/walletService.js';
import logger from '../utils/logger.js';
import PayoutRequest from '../models/PayoutRequest.js';
import Wallet from '../models/Wallet.js';

class AdminWalletController {
    // Danh sách yêu cầu rút tiền
    async getPayoutRequests(req, res) {
        try {
            const { status, page = 1, limit = 20 } = req.query;
            const offset = (page - 1) * limit;

            const where = status ? { status } : {};
            const { count, rows } = await PayoutRequest.findAndCountAll({
                where,
                include: [{ model: Wallet, attributes: ['restaurantId'] }],
                order: [['createdAt', 'DESC']],
                offset,
                limit,
            });

            res.json({
                success: true,
                data: { requests: rows, pagination: { page: +page, limit: +limit, total: count } },
            });
        } catch (error) {
            logger.error('Admin get payouts error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Duyệt
    async approve(req, res) {
        try {
            const result = await walletService.approvePayout(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // Từ chối
    async reject(req, res) {
        try {
            const { reason } = req.body;
            const result = await walletService.rejectPayout(req.params.id, reason);
            res.json(result);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

export default new AdminWalletController();
