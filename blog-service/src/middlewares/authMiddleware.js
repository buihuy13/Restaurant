import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export const authenticate = (req, res, next) => {
    try {
        // 1. Lấy token từ header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }

        const token = authHeader.split(' ')[1];

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Gắn user vào request (KHÔNG lấy từ body)
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
            email: decoded.email,
        };

        next();
    } catch (error) {
        logger.warn('JWT authentication failed', {
            message: error.message,
        });

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};
