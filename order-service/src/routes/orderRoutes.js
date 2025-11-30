import express from 'express';
import orderController from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createOrderSchema } from '../dtos/request/createOrderDto.js';
import { updateOrderStatusSchema, addRatingSchema } from '../dtos/request/updateOrderDto.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Order management endpoints
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve all orders (Admin only)
 *     tags:
 *       - Orders
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: status
 *         in: query
 *         type: string
 *         description: Filter by order status
 *         enum:
 *           - pending
 *           - confirmed
 *           - preparing
 *           - ready
 *           - completed
 *           - cancelled
 *       - name: restaurantId
 *         in: query
 *         type: string
 *         description: Filter by restaurant ID
 *       - name: userId
 *         in: query
 *         type: string
 *         description: Filter by user ID
 *       - name: page
 *         in: query
 *         type: integer
 *         default: 1
 *         description: Page number
 *       - name: limit
 *         in: query
 *         type: integer
 *         default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/OrderResponse'
 *             pagination:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/', orderController.getAllOrders);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order with items and delivery details
 *     tags:
 *       - Orders
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: order
 *         in: body
 *         description: Order details
 *         required: true
 *         schema:
 *           $ref: '#/definitions/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *             data:
 *               $ref: '#/definitions/OrderResponse'
 *       400:
 *         description: Bad request - validation failed
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 *       401:
 *         description: Unauthorized - token required
 *       500:
 *         description: Server error
 */
router.post('/', validateRequest(createOrderSchema), orderController.createOrder);

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get order by ID
 *     description: Retrieve order details using order ID
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             message:
 *               type: string
 *             data:
 *               $ref: '#/definitions/OrderResponse'
 *       404:
 *         description: Order not found
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 *       500:
 *         description: Server error
 */
router.get('/:orderId', orderController.getOrderById);

/**
 * @swagger
 * /api/orders/slug/{slug}:
 *   get:
 *     summary: Get order by slug
 *     description: Retrieve order details using order slug
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         type: string
 *         description: Order slug
 *     responses:
 *       200:
 *         description: Order found
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             message:
 *               type: string
 *             data:
 *               $ref: '#/definitions/OrderResponse'
 *       404:
 *         description: Order not found
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.get('/slug/:slug', orderController.getOrderBySlug);

/**
 * @swagger
 * /api/orders/user/{userId}:
 *   get:
 *     summary: Get user's orders
 *     description: Retrieve all orders for a specific user
 *     tags:
 *       - Orders
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: User ID
 *       - name: status
 *         in: query
 *         type: string
 *         description: Filter by status
 *       - name: page
 *         in: query
 *         type: integer
 *         default: 1
 *       - name: limit
 *         in: query
 *         type: integer
 *         default: 20
 *     responses:
 *       200:
 *         description: User orders retrieved
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             message:
 *               type: string
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/OrderResponse'
 *             pagination:
 *               type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/user/:userId', orderController.getUserOrders);

/**
 * @swagger
 * /api/orders/restaurant/{restaurantId}:
 *   get:
 *     summary: Get restaurant's orders
 *     description: Retrieve all orders for a specific restaurant
 *     tags:
 *       - Orders
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         type: string
 *         description: Restaurant ID
 *       - name: status
 *         in: query
 *         type: string
 *         description: Filter by status
 *       - name: page
 *         in: query
 *         type: integer
 *         default: 1
 *       - name: limit
 *         in: query
 *         type: integer
 *         default: 20
 *     responses:
 *       200:
 *         description: Restaurant orders retrieved
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             message:
 *               type: string
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/OrderResponse'
 *             pagination:
 *               type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Merchant/Admin only
 */
router.get('/restaurant/:restaurantId', orderController.getRestaurantOrders);

/**
 * @swagger
 * /api/orders/{orderId}/status:
 *   patch:
 *     summary: Update order status
 *     description: Update the status of an order (for merchants and admins)
 *     tags:
 *       - Orders
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         type: string
 *         description: Order ID
 *       - name: statusUpdate
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UpdateOrderStatusRequest'
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             message:
 *               type: string
 *             data:
 *               $ref: '#/definitions/OrderResponse'
 *       400:
 *         description: Invalid status transition
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.patch('/:orderId/status', validateRequest(updateOrderStatusSchema), orderController.updateOrderStatus);

/**
 * @swagger
 * /api/orders/{orderId}/cancel:
 *   patch:
 *     summary: Cancel order
 *     description: Cancel an order (only pending or confirmed orders can be cancelled)
 *     tags:
 *       - Orders
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         type: string
 *         description: Order ID
 *       - name: cancellation
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               description: User ID
 *             reason:
 *               type: string
 *               description: Cancellation reason
 *           required:
 *             - userId
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             message:
 *               type: string
 *             data:
 *               $ref: '#/definitions/OrderResponse'
 *       400:
 *         description: Cannot cancel order at this stage
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.patch('/:orderId/cancel', orderController.cancelOrder);

/**
 * @swagger
 * /api/orders/{orderId}/rating:
 *   post:
 *     summary: Add rating to order
 *     description: Add a rating and review to a completed order
 *     tags:
 *       - Orders
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         type: string
 *         description: Order ID
 *       - name: rating
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/AddRatingRequest'
 *     responses:
 *       201:
 *         description: Rating added successfully
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             message:
 *               type: string
 *             data:
 *               $ref: '#/definitions/OrderResponse'
 *       400:
 *         description: Bad request - only completed orders can be rated
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.post('/:orderId/rating', validateRequest(addRatingSchema), orderController.addRating);

export default router;
