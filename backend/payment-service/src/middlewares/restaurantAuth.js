import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import restaurantService from '../services/restaurantService.js';

export const restaurantAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Access token required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Quan trọng: kiểm tra xem user này có phải nhà hàng không
        if (decoded.role !== 'MERCHANT') {
            return res.status(403).json({ success: false, message: 'Chỉ merchant nhà hàng mới được truy cập ví' });
        }

        // FIX: Resolve restaurantId from merchantId if missing in token
        let restaurantId = decoded.restaurantId;
        if (!restaurantId && decoded.id) {
            logger.info(`Extracting restaurantId for merchant: ${decoded.id}`);
            restaurantId = await restaurantService.findResIdByMerchantId(decoded.id);
        }

        // Gắn thông tin vào req để dùng trong controller
        req.user = {
            id: decoded.id,
            restaurantId: restaurantId || decoded.id, // Fallback to id if still not found
            role: decoded.role,
        };

        next();
    } catch (error) {
        logger.error('restaurantAuth error:', error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token đã hết hạn' });
        }
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};
