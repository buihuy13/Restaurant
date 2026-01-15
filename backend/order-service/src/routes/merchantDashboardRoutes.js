import express from 'express';
import merchantDashboardController from '../controllers/merchantDashboardController.js';

const router = express.Router();

// Merchant dashboard routes
router.get('/:merchantId/dashboard/overview', merchantDashboardController.getOverview);
router.get('/:merchantId/dashboard/revenue', merchantDashboardController.getRevenue);
router.get('/:merchantId/dashboard/orders/status', merchantDashboardController.getOrderStatus);
router.get('/:merchantId/dashboard/products/top', merchantDashboardController.getTopProducts);
router.get('/:merchantId/dashboard/revenue/trend', merchantDashboardController.getRevenueTrend);
router.get('/:merchantId/dashboard/ratings', merchantDashboardController.getRatingStatistics);
router.get('/:merchantId/dashboard/hourly', merchantDashboardController.getHourlyStatistics);
router.get('/:merchantId/dashboard/time-analytics', merchantDashboardController.getTimeBasedAnalytics);

export default router;
