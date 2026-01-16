import Order from '../models/Order.js';
import logger from '../utils/logger.js';
import axios from 'axios';

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
                        _id: {
                            merchantId: '$merchantId',
                            restaurantId: '$restaurantId',
                        },
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
            ]);

            // Fetch merchantId from restaurant-service for orders without merchantId
            const enrichedStats = await Promise.all(
                merchantStats.map(async (stat) => {
                    let merchantId = stat._id.merchantId;
                    const restaurantId = stat._id.restaurantId;

                    // If merchantId is null, fetch from restaurant-service
                    if (!merchantId && restaurantId) {
                        try {
                            const response = await axios.get(
                                `http://restaurant-service:8081/api/restaurants/${restaurantId}`
                            );
                            merchantId = response.data?.merchantId || restaurantId;
                        } catch (error) {
                            logger.warn(
                                `Could not fetch merchantId for restaurant ${restaurantId}:`,
                                error.message
                            );
                            // Fallback to restaurantId if fetch fails
                            merchantId = restaurantId;
                        }
                    }

                    return {
                        merchantId: merchantId || restaurantId,
                        restaurantId: restaurantId,
                        restaurantName: stat.restaurantName,
                        totalOrders: stat.totalOrders,
                        totalRevenue: stat.totalRevenue,
                        averageOrderValue: stat.averageOrderValue,
                        completedOrders: stat.completedOrders,
                        cancelledOrders: stat.cancelledOrders,
                    };
                })
            );

            // Group by merchantId and aggregate stats
            const merchantMap = new Map();
            enrichedStats.forEach((stat) => {
                const existing = merchantMap.get(stat.merchantId);
                if (existing) {
                    existing.totalOrders += stat.totalOrders;
                    existing.totalRevenue += stat.totalRevenue;
                    existing.completedOrders += stat.completedOrders;
                    existing.cancelledOrders += stat.cancelledOrders;
                    existing.averageOrderValue =
                        existing.totalRevenue / existing.totalOrders;
                } else {
                    merchantMap.set(stat.merchantId, { ...stat });
                }
            });

            // Convert map to array and sort by revenue
            const result = Array.from(merchantMap.values())
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .map((m) => ({
                    merchantId: m.merchantId,
                    restaurantId: m.restaurantId,
                    restaurantName: m.restaurantName,
                    totalOrders: m.totalOrders,
                    totalRevenue: m.totalRevenue,
                    averageOrderValue: m.averageOrderValue,
                    completedOrders: m.completedOrders,
                    cancelledOrders: m.cancelledOrders,
                    completionRate:
                        m.totalOrders > 0
                            ? ((m.completedOrders / m.totalOrders) * 100).toFixed(2)
                            : 0,
                }));

            return result;
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
                        _id: {
                            merchantId: '$merchantId',
                            restaurantId: '$restaurantId',
                        },
                        totalRevenue: { $sum: '$finalAmount' },
                        totalOrders: { $sum: 1 },
                        completedOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
                        },
                        cancelledOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
                        },
                        averageOrderValue: { $avg: '$finalAmount' },
                        // Calculate average rating (only for orders with ratings)
                        totalRatings: {
                            $sum: { $cond: [{ $ne: ['$rating', null] }, 1, 0] },
                        },
                        sumRatings: {
                            $sum: { $cond: [{ $ne: ['$rating', null] }, '$rating', 0] },
                        },
                        // Track unique users for repeat order rate
                        uniqueUsers: { $addToSet: '$userId' },
                    },
                },
            ]);

            // Fetch merchantId from restaurant-service for orders without merchantId
            const enrichedMerchants = await Promise.all(
                topMerchants.map(async (merchant) => {
                    let merchantId = merchant._id.merchantId;
                    const restaurantId = merchant._id.restaurantId;

                    // If merchantId is null, fetch from restaurant-service
                    if (!merchantId && restaurantId) {
                        try {
                            const response = await axios.get(
                                `http://restaurant-service:8081/api/restaurants/${restaurantId}`
                            );
                            merchantId = response.data?.merchantId || restaurantId;
                        } catch (error) {
                            logger.warn(
                                `Could not fetch merchantId for restaurant ${restaurantId}:`,
                                error.message
                            );
                            merchantId = restaurantId;
                        }
                    }

                    return {
                        merchantId: merchantId || restaurantId,
                        totalRevenue: merchant.totalRevenue,
                        totalOrders: merchant.totalOrders,
                        completedOrders: merchant.completedOrders,
                        cancelledOrders: merchant.cancelledOrders,
                        averageOrderValue: merchant.averageOrderValue,
                        totalRatings: merchant.totalRatings,
                        sumRatings: merchant.sumRatings,
                        uniqueUsers: merchant.uniqueUsers,
                    };
                })
            );

            // Group by merchantId and aggregate stats
            const merchantMap = new Map();
            enrichedMerchants.forEach((merchant) => {
                const existing = merchantMap.get(merchant.merchantId);
                if (existing) {
                    existing.totalOrders += merchant.totalOrders;
                    existing.totalRevenue += merchant.totalRevenue;
                    existing.completedOrders += merchant.completedOrders;
                    existing.cancelledOrders += merchant.cancelledOrders;
                    existing.totalRatings += merchant.totalRatings;
                    existing.sumRatings += merchant.sumRatings;
                    existing.averageOrderValue =
                        existing.totalRevenue / existing.totalOrders;
                    // Merge unique users
                    merchant.uniqueUsers.forEach((userId) => {
                        if (!existing.uniqueUsers.includes(userId)) {
                            existing.uniqueUsers.push(userId);
                        }
                    });
                } else {
                    merchantMap.set(merchant.merchantId, { ...merchant });
                }
            });

            // Calculate performance metrics and score
            const merchantsWithScore = Array.from(merchantMap.values()).map((m) => {
                // 1. Success Rate (0-100)
                const successRate =
                    m.totalOrders > 0 ? (m.completedOrders / m.totalOrders) * 100 : 0;

                // 2. Average Rating (0-5)
                const averageRating =
                    m.totalRatings > 0 ? m.sumRatings / m.totalRatings : 0;

                // 3. Repeat Order Rate (0-100)
                const repeatOrderRate =
                    m.uniqueUsers.length > 0
                        ? ((m.totalOrders - m.uniqueUsers.length) / m.totalOrders) * 100
                        : 0;

                // 4. Normalize revenue (0-100) - will be normalized against max revenue
                const revenueScore = m.totalRevenue;

                return {
                    merchantId: m.merchantId,
                    totalRevenue: m.totalRevenue,
                    totalOrders: m.totalOrders,
                    completedOrders: m.completedOrders,
                    cancelledOrders: m.cancelledOrders,
                    averageOrderValue: m.averageOrderValue,
                    successRate: parseFloat(successRate.toFixed(2)),
                    averageRating: parseFloat(averageRating.toFixed(2)),
                    repeatOrderRate: parseFloat(repeatOrderRate.toFixed(2)),
                    totalRatings: m.totalRatings,
                    revenueScore,
                };
            });

            // Find max revenue for normalization
            const maxRevenue = Math.max(
                ...merchantsWithScore.map((m) => m.totalRevenue),
                1
            );

            // Calculate final performance score
            const merchantsWithFinalScore = merchantsWithScore.map((m) => {
                const normalizedRevenue = (m.totalRevenue / maxRevenue) * 100;

                // Performance Score Formula:
                // 30% Success Rate + 25% Average Rating (scaled to 100) + 20% Revenue + 25% Repeat Order Rate
                const performanceScore =
                    m.successRate * 0.3 +
                    (m.averageRating / 5) * 100 * 0.25 +
                    normalizedRevenue * 0.2 +
                    m.repeatOrderRate * 0.25;

                return {
                    ...m,
                    performanceScore: parseFloat(performanceScore.toFixed(2)),
                };
            });

            // Sort by performance score and apply limit
            return merchantsWithFinalScore
                .sort((a, b) => b.performanceScore - a.performanceScore)
                .slice(0, limit)
                .map((m, index) => ({
                    rank: index + 1,
                    merchantId: m.merchantId,
                    performanceScore: m.performanceScore,
                    totalRevenue: m.totalRevenue,
                    totalOrders: m.totalOrders,
                    completedOrders: m.completedOrders,
                    successRate: m.successRate,
                    averageRating: m.averageRating,
                    totalRatings: m.totalRatings,
                    repeatOrderRate: m.repeatOrderRate,
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
                        _id: {
                            merchantId: '$merchantId',
                            restaurantId: '$restaurantId',
                        },
                        totalRevenue: { $sum: '$finalAmount' },
                        totalOrders: { $sum: 1 },
                        totalProductAmount: { $sum: '$totalAmount' },
                        totalDeliveryFee: { $sum: '$deliveryFee' },
                        totalTax: { $sum: '$tax' },
                        totalDiscount: { $sum: '$discount' },
                    },
                },
            ]);

            // Fetch merchantId from restaurant-service for orders without merchantId
            const enrichedRevenue = await Promise.all(
                revenueByMerchant.map(async (rev) => {
                    let merchantId = rev._id.merchantId;
                    const restaurantId = rev._id.restaurantId;

                    // If merchantId is null, fetch from restaurant-service
                    if (!merchantId && restaurantId) {
                        try {
                            const response = await axios.get(
                                `http://restaurant-service:8081/api/restaurants/${restaurantId}`
                            );
                            merchantId = response.data?.merchantId || restaurantId;
                        } catch (error) {
                            logger.warn(
                                `Could not fetch merchantId for restaurant ${restaurantId}:`,
                                error.message
                            );
                            merchantId = restaurantId;
                        }
                    }

                    return {
                        merchantId: merchantId || restaurantId,
                        totalRevenue: rev.totalRevenue,
                        totalOrders: rev.totalOrders,
                        totalProductAmount: rev.totalProductAmount,
                        totalDeliveryFee: rev.totalDeliveryFee,
                        totalTax: rev.totalTax,
                        totalDiscount: rev.totalDiscount,
                    };
                })
            );

            // Group by merchantId and aggregate stats
            const merchantMap = new Map();
            enrichedRevenue.forEach((rev) => {
                const existing = merchantMap.get(rev.merchantId);
                if (existing) {
                    existing.totalOrders += rev.totalOrders;
                    existing.totalRevenue += rev.totalRevenue;
                    existing.totalProductAmount += rev.totalProductAmount;
                    existing.totalDeliveryFee += rev.totalDeliveryFee;
                    existing.totalTax += rev.totalTax;
                    existing.totalDiscount += rev.totalDiscount;
                } else {
                    merchantMap.set(rev.merchantId, { ...rev });
                }
            });

            // Convert map to array and sort by revenue
            return Array.from(merchantMap.values())
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .map((r) => ({
                    merchantId: r.merchantId,
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
