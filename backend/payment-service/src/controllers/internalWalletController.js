import walletService from '../../services/walletService.js';
import logger from '../../utils/logger.js';

class InternalWalletController {
    // CỘNG TIỀN KHI ĐƠN HOÀN TẤT + KHÁCH ĐÃ THANH TOÁN
    async credit(req, res) {
        try {
            const { restaurantId, orderId, amount, description } = req.body;

            // Validate nghiêm ngặt
            if (!restaurantId || !orderId) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu restaurantId hoặc orderId',
                });
            }

            if (!amount || amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Amount phải > 0',
                });
            }

            await walletService.credit(
                restaurantId,
                orderId,
                parseFloat(amount),
                description || `Đơn #${orderId} – đã giao thành công`,
            );

            logger.info(
                `[INTERNAL] Cộng ví thành công: +${amount.toLocaleString()}đ → ${restaurantId} (đơn ${orderId})`,
            );

            return res.json({
                success: true,
                message: 'Cộng tiền vào ví nhà hàng thành công',
                data: {
                    restaurantId,
                    orderId,
                    amount: parseFloat(amount),
                    timestamp: new Date().toISOString(),
                },
            });
        } catch (error) {
            logger.error('[INTERNAL] Cộng ví thất bại:', {
                body: req.body,
                error: error.message,
                stack: error.stack,
            });

            return res.status(500).json({
                success: false,
                message: 'Cộng tiền thất bại',
                error: error.message,
            });
        }
    }
}

export default new InternalWalletController();
