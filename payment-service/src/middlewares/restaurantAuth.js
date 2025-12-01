import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

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

        // Gắn restaurantId vào req để dùng trong controller
        req.user = {
            id: decoded.id,
            restaurantId: decoded.restaurantId || decoded.id, // tùy bạn lưu kiểu gì trong token
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
