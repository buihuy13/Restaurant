import groupOrderService from '../services/groupOrderService.js';
import logger from '../utils/logger.js';

class GroupOrderController {
    // Tạo group order mới
    async createGroupOrder(req, res, next) {
        try {
            const userId = req.user?.userId || req.user?.id;
            const userName = req.user?.username || req.user?.name || 'Anonymous';

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required',
                });
            }

            const groupOrder = await groupOrderService.createGroupOrder(req.body, userId, userName);

            const shareLink = groupOrderService.getShareLink(groupOrder);

            res.status(201).json({
                success: true,
                message: 'Group order created successfully',
                data: {
                    ...groupOrder.toObject(),
                    shareLink,
                },
            });
        } catch (error) {
            logger.error('Create group order controller error:', error);
            next(error);
        }
    }

    // Lấy thông tin group order bằng token
    async getGroupOrderByToken(req, res, next) {
        try {
            const { shareToken } = req.params;
            const groupOrder = await groupOrderService.getGroupOrderByToken(shareToken);

            const shareLink = groupOrderService.getShareLink(groupOrder);

            res.status(200).json({
                success: true,
                data: {
                    ...groupOrder.toObject(),
                    shareLink,
                },
            });
        } catch (error) {
            logger.error('Get group order controller error:', error);

            if (error.message.includes('not found') || error.message.includes('expired')) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }

            next(error);
        }
    }

    // Tham gia group order
    async joinGroupOrder(req, res, next) {
        try {
            const { shareToken } = req.params;
            const { items } = req.body;
            const userId = req.user?.userId || req.user?.id;
            const userName = req.user?.username || req.user?.name || 'Anonymous';

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required',
                });
            }

            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Items are required',
                });
            }

            const groupOrder = await groupOrderService.joinGroupOrder(shareToken, userId, userName, items);

            res.status(200).json({
                success: true,
                message: 'Joined group order successfully',
                data: groupOrder,
            });
        } catch (error) {
            logger.error('Join group order controller error:', error);

            if (error.message.includes('not accepting') || error.message.includes('not found')) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }

            next(error);
        }
    }

    // Xóa participant
    async removeParticipant(req, res, next) {
        try {
            const { shareToken, userId } = req.params;
            const requesterId = req.user?.userId || req.user?.id;

            if (!requesterId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required',
                });
            }

            const groupOrder = await groupOrderService.removeParticipant(shareToken, userId, requesterId);

            res.status(200).json({
                success: true,
                message: 'Participant removed successfully',
                data: groupOrder,
            });
        } catch (error) {
            logger.error('Remove participant controller error:', error);

            if (error.message.includes('Unauthorized')) {
                return res.status(403).json({
                    success: false,
                    message: error.message,
                });
            }

            next(error);
        }
    }

    // Khóa group order
    async lockGroupOrder(req, res, next) {
        try {
            const { shareToken } = req.params;
            const userId = req.user?.userId || req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required',
                });
            }

            const groupOrder = await groupOrderService.lockGroupOrder(shareToken, userId);

            res.status(200).json({
                success: true,
                message: 'Group order locked successfully',
                data: groupOrder,
            });
        } catch (error) {
            logger.error('Lock group order controller error:', error);

            if (error.message.includes('Only creator')) {
                return res.status(403).json({
                    success: false,
                    message: error.message,
                });
            }

            next(error);
        }
    }

    // Confirm group order
    async confirmGroupOrder(req, res, next) {
        try {
            const { shareToken } = req.params;
            const userId = req.user?.userId || req.user?.id;
            const token = req.headers.authorization?.split(' ')[1];

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required',
                });
            }

            const result = await groupOrderService.confirmGroupOrder(shareToken, userId, token);

            res.status(200).json({
                success: true,
                message: 'Group order confirmed and order created successfully',
                data: result,
            });
        } catch (error) {
            logger.error('Confirm group order controller error:', error);

            if (error.message.includes('Only creator')) {
                return res.status(403).json({
                    success: false,
                    message: error.message,
                });
            }

            next(error);
        }
    }

    // Hủy group order
    async cancelGroupOrder(req, res, next) {
        try {
            const { shareToken } = req.params;
            const userId = req.user?.userId || req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required',
                });
            }

            const groupOrder = await groupOrderService.cancelGroupOrder(shareToken, userId);

            res.status(200).json({
                success: true,
                message: 'Group order cancelled successfully',
                data: groupOrder,
            });
        } catch (error) {
            logger.error('Cancel group order controller error:', error);

            if (error.message.includes('Only creator')) {
                return res.status(403).json({
                    success: false,
                    message: error.message,
                });
            }

            next(error);
        }
    }

    // Lấy danh sách group orders của user
    async getUserGroupOrders(req, res, next) {
        try {
            const userId = req.user?.userId || req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required',
                });
            }

            const filters = req.query;
            const result = await groupOrderService.getUserGroupOrders(userId, filters);

            res.status(200).json({
                success: true,
                data: result.groupOrders,
                pagination: result.pagination,
            });
        } catch (error) {
            logger.error('Get user group orders controller error:', error);
            next(error);
        }
    }

    // Thanh toán toàn bộ cho group order
    async payForWholeGroup(req, res, next) {
        try {
            const { shareToken } = req.params;
            const userId = req.user?.userId || req.user?.id;
            const { paymentMethod } = req.body;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required',
                });
            }

            if (!paymentMethod) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment method is required',
                });
            }

            // Only the creator can pay for the whole group (extra guard at controller level)
            const groupOrder = await groupOrderService.getGroupOrderByToken(shareToken);
            if (!groupOrder) {
                return res.status(404).json({ success: false, message: 'Group order not found' });
            }
            if (groupOrder.creatorId !== userId) {
                return res.status(403).json({ success: false, message: 'Only the group creator can pay for the whole group' });
            }

            const result = await groupOrderService.payForWholeGroup(shareToken, userId, { paymentMethod });

            res.status(200).json({
                success: true,
                message: 'Full payment processed successfully',
                data: result,
            });
        } catch (error) {
            logger.error('Pay for whole group controller error:', error);

            if (error.message.includes('fully paid') || error.message.includes('empty')) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }

            next(error);
        }
    }

    // Thanh toán riêng cho participant
    async payForParticipant(req, res, next) {
        try {
            const { shareToken } = req.params;
            const userId = req.user?.userId || req.user?.id;
            const { paymentMethod } = req.body;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required',
                });
            }

            if (!paymentMethod) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment method is required',
                });
            }

            const result = await groupOrderService.payForParticipant(shareToken, userId, { paymentMethod });

            res.status(200).json({
                success: true,
                message: 'Payment processed successfully',
                data: result,
            });
        } catch (error) {
            logger.error('Pay for participant controller error:', error);

            if (
                error.message.includes('not a participant') ||
                error.message.includes('already paid') ||
                error.message.includes('not allowed')
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }

            next(error);
        }
    }

    // Kiểm tra trạng thái thanh toán
    async checkPaymentStatus(req, res, next) {
        try {
            const { shareToken } = req.params;
            const userId = req.user?.userId || req.user?.id;

            if (!userId) {
                return res.status(401).json({ success: false, message: 'User authentication required' });
            }

            // Only the creator can check payment status
            const groupOrder = await groupOrderService.getGroupOrderByToken(shareToken);
            if (!groupOrder) {
                return res.status(404).json({ success: false, message: 'Group order not found' });
            }
            if (groupOrder.creatorId !== userId) {
                return res
                    .status(403)
                    .json({ success: false, message: 'Only the group creator can view payment status' });
            }

            const result = await groupOrderService.checkAllPaid(shareToken);

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            logger.error('Check payment status controller error:', error);
            next(error);
        }
    }
}

export default new GroupOrderController();
