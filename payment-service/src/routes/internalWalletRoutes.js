import express from 'express';
import walletService from '../services/walletService.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Chỉ Order Service được gọi (dùng API Key)
const requireInternalKey = (req, res, next) => {
    const key = req.headers['x-internal-key'] || req.headers['authorization'];
    if (key !== process.env.WALLET_INTERNAL_KEY) {
        logger.warn('Unauthorized internal wallet access', { ip: req.ip, key });
        return res.status(401).json({ success: false, message: 'Forbidden' });
    }
    next();
};

// API DUY NHẤT DÙNG ĐỂ CỘNG TIỀN KHI ĐƠN HOÀN TẤT
/**
 * @Swagger
 * /api/internal/wallet/credit:
 *   post:
 *    summary: [INTERNAL] Cộng tiền vào ví nhà hàng khi đơn hoàn tất + khách đã thanh toán
 *   tags: [Internal Wallet]
 *   security:
 *    - ApiKeyAuth: []
 *  requestBody:
 *    required: true
 *   content:
 *    application/json:
 *    schema:
 *     type: object
 *    required: [restaurantId, orderId, amount]
 *   properties:
 *    restaurantId:
 *    type: string
 *   orderId:
 *   type: string
 *  amount:
 *  type: number
 * description: Số tiền cộng vào ví (VNĐ)
 *  description:
 *   type: string
 * responses:
 *   200:
 *   description: Cộng tiền thành công
 *    content:
 *    application/json:
 *    schema:
 *    type: object
 *   properties:
 *   success:
 *    type: boolean
 *  message:
 *   type: string
 * data:
 *   type: object
 *
 *   properties:
 *   restaurantId: { type: string }
 *  orderId: { type: string }
 *  amount: { type: number }
 *  400:
 *  description: Thiếu thông tin hoặc amount không hợp lệ
 *  content:
 *   application/json:
 *   schema:
 *   type: object
 *  properties:
 *  success: { type: boolean }
 * message: { type: string }
 *  500:
 * description: Lỗi server
 * content:
 *  application/json:
 * schema:
 * type: object
 * properties:
 * success: { type: boolean }
 * message: { type: string }
 * error: { type: string }
 *
 */
router.post('/credit', requireInternalKey, async (req, res) => {
    try {
        const { restaurantId, orderId, amount, description } = req.body;

        if (!restaurantId || !orderId || !amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu restaurantId / orderId / amount hợp lệ',
            });
        }

        await walletService.credit(
            restaurantId,
            orderId,
            parseFloat(amount),
            description || `Đơn #${orderId} hoàn tất – khách đã thanh toán`,
        );

        res.json({
            success: true,
            message: 'Cộng tiền vào ví nhà hàng thành công',
            data: { restaurantId, orderId, amount: parseFloat(amount) },
        });
    } catch (error) {
        logger.error('INTERNAL CREDIT WALLET FAILED:', {
            body: req.body,
            error: error.message,
        });
        res.status(500).json({ success: false, message: 'Cộng tiền thất bại', error: error.message });
    }
});

export default router;
