import adminDashboardService from '../services/adminDashboardService.js';
import logger from '../utils/logger.js';

class AdminDashboardController {
    /**
     * Get system overview
     * GET /api/admin/dashboard/overview
     */
    async getSystemOverview(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const overview = await adminDashboardService.getSystemOverview(startDate, endDate);

            return res.status(200).json({
                success: true,
                data: overview,
            });
        } catch (error) {
            logger.error('Get system overview error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get all merchants performance
     * GET /api/admin/dashboard/merchants
     */
    async getAllMerchantsPerformance(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const merchants = await adminDashboardService.getAllMerchantsPerformance(
                startDate,
                endDate
            );

            return res.status(200).json({
                success: true,
                data: merchants,
            });
        } catch (error) {
            logger.error('Get merchants performance error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get total revenue
     * GET /api/admin/dashboard/revenue
     */
    async getTotalRevenue(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const revenue = await adminDashboardService.getTotalRevenue(startDate, endDate);

            return res.status(200).json({
                success: true,
                data: revenue,
            });
        } catch (error) {
            logger.error('Get total revenue error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get order statistics
     * GET /api/admin/dashboard/orders
     */
    async getOrderStatistics(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const orders = await adminDashboardService.getOrderStatistics(startDate, endDate);

            return res.status(200).json({
                success: true,
                data: orders,
            });
        } catch (error) {
            logger.error('Get order statistics error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get top performing merchants
     * GET /api/admin/dashboard/merchants/top
     */
    async getTopPerformingMerchants(req, res) {
        try {
            const { limit = 10, startDate, endDate } = req.query;

            const topMerchants = await adminDashboardService.getTopPerformingMerchants(
                parseInt(limit),
                startDate,
                endDate
            );

            return res.status(200).json({
                success: true,
                data: topMerchants,
            });
        } catch (error) {
            logger.error('Get top merchants error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get platform trends
     * GET /api/admin/dashboard/trends
     */
    async getPlatformTrends(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const trends = await adminDashboardService.getPlatformTrends(startDate, endDate);

            return res.status(200).json({
                success: true,
                data: trends,
            });
        } catch (error) {
            logger.error('Get platform trends error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get revenue by merchant
     * GET /api/admin/dashboard/revenue/by-merchant
     */
    async getRevenueByMerchant(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const revenue = await adminDashboardService.getRevenueByMerchant(
                startDate,
                endDate
            );

            return res.status(200).json({
                success: true,
                data: revenue,
            });
        } catch (error) {
            logger.error('Get revenue by merchant error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

export default new AdminDashboardController();
