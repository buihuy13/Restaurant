import express from 'express';
import merchantDashboardController from '../controllers/merchantDashboardController.js';

const router = express.Router();

/**
 * @swagger
 * /merchant/{merchantId}/dashboard/overview:
 *   get:
 *     summary: Get merchant overview statistics
 *     description: Retrieve comprehensive overview statistics for a specific merchant
 *     tags: [Merchant Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *         example: "MERCHANT123"
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
 *         description: Merchant overview retrieved successfully
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
 *                   properties:
 *                     totalOrders:
 *                       type: integer
 *                       example: 456
 *                     totalRevenue:
 *                       type: number
 *                       example: 45678000
 *                     averageOrderValue:
 *                       type: number
 *                       example: 100171
 *                     completedOrders:
 *                       type: integer
 *                       example: 389
 *                     pendingOrders:
 *                       type: integer
 *                       example: 23
 *                     confirmedOrders:
 *                       type: integer
 *                       example: 15
 *                     preparingOrders:
 *                       type: integer
 *                       example: 12
 *                     cancelledOrders:
 *                       type: integer
 *                       example: 17
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access denied
 *       500:
 *         description: Internal server error
 */
router.get('/:merchantId/dashboard/overview', merchantDashboardController.getOverview);

/**
 * @swagger
 * /merchant/{merchantId}/dashboard/revenue:
 *   get:
 *     summary: Get merchant revenue analytics
 *     description: Retrieve detailed revenue analytics for a specific merchant
 *     tags: [Merchant Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
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
 *         description: Revenue analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RevenueAnalytics'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/:merchantId/dashboard/revenue', merchantDashboardController.getRevenue);

/**
 * @swagger
 * /merchant/{merchantId}/dashboard/orders/status:
 *   get:
 *     summary: Get order status breakdown
 *     description: Retrieve breakdown of orders by status for a merchant
 *     tags: [Merchant Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analysis period
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analysis period
 *     responses:
 *       200:
 *         description: Order status breakdown retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderStatusBreakdown'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/:merchantId/dashboard/orders/status', merchantDashboardController.getOrderStatus);

/**
 * @swagger
 * /merchant/{merchantId}/dashboard/products/top:
 *   get:
 *     summary: Get top-selling products
 *     description: Retrieve list of top-selling products for a merchant
 *     tags: [Merchant Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of top products to retrieve
 *         example: 10
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for sales period
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for sales period
 *     responses:
 *       200:
 *         description: Top products retrieved successfully
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
 *                     $ref: '#/components/schemas/TopProduct'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/:merchantId/dashboard/products/top', merchantDashboardController.getTopProducts);

/**
 * @swagger
 * /merchant/{merchantId}/dashboard/revenue/trend:
 *   get:
 *     summary: Get revenue trend over time
 *     description: Retrieve revenue trend data over a specified time period
 *     tags: [Merchant Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for trend analysis
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for trend analysis
 *     responses:
 *       200:
 *         description: Revenue trend retrieved successfully
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
 *                       date:
 *                         type: string
 *                         format: date
 *                       revenue:
 *                         type: number
 *                       orders:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/:merchantId/dashboard/revenue/trend', merchantDashboardController.getRevenueTrend);

/**
 * @swagger
 * /merchant/{merchantId}/dashboard/ratings:
 *   get:
 *     summary: Get rating statistics
 *     description: Retrieve customer rating statistics for a merchant
 *     tags: [Merchant Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for ratings period
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for ratings period
 *     responses:
 *       200:
 *         description: Rating statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RatingStatistics'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/:merchantId/dashboard/ratings', merchantDashboardController.getRatingStatistics);

/**
 * @swagger
 * /merchant/{merchantId}/dashboard/hourly:
 *   get:
 *     summary: Get hourly order statistics
 *     description: Retrieve order statistics broken down by hour of day
 *     tags: [Merchant Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analysis period
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analysis period
 *     responses:
 *       200:
 *         description: Hourly statistics retrieved successfully
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
 *                       hour:
 *                         type: integer
 *                         example: 12
 *                       totalOrders:
 *                         type: integer
 *                         example: 45
 *                       totalRevenue:
 *                         type: number
 *                         example: 4567000
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/:merchantId/dashboard/hourly', merchantDashboardController.getHourlyStatistics);

/**
 * @swagger
 * /merchant/{merchantId}/dashboard/time-analytics:
 *   get:
 *     summary: Get time-based analytics
 *     description: Retrieve time-based analytics including peak hours and busiest days
 *     tags: [Merchant Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analysis period
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analysis period
 *     responses:
 *       200:
 *         description: Time analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeAnalytics'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/:merchantId/dashboard/time-analytics', merchantDashboardController.getTimeBasedAnalytics);

export default router;
