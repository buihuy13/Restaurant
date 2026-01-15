import express from 'express';
import adminDashboardController from '../controllers/adminDashboardController.js';

const router = express.Router();

// Admin dashboard routes
router.get('/dashboard/overview', adminDashboardController.getSystemOverview);
router.get('/dashboard/merchants', adminDashboardController.getAllMerchantsPerformance);
router.get('/dashboard/revenue', adminDashboardController.getTotalRevenue);
router.get('/dashboard/orders', adminDashboardController.getOrderStatistics);
router.get('/dashboard/merchants/top', adminDashboardController.getTopPerformingMerchants);
router.get('/dashboard/trends', adminDashboardController.getPlatformTrends);

export default router;
