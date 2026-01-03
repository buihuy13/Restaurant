import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Access token required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');

        // Chỉ admin mới được vào (kiểm tra role)
        if (decoded.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Admin access only' });
        }

        req.admin = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        logger.error('adminAuth error:', error.message);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};
