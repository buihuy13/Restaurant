import express from 'express';
import cartController from '../controllers/cartController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Shopping cart management (multi-restaurant support)
 */

/**
 * @swagger
 * /api/cart/{userId}:
 *   get:
 *     summary: Get user's cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             message:
 *               type: string
 *             data:
 *               $ref: '#/definitions/CartResponse'
 *       404:
 *         description: Cart not found (empty)
 */
router.get('/:userId', cartController.getCart);

/**
 * @swagger
 * /api/cart/{userId}:
 *   post:
 *     summary: Add item to cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *       - name: cartItem
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             restaurant:
 *               type: object
 *               properties:
 *                 restaurantId:
 *                   type: string
 *                 restaurantName:
 *                   type: string
 *                 restaurantSlug:
 *                   type: string
 *                 restaurantImage:
 *                   type: string
 *                 deliveryFee:
 *                   type: number
 *               required:
 *                 - restaurantId
 *                 - restaurantName
 *             item:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                 productName:
 *                   type: string
 *                 price:
 *                   type: number
 *                 quantity:
 *                   type: integer
 *                 customizations:
 *                   type: string
 *               required:
 *                 - productId
 *                 - productName
 *                 - price
 *                 - quantity
 *           required:
 *             - restaurant
 *             - item
 *     responses:
 *       201:
 *         description: Item added to cart
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             message:
 *               type: string
 *             data:
 *               $ref: '#/definitions/CartResponse'
 *       400:
 *         description: Bad request
 */
router.post('/:userId', cartController.addItemToCart);

/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}/item/{productId}:
 *   patch:
 *     summary: Update item quantity
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         type: string
 *       - name: productId
 *         in: path
 *         required: true
 *         type: string
 *       - name: quantityUpdate
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             quantity:
 *               type: integer
 *               minimum: 1
 *           required:
 *             - quantity
 *     responses:
 *       200:
 *         description: Quantity updated
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               $ref: '#/definitions/CartResponse'
 */
router.patch('/:userId/restaurant/:restaurantId/item/:productId', cartController.updateItemQuantity);

/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}/item/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         type: string
 *       - name: productId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Item removed
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               $ref: '#/definitions/CartResponse'
 */
router.delete('/:userId/restaurant/:restaurantId/item/:productId', cartController.removeItemFromCart);

/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}:
 *   delete:
 *     summary: Remove restaurant from cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Restaurant removed
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               $ref: '#/definitions/CartResponse'
 */
router.delete('/:userId/restaurant/:restaurantId', cartController.removeRestaurantFromCart);

/**
 * @swagger
 * /api/cart/{userId}:
 *   delete:
 *     summary: Clear entire cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete('/:userId', cartController.clearCart);

/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}:
 *   put:
 *     summary: Update cart details for restaurant
 *     description: Update delivery address, notes, discount, delivery fee
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         type: string
 *       - name: details
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             notes:
 *               type: string
 *             deliveryAddress:
 *               type: string
 *             discount:
 *               type: number
 *             deliveryFee:
 *               type: number
 *     responses:
 *       200:
 *         description: Cart details updated
 */
router.put('/:userId/restaurant/:restaurantId', cartController.updateCartDetails);

/**
 * @swagger
 * /api/cart/{userId}/summary:
 *   get:
 *     summary: Get cart summary
 *     description: Get summary of cart items and totals
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Cart summary retrieved
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 totalRestaurants:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *                 grandTotal:
 *                   type: number
 *                 restaurants:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/:userId/summary', cartController.getCartSummary);

/**
 * @swagger
 * /api/cart/{userId}/checkout:
 *   post:
 *     summary: Validate cart for checkout
 *     description: Validate cart and get checkout details
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Cart is ready for checkout
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 restaurantCount:
 *                   type: integer
 *                 itemCount:
 *                   type: integer
 *                 grandTotal:
 *                   type: number
 *       400:
 *         description: Cart not valid for checkout
 */
router.post('/:userId/checkout', cartController.validateCartForCheckout);

export default router;
