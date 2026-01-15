import merchantDashboardService from '../services/merchantDashboardService.js';
import logger from '../utils/logger.js';

class MerchantDashboardController {
    /**
     * Get merchant overview statistics
     * GET /api/merchant/:merchantId/dashboard/overview
     */
    async getOverview(req, res) {
        try {
            const { merchantId } = req.params;
            const { startDate, endDate } = req.query;

            // Verify user is the merchant (authentication middleware should set req.user)
            const requestUserId = req.user?.id || req.query?.merchantId;
            if (requestUserId && requestUserId !== merchantId) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this dashboard',
                });
            }

            const overview = await merchantDashboardService.getMerchantOverview(
                merchantId,
                startDate,
                endDate,
            );

            return res.status(200).json({
                success: true,
                data: overview,
            });
        } catch (error) {
            logger.error('Get merchant overview error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get revenue analytics
     * GET /api/merchant/:merchantId/dashboard/revenue
     */
    async getRevenue(req, res) {
        try {
            const { merchantId } = req.params;
            const { startDate, endDate } = req.query;

            const requestUserId = req.user?.id || req.query?.merchantId;
            if (requestUserId && requestUserId !== merchantId) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this dashboard',
                });
            }

            const revenue = await merchantDashboardService.getRevenueAnalytics(
                merchantId,
                startDate,
                endDate,
            );

            return res.status(200).json({
                success: true,
                data: revenue,
            });
        } catch (error) {
            logger.error('Get revenue analytics error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get order status breakdown
     * GET /api/merchant/:merchantId/dashboard/orders/status
     */
    async getOrderStatus(req, res) {
        try {
            const { merchantId } = req.params;
            const { startDate, endDate } = req.query;

            const requestUserId = req.user?.id || req.query?.merchantId;
            if (requestUserId && requestUserId !== merchantId) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this dashboard',
                });
            }

            const statusBreakdown = await merchantDashboardService.getOrderStatusBreakdown(
                merchantId,
                startDate,
                endDate,
            );

            return res.status(200).json({
                success: true,
                data: statusBreakdown,
            });
        } catch (error) {
            logger.error('Get order status breakdown error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get top-selling products
     * GET /api/merchant/:merchantId/dashboard/products/top
     */
    async getTopProducts(req, res) {
        try {
            const { merchantId } = req.params;
            const { limit = 10, startDate, endDate } = req.query;

            const requestUserId = req.user?.id || req.query?.merchantId;
            if (requestUserId && requestUserId !== merchantId) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this dashboard',
                });
            }

            const topProducts = await merchantDashboardService.getTopProducts(
                merchantId,
                parseInt(limit),
                startDate,
                endDate,
            );

            return res.status(200).json({
                success: true,
                data: topProducts,
            });
        } catch (error) {
            logger.error('Get top products error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get revenue trend over time
     * GET /api/merchant/:merchantId/dashboard/revenue/trend
     */
    async getRevenueTrend(req, res) {
        try {
            const { merchantId } = req.params;
            const { startDate, endDate } = req.query;

            const requestUserId = req.user?.id || req.query?.merchantId;
            if (requestUserId && requestUserId !== merchantId) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this dashboard',
                });
            }

            const trend = await merchantDashboardService.getRevenueTrend(
                merchantId,
                startDate,
                endDate,
            );

            return res.status(200).json({
                success: true,
                data: trend,
            });
        } catch (error) {
            logger.error('Get revenue trend error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get rating statistics
     * GET /api/merchant/:merchantId/dashboard/ratings
     */
    async getRatingStatistics(req, res) {
        try {
            const { merchantId } = req.params;
            const { startDate, endDate } = req.query;

            const requestUserId = req.user?.id || req.query?.merchantId;
            if (requestUserId && requestUserId !== merchantId) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this dashboard',
                });
            }

            const ratings = await merchantDashboardService.getRatingStatistics(
                merchantId,
                startDate,
                endDate,
            );

            return res.status(200).json({
                success: true,
                data: ratings,
            });
        } catch (error) {
            logger.error('Get rating statistics error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get hourly order statistics
     * GET /api/merchant/:merchantId/dashboard/hourly
     */
    async getHourlyStatistics(req, res) {
        try {
            const { merchantId } = req.params;
            const { startDate, endDate } = req.query;

            const requestUserId = req.user?.id || req.query?.merchantId;
            if (requestUserId && requestUserId !== merchantId) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this dashboard',
                });
            }

            const hourlyStats = await merchantDashboardService.getHourlyStatistics(
                merchantId,
                startDate,
                endDate,
            );

            return res.status(200).json({
                success: true,
                data: hourlyStats,
            });
        } catch (error) {
            logger.error('Get hourly statistics error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get time-based analytics (peak hours, busiest days)
     * GET /api/merchant/:merchantId/dashboard/time-analytics
     */
    async getTimeBasedAnalytics(req, res) {
        try {
            const { merchantId } = req.params;
            const { startDate, endDate } = req.query;

            const requestUserId = req.user?.id || req.query?.merchantId;
            if (requestUserId && requestUserId !== merchantId) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this dashboard',
                });
            }

            const analytics = await merchantDashboardService.getTimeBasedAnalytics(
                merchantId,
                startDate,
                endDate,
            );

            return res.status(200).json({
                success: true,
                data: analytics,
            });
        } catch (error) {
            logger.error('Get time-based analytics error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

export default new MerchantDashboardController();
