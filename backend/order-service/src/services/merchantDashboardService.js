import Order from '../models/Order.js';
import logger from '../utils/logger.js';

class MerchantDashboardService {
    /**
     * Get overall order statistics for a merchant
     */
    async getMerchantOverview(merchantId, startDate = null, endDate = null) {
        try {
            const dateFilter = this._buildDateFilter(startDate, endDate);
            const matchStage = { merchantId, ...dateFilter };

            const stats = await Order.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$finalAmount' },
                        averageOrderValue: { $avg: '$finalAmount' },
                        pendingOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
                        },
                        confirmedOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] },
                        },
                        preparingOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'preparing'] }, 1, 0] },
                        },
                        readyOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'ready'] }, 1, 0] },
                        },
                        completedOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
                        },
                        cancelledOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
                        },
                    },
                },
            ]);

            if (stats.length === 0) {
                return {
                    totalOrders: 0,
                    totalRevenue: 0,
                    averageOrderValue: 0,
                    pendingOrders: 0,
                    confirmedOrders: 0,
                    preparingOrders: 0,
                    readyOrders: 0,
                    completedOrders: 0,
                    cancelledOrders: 0,
                };
            }

            const result = stats[0];
            delete result._id;
            return result;
        } catch (error) {
            logger.error('Error getting merchant overview:', error);
            throw new Error('Failed to get merchant overview');
        }
    }

    /**
     * Get revenue analytics with breakdown by restaurant
     */
    async getRevenueAnalytics(merchantId, startDate = null, endDate = null) {
        try {
            const dateFilter = this._buildDateFilter(startDate, endDate);
            const matchStage = { merchantId, ...dateFilter };

            const revenueByRestaurant = await Order.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: '$restaurantId',
                        restaurantName: { $first: '$restaurantName' },
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$finalAmount' },
                        totalProductAmount: { $sum: '$totalAmount' },
                        totalDeliveryFee: { $sum: '$deliveryFee' },
                        totalTax: { $sum: '$tax' },
                        totalDiscount: { $sum: '$discount' },
                        averageOrderValue: { $avg: '$finalAmount' },
                    },
                },
                { $sort: { totalRevenue: -1 } },
            ]);

            const totalRevenue = revenueByRestaurant.reduce((sum, r) => sum + r.totalRevenue, 0);
            const totalOrders = revenueByRestaurant.reduce((sum, r) => sum + r.totalOrders, 0);

            return {
                totalRevenue,
                totalOrders,
                averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
                revenueByRestaurant: revenueByRestaurant.map((r) => ({
                    restaurantId: r._id,
                    restaurantName: r.restaurantName,
                    totalOrders: r.totalOrders,
                    totalRevenue: r.totalRevenue,
                    totalProductAmount: r.totalProductAmount,
                    totalDeliveryFee: r.totalDeliveryFee,
                    totalTax: r.totalTax,
                    totalDiscount: r.totalDiscount,
                    averageOrderValue: r.averageOrderValue,
                })),
            };
        } catch (error) {
            logger.error('Error getting revenue analytics:', error);
            throw new Error('Failed to get revenue analytics');
        }
    }

    /**
     * Get order status breakdown
     */
    async getOrderStatusBreakdown(merchantId, startDate = null, endDate = null) {
        try {
            const dateFilter = this._buildDateFilter(startDate, endDate);
            const matchStage = { merchantId, ...dateFilter };

            const statusBreakdown = await Order.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$finalAmount' },
                    },
                },
                { $sort: { count: -1 } },
            ]);

            return statusBreakdown.map((s) => ({
                status: s._id,
                count: s.count,
                totalAmount: s.totalAmount,
            }));
        } catch (error) {
            logger.error('Error getting order status breakdown:', error);
            throw new Error('Failed to get order status breakdown');
        }
    }

    /**
     * Get top-selling products
     */
    async getTopProducts(merchantId, limit = 10, startDate = null, endDate = null) {
        try {
            const dateFilter = this._buildDateFilter(startDate, endDate);
            const matchStage = { merchantId, ...dateFilter };

            const topProducts = await Order.aggregate([
                { $match: matchStage },
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.productId',
                        productName: { $first: '$items.productName' },
                        imageURL: { $first: '$items.imageURL' },
                        totalQuantity: { $sum: '$items.quantity' },
                        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                        orderCount: { $sum: 1 },
                    },
                },
                { $sort: { totalQuantity: -1 } },
                { $limit: limit },
            ]);

            return topProducts.map((p) => ({
                productId: p._id,
                productName: p.productName,
                imageURL: p.imageURL,
                totalQuantity: p.totalQuantity,
                totalRevenue: p.totalRevenue,
                orderCount: p.orderCount,
            }));
        } catch (error) {
            logger.error('Error getting top products:', error);
            throw new Error('Failed to get top products');
        }
    }

    /**
     * Get revenue trend over time (daily aggregation)
     */
    async getRevenueTrend(merchantId, startDate = null, endDate = null) {
        try {
            const dateFilter = this._buildDateFilter(startDate, endDate);
            const matchStage = { merchantId, ...dateFilter };

            const revenueTrend = await Order.aggregate([
                { $match: matchStage },
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
                    },
                },
                { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
            ]);

            return revenueTrend.map((t) => ({
                date: t.date,
                totalOrders: t.totalOrders,
                totalRevenue: t.totalRevenue,
            }));
        } catch (error) {
            logger.error('Error getting revenue trend:', error);
            throw new Error('Failed to get revenue trend');
        }
    }

    /**
     * Get rating statistics
     */
    async getRatingStatistics(merchantId, startDate = null, endDate = null) {
        try {
            const dateFilter = this._buildDateFilter(startDate, endDate);
            const matchStage = {
                merchantId,
                rating: { $exists: true, $ne: null },
                ...dateFilter
            };

            const ratingStats = await Order.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: null,
                        totalRatings: { $sum: 1 },
                        averageRating: { $avg: '$rating' },
                        rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
                        rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
                        rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
                        rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
                        rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
                    },
                },
            ]);

            if (ratingStats.length === 0) {
                return {
                    totalRatings: 0,
                    averageRating: 0,
                    ratingDistribution: {
                        5: 0,
                        4: 0,
                        3: 0,
                        2: 0,
                        1: 0,
                    },
                };
            }

            const stats = ratingStats[0];
            return {
                totalRatings: stats.totalRatings,
                averageRating: Math.round(stats.averageRating * 10) / 10,
                ratingDistribution: {
                    5: stats.rating5,
                    4: stats.rating4,
                    3: stats.rating3,
                    2: stats.rating2,
                    1: stats.rating1,
                },
            };
        } catch (error) {
            logger.error('Error getting rating statistics:', error);
            throw new Error('Failed to get rating statistics');
        }
    }

    /**
     * Get hourly order statistics
     */
    async getHourlyStatistics(merchantId, startDate = null, endDate = null) {
        try {
            const dateFilter = this._buildDateFilter(startDate, endDate);
            const matchStage = { merchantId, ...dateFilter };

            const hourlyStats = await Order.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: { $hour: '$createdAt' },
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$finalAmount' },
                        averageOrderValue: { $avg: '$finalAmount' },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            // Fill in missing hours with 0
            const hourlyData = Array.from({ length: 24 }, (_, hour) => {
                const found = hourlyStats.find((s) => s._id === hour);
                return {
                    hour,
                    totalOrders: found ? found.totalOrders : 0,
                    totalRevenue: found ? found.totalRevenue : 0,
                    averageOrderValue: found ? found.averageOrderValue : 0,
                };
            });

            return hourlyData;
        } catch (error) {
            logger.error('Error getting hourly statistics:', error);
            throw new Error('Failed to get hourly statistics');
        }
    }

    /**
     * Get time-based analytics (peak hours, busiest days)
     */
    async getTimeBasedAnalytics(merchantId, startDate = null, endDate = null) {
        try {
            const dateFilter = this._buildDateFilter(startDate, endDate);
            const matchStage = { merchantId, ...dateFilter };

            // Get day of week statistics
            const dayOfWeekStats = await Order.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: { $dayOfWeek: '$createdAt' },
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$finalAmount' },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const weekdayData = dayOfWeekStats.map((d) => ({
                dayOfWeek: d._id,
                dayName: dayNames[d._id - 1],
                totalOrders: d.totalOrders,
                totalRevenue: d.totalRevenue,
            }));

            // Find peak hour
            const hourlyStats = await this.getHourlyStatistics(merchantId, startDate, endDate);
            const peakHour = hourlyStats.reduce((max, curr) =>
                curr.totalOrders > max.totalOrders ? curr : max
            );

            // Find busiest day
            const busiestDay = weekdayData.reduce((max, curr) =>
                curr.totalOrders > max.totalOrders ? curr : max
                , { totalOrders: 0 });

            return {
                weekdayStatistics: weekdayData,
                peakHour: {
                    hour: peakHour.hour,
                    totalOrders: peakHour.totalOrders,
                    totalRevenue: peakHour.totalRevenue,
                },
                busiestDay: {
                    dayName: busiestDay.dayName || 'N/A',
                    totalOrders: busiestDay.totalOrders,
                    totalRevenue: busiestDay.totalRevenue || 0,
                },
            };
        } catch (error) {
            logger.error('Error getting time-based analytics:', error);
            throw new Error('Failed to get time-based analytics');
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

export default new MerchantDashboardService();
