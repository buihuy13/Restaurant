import express from 'express';
import adminDashboardController from '../controllers/adminDashboardController.js';

const router = express.Router();

/**
 * @swagger
 * /admin/dashboard/overview:
 *   get:
 *     summary: Get system-wide overview statistics
 *     description: Retrieve comprehensive system statistics including total orders, revenue, merchants, and users
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics period (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics period (YYYY-MM-DD)
 *         example: "2024-12-31"
 *     responses:
 *       200:
 *         description: System overview retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminSystemOverview'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/dashboard/overview', adminDashboardController.getSystemOverview);

/**
 * @swagger
 * /admin/dashboard/merchants:
 *   get:
 *     summary: Get all merchants performance metrics
 *     description: Retrieve performance statistics for all merchants in the system
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics period
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics period
 *     responses:
 *       200:
 *         description: Merchants performance data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MerchantPerformance'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/dashboard/merchants', adminDashboardController.getAllMerchantsPerformance);

/**
 * @swagger
 * /admin/dashboard/revenue:
 *   get:
 *     summary: Get total platform revenue
 *     description: Retrieve total revenue analytics across all merchants
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for revenue period
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for revenue period
 *     responses:
 *       200:
 *         description: Revenue data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RevenueAnalytics'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/dashboard/revenue', adminDashboardController.getTotalRevenue);

/**
 * @swagger
 * /admin/dashboard/orders:
 *   get:
 *     summary: Get order statistics
 *     description: Retrieve comprehensive order statistics across the platform
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for statistics period
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for statistics period
 *     responses:
 *       200:
 *         description: Order statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderStatusBreakdown'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/dashboard/orders', adminDashboardController.getOrderStatistics);

/**
 * @swagger
 * /admin/dashboard/merchants/top:
 *   get:
 *     summary: Get top performing merchants
 *     description: |
 *       Retrieve list of top performing merchants based on comprehensive performance score.
 *       
 *       **Performance Score Formula:**
 *       - 30% Success Rate (completion rate)
 *       - 25% Average Rating (customer satisfaction)
 *       - 20% Revenue (normalized)
 *       - 25% Repeat Order Rate (customer loyalty)
 *       
 *       This differs from revenue breakdown which only looks at monetary value.
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of top merchants to retrieve
 *         example: 10
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for performance period
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for performance period
 *     responses:
 *       200:
 *         description: Top performing merchants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: integer
 *                         example: 1
 *                       merchantId:
 *                         type: string
 *                         example: "MERCHANT123"
 *                       performanceScore:
 *                         type: number
 *                         description: Overall performance score (0-100)
 *                         example: 85.5
 *                       totalRevenue:
 *                         type: number
 *                         example: 45678000
 *                       totalOrders:
 *                         type: integer
 *                         example: 456
 *                       completedOrders:
 *                         type: integer
 *                         example: 420
 *                       successRate:
 *                         type: number
 *                         description: Order completion rate (%)
 *                         example: 92.11
 *                       averageRating:
 *                         type: number
 *                         description: Average customer rating (0-5)
 *                         example: 4.5
 *                       totalRatings:
 *                         type: integer
 *                         description: Number of ratings received
 *                         example: 234
 *                       repeatOrderRate:
 *                         type: number
 *                         description: Customer repeat order rate (%)
 *                         example: 35.5
 *                       averageOrderValue:
 *                         type: number
 *                         example: 100171
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/dashboard/merchants/top', adminDashboardController.getTopPerformingMerchants);


/**
 * @swagger
 * /admin/dashboard/trends:
 *   get:
 *     summary: Get platform trends
 *     description: Retrieve platform-wide trends and analytics over time
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for trends analysis
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for trends analysis
 *     responses:
 *       200:
 *         description: Platform trends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Trend data over time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/dashboard/trends', adminDashboardController.getPlatformTrends);

/**
 * @swagger
 * /admin/dashboard/revenue/by-merchant:
 *   get:
 *     summary: Get revenue breakdown by merchant
 *     description: Retrieve detailed revenue breakdown for each merchant
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for revenue period
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for revenue period
 *     responses:
 *       200:
 *         description: Revenue by merchant retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       merchantId:
 *                         type: string
 *                         example: "MERCHANT123"
 *                       totalRevenue:
 *                         type: number
 *                         example: 45678000
 *                       totalOrders:
 *                         type: integer
 *                         example: 456
 *                       totalProductAmount:
 *                         type: number
 *                         example: 40000000
 *                       totalDeliveryFee:
 *                         type: number
 *                         example: 3000000
 *                       totalTax:
 *                         type: number
 *                         example: 2000000
 *                       totalDiscount:
 *                         type: number
 *                         example: 500000
 *                       averageOrderValue:
 *                         type: number
 *                         example: 100171
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/dashboard/revenue/by-merchant', adminDashboardController.getRevenueByMerchant);

export default router;
