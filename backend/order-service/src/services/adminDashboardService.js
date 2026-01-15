import Order from '../models/Order.js';
import logger from '../utils/logger.js';

class AdminDashboardService {
    /**
     * Get system-wide overview statistics
     */
    async getSystemOverview(startDate = null, endDate = null) {
        try {
            const dateFilter = this._buildDateFilter(startDate, endDate);

            // Get total orders and revenue
            const orderStats = await Order.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$finalAmount' },
                        averageOrderValue: { $avg: '$finalAmount' },
                        completedOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
                        },
                        cancelledOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
                        },
                    },
                },
            ]);

            // Count unique merchants
            const uniqueMerchants = await Order.distinct('merchantId', dateFilter);

            // Count unique restaurants
            const uniqueRestaurants = await Order.distinct('restaurantId', dateFilter);

            // Count unique users
            const uniqueUsers = await Order.distinct('userId', dateFilter);

            const stats = orderStats[0] || {
                totalOrders: 0,
                totalRevenue: 0,
                averageOrderValue: 0,
                completedOrders: 0,
                cancelledOrders: 0,
            };

            return {
                ...stats,
                totalMerchants: uniqueMerchants.length,
                totalRestaurants: uniqueRestaurants.length,
                totalUsers: uniqueUsers.length,
                completionRate: stats.totalOrders > 0
                    ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(2)
                    : 0,
            };
        } catch (error) {
            logger.error('Error getting system overview:', error);
            throw new Error('Failed to get system overview');
        }
    }

    /**
     * Get all merchants performance
     */
    async getAllMerchantsPerformance(startDate = null, endDate = null) {
        try {
            const dateFilter = this._buildDateFilter(startDate, endDate);

            const merchantStats = await Order.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: '$merchantId',
                        restaurantId: { $first: '$restaurantId' },
                        restaurantName: { $first: '$restaurantName' },
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$finalAmount' },
                        averageOrderValue: { $avg: '$finalAmount' },
                        completedOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
                        },
                        cancelledOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
                        },
                    },
                },
                { $sort: { totalRevenue: -1 } },
            ]);

            return merchantStats.map((m) => ({
                merchantId: m._id,
                restaurantId: m.restaurantId,
                restaurantName: m.restaurantName,
                totalOrders: m.totalOrders,
                totalRevenue: m.totalRevenue,
                averageOrderValue: m.averageOrderValue,
                completedOrders: m.completedOrders,
                cancelledOrders: m.cancelledOrders,
                completionRate: m.totalOrders > 0
                    ? ((m.completedOrders / m.totalOrders) * 100).toFixed(2)
                    : 0,
            }));
        } catch (error) {
            logger.error('Error getting merchants performance:', error);
            throw new Error('Failed to get merchants performance');
        }
    }

    /**
     * Get total revenue analytics
     */
    async getTotalRevenue(startDate = null, endDate = null) {
        try {
            const dateFilter = this._buildDateFilter(startDate, endDate);

            const revenueStats = await Order.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$finalAmount' },
                        totalProductAmount: { $sum: '$totalAmount' },
                        totalDeliveryFee: { $sum: '$deliveryFee' },
                        totalTax: { $sum: '$tax' },
                        totalDiscount: { $sum: '$discount' },
                        totalOrders: { $sum: 1 },
                    },
                },
            ]);

            if (revenueStats.length === 0) {
                return {
                    totalRevenue: 0,
                    totalProductAmount: 0,
                    totalDeliveryFee: 0,
                    totalTax: 0,
                    totalDiscount: 0,
                    totalOrders: 0,
                    averageOrderValue: 0,
                };
            }

            const stats = revenueStats[0];
            return {
                totalRevenue: stats.totalRevenue,
                totalProductAmount: stats.totalProductAmount,
                totalDeliveryFee: stats.totalDeliveryFee,
                totalTax: stats.totalTax,
                totalDiscount: stats.totalDiscount,
                totalOrders: stats.totalOrders,
                averageOrderValue: stats.totalOrders > 0
                    ? stats.totalRevenue / stats.totalOrders
                    : 0,
            };
        } catch (error) {
            logger.error('Error getting total revenue:', error);
            throw new Error('Failed to get total revenue');
        }
    }

    /**
     * Get order statistics
     */
    async getOrderStatistics(startDate = null, endDate = null) {
        try {
            const dateFilter = this._buildDateFilter(startDate, endDate);

            const statusBreakdown = await Order.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$finalAmount' },
                    },
                },
                { $sort: { count: -1 } },
            ]);

            const paymentStats = await Order.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: '$paymentStatus',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$finalAmount' },
                    },
                },
            ]);

            return {
                statusBreakdown: statusBreakdown.map((s) => ({
                    status: s._id,
                    count: s.count,
                    totalAmount: s.totalAmount,
                })),
                paymentBreakdown: paymentStats.map((p) => ({
                    paymentStatus: p._id,
                    count: p.count,
                    totalAmount: p.totalAmount,
                })),
            };
        } catch (error) {
            logger.error('Error getting order statistics:', error);
            throw new Error('Failed to get order statistics');
        }
    }

    /**
     * Get top performing merchants
     */
    async getTopPerformingMerchants(limit = 10, startDate = null, endDate = null) {
        try {
            const dateFilter = this._buildDateFilter(startDate, endDate);

            const topMerchants = await Order.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: '$merchantId',
                        totalRevenue: { $sum: '$finalAmount' },
                        totalOrders: { $sum: 1 },
                        averageOrderValue: { $avg: '$finalAmount' },
                    },
                },
                { $sort: { totalRevenue: -1 } },
                { $limit: limit },
            ]);

            return topMerchants.map((m, index) => ({
                rank: index + 1,
                merchantId: m._id,
                totalRevenue: m.totalRevenue,
                totalOrders: m.totalOrders,
                averageOrderValue: m.averageOrderValue,
            }));
        } catch (error) {
            logger.error('Error getting top merchants:', error);
            throw new Error('Failed to get top merchants');
        }
    }

    /**
     * Get platform trends (daily aggregation)
     */
    async getPlatformTrends(startDate = null, endDate = null) {
        try {
            const dateFilter = this._buildDateFilter(startDate, endDate);

            const trends = await Order.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                            day: { $dayOfMonth: '$createdAt' },
                        },
                        date: { $first: '$createdAt' },
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$finalAmount' },
                        uniqueMerchants: { $addToSet: '$merchantId' },
                        uniqueUsers: { $addToSet: '$userId' },
                    },
                },
                { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
            ]);

            return trends.map((t) => ({
                date: t.date,
                totalOrders: t.totalOrders,
                totalRevenue: t.totalRevenue,
                activeMerchants: t.uniqueMerchants.length,
                activeUsers: t.uniqueUsers.length,
            }));
        } catch (error) {
            logger.error('Error getting platform trends:', error);
            throw new Error('Failed to get platform trends');
        }
    }

    /**
     * Get revenue by merchant
     */
    async getRevenueByMerchant(startDate = null, endDate = null) {
        try {
            const dateFilter = this._buildDateFilter(startDate, endDate);

            const revenueByMerchant = await Order.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: '$merchantId',
                        totalRevenue: { $sum: '$finalAmount' },
                        totalOrders: { $sum: 1 },
                        totalProductAmount: { $sum: '$totalAmount' },
                        totalDeliveryFee: { $sum: '$deliveryFee' },
                        totalTax: { $sum: '$tax' },
                        totalDiscount: { $sum: '$discount' },
                    },
                },
                { $sort: { totalRevenue: -1 } },
            ]);

            return revenueByMerchant.map((r) => ({
                merchantId: r._id,
                totalRevenue: r.totalRevenue,
                totalOrders: r.totalOrders,
                totalProductAmount: r.totalProductAmount,
                totalDeliveryFee: r.totalDeliveryFee,
                totalTax: r.totalTax,
                totalDiscount: r.totalDiscount,
                averageOrderValue: r.totalOrders > 0 ? r.totalRevenue / r.totalOrders : 0,
            }));
        } catch (error) {
            logger.error('Error getting revenue by merchant:', error);
            throw new Error('Failed to get revenue by merchant');
        }
    }

    /**
     * Build date filter for queries
     */
    _buildDateFilter(startDate, endDate) {
        const filter = {};
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) {
                filter.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.createdAt.$lte = new Date(endDate);
            }
        }
        return filter;
    }
}

export default new AdminDashboardService();
