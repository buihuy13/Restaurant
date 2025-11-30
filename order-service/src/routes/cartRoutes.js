import express from 'express';
import cartController from '../controllers/cartController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Shopping cart management with multi-restaurant support
 *     externalDocs:
 *       description: Learn more about cart operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           example: "GrAZGZIci23h6LNRl2BRSaDCGXHrR9obQimft4vyjvFWfwKMaeUnuW5ku58c8Z644cOreH7DsufFFMxSXj1cFPl6K2Qk6U0QFTt4Q6y4rrBNaQa782zA6H5f9ZMHCE3zNw7cYUYZnrvGZYj3oQa1v3hts7anNwQLbEoeRxsi1VWjGZmOdHMdz2AS9XCFUW5UdwPx1S25DybjaMbfkQu9QYnbabrKMU0hHfcuZQrVTDAryZTyUwN0qB0yZvQLS6"
 *         productName:
 *           type: string
 *           example: "Trà sữa trân châu đường đen"
 *         price:
 *           type: number
 *           example: 30000
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *         customizations:
 *           type: string
 *           example: "Không đường, thêm trân châu"
 *         subtotal:
 *           type: number
 *           example: 60000
 *       required:
 *         - productId
 *         - productName
 *         - price
 *         - quantity
 *
 *     Restaurant:
 *       type: object
 *       properties:
 *         restaurantId:
 *           type: string
 *           example: "qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f"
 *         restaurantName:
 *           type: string
 *           example: "Nhà hàng UIT3"
 *         restaurantSlug:
 *           type: string
 *           example: "nha-hang-uit3-6rbN8"
 *         restaurantImage:
 *           type: string
 *           example: "https://via.placeholder.com/300"
 *         deliveryFee:
 *           type: number
 *           example: 20000
 *       required:
 *         - restaurantId
 *         - restaurantName
 *
 *     RestaurantCart:
 *       type: object
 *       properties:
 *         restaurantId:
 *           type: string
 *         restaurantName:
 *           type: string
 *         restaurantSlug:
 *           type: string
 *         restaurantImage:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         subtotal:
 *           type: number
 *           example: 60000
 *         tax:
 *           type: number
 *           example: 6000
 *         deliveryFee:
 *           type: number
 *           example: 20000
 *         discount:
 *           type: number
 *           example: 0
 *         totalAmount:
 *           type: number
 *           example: 86000
 *         notes:
 *           type: string
 *           example: "Giao cẩn thận, để ở cửa nhà"
 *         deliveryAddress:
 *           type: string
 *           example: "113 Đường Hàn Thuyên, Quận Thủ Đức"
 *         couponCode:
 *           type: string
 *           example: "HELLO50"
 *
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         userId:
 *           type: string
 *           example: "USER123"
 *         restaurants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RestaurantCart'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CartSummary:
 *       type: object
 *       properties:
 *         totalRestaurants:
 *           type: integer
 *           example: 1
 *         totalItems:
 *           type: integer
 *           example: 4
 *         grandTotal:
 *           type: number
 *           example: 152000
 *         restaurants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               restaurantId:
 *                 type: string
 *               restaurantName:
 *                 type: string
 *               itemCount:
 *                 type: integer
 *               totalAmount:
 *                 type: number
 *
 *     CartEstimate:
 *       type: object
 *       properties:
 *         subtotal:
 *           type: number
 *           example: 120000
 *         tax:
 *           type: number
 *           example: 12000
 *         deliveryFee:
 *           type: number
 *           example: 20000
 *         discount:
 *           type: number
 *           example: 0
 *         grandTotal:
 *           type: number
 *           example: 152000
 *         breakdown:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               restaurantId:
 *                 type: string
 *               restaurantName:
 *                 type: string
 *               subtotal:
 *                 type: number
 *               tax:
 *                 type: number
 *               deliveryFee:
 *                 type: number
 *               discount:
 *                 type: number
 *               total:
 *                 type: number
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: ['success', 'error']
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Operation completed successfully"
 *         data:
 *           type: object
 *           nullable: true
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: ['error']
 *           example: "error"
 *         message:
 *           type: string
 *           example: "Invalid request"
 *         data:
 *           type: object
 *           nullable: true
 *
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: "JWT Token: Bearer <token>"
 */

// ============ GET CART ============

/**
 * @swagger
 * /api/cart/{userId}:
 *   get:
 *     summary: Get user's cart
 *     description: Retrieve the shopping cart for a specific user (supports both authenticated and guest users)
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (can be userId or guestCartId)
 *         example: "USER123"
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Cart retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:userId', cartController.getCart);

// ============ ADD ITEM TO CART ============

/**
 * @swagger
 * /api/cart/{userId}:
 *   post:
 *     summary: Add item to cart
 *     description: Add a product from a restaurant to the user's cart. Supports multi-restaurant carts.
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "USER123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurant:
 *                 $ref: '#/components/schemas/Restaurant'
 *               item:
 *                 $ref: '#/components/schemas/CartItem'
 *             required:
 *               - restaurant
 *               - item
 *             example:
 *               restaurant:
 *                 restaurantId: "qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f"
 *                 restaurantName: "Nhà hàng UIT3"
 *                 restaurantSlug: "nha-hang-uit3-6rbN8"
 *                 restaurantImage: "https://via.placeholder.com/300"
 *                 deliveryFee: 20000
 *               item:
 *                 productId: "GrAZGZIci23h6LNRl2BRSaDCGXHrR9obQimft4vyjvFWfwKMaeUnuW5ku58c8Z644cOreH7DsufFFMxSXj1cFPl6K2Qk6U0QFTt4Q6y4rrBNaQa782zA6H5f9ZMHCE3zNw7cYUYZnrvGZYj3oQa1v3hts7anNwQLbEoeRxsi1VWjGZmOdHMdz2AS9XCFUW5UdwPx1S25DybjaMbfkQu9QYnbabrKMU0hHfcuZQrVTDAryZTyUwN0qB0yZvQLS6"
 *                 productName: "Trà sữa trân châu đường đen"
 *                 price: 30000
 *                 quantity: 2
 *                 customizations: "Không đường, thêm trân châu"
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Item added to cart successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:userId', cartController.addItemToCart);

// ============ UPDATE ITEM QUANTITY ============

/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}/item/{productId}:
 *   patch:
 *     summary: Update item quantity
 *     description: Update the quantity of a specific item in the cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "USER123"
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f"
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "GrAZGZIci23h6LNRl2BRSaDCGXHrR9obQimft4vyjvFWfwKMaeUnuW5ku58c8Z644cOreH7DsufFFMxSXj1cFPl6K2Qk6U0QFTt4Q6y4rrBNaQa782zA6H5f9ZMHCE3zNw7cYUYZnrvGZYj3oQa1v3hts7anNwQLbEoeRxsi1VWjGZmOdHMdz2AS9XCFUW5UdwPx1S25DybjaMbfkQu9QYnbabrKMU0hHfcuZQrVTDAryZTyUwN0qB0yZvQLS6"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 4
 *             required:
 *               - quantity
 *     responses:
 *       200:
 *         description: Item quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Item quantity updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid quantity or resource not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:userId/restaurant/:restaurantId/item/:productId', cartController.updateItemQuantity);

// ============ REMOVE ITEM FROM CART ============

/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}/item/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove a specific product from a restaurant in the cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "USER123"
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f"
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "GrAZGZIci23h6LNRl2BRSaDCGXHrR9obQimft4vyjvFWfwKMaeUnuW5ku58c8Z644cOreH7DsufFFMxSXj1cFPl6K2Qk6U0QFTt4Q6y4rrBNaQa782zA6H5f9ZMHCE3zNw7cYUYZnrvGZYj3oQa1v3hts7anNwQLbEoeRxsi1VWjGZmOdHMdz2AS9XCFUW5UdwPx1S25DybjaMbfkQu9QYnbabrKMU0hHfcuZQrVTDAryZTyUwN0qB0yZvQLS6"
 *     responses:
 *       200:
 *         description: Item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Item removed from cart successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:userId/restaurant/:restaurantId/item/:productId', cartController.removeItemFromCart);

// ============ REMOVE RESTAURANT FROM CART ============

/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}:
 *   delete:
 *     summary: Remove restaurant from cart
 *     description: Remove all items from a specific restaurant in the cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "USER123"
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f"
 *     responses:
 *       200:
 *         description: Restaurant removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Restaurant removed from cart successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:userId/restaurant/:restaurantId', cartController.removeRestaurantFromCart);

// ============ CLEAR ENTIRE CART ============

/**
 * @swagger
 * /api/cart/{userId}:
 *   delete:
 *     summary: Clear entire cart
 *     description: Remove all items and restaurants from the cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "USER123"
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Cart cleared successfully"
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:userId', cartController.clearCart);

// ============ UPDATE CART DETAILS ============

/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}:
 *   put:
 *     summary: Update cart details
 *     description: Update delivery address, notes, discount, and delivery fee for a restaurant
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "USER123"
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 example: "Giao cẩn thận, để ở cửa nhà"
 *               deliveryAddress:
 *                 type: string
 *                 example: "113 Đường Hàn Thuyên, Quận Thủ Đức, TP.HCM"
 *               discount:
 *                 type: number
 *                 example: 5000
 *               deliveryFee:
 *                 type: number
 *                 example: 25000
 *     responses:
 *       200:
 *         description: Cart details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Cart details updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:userId/restaurant/:restaurantId', cartController.updateCartDetails);

// ============ GET CART SUMMARY ============

/**
 * @swagger
 * /api/cart/{userId}/summary:
 *   get:
 *     summary: Get cart summary
 *     description: Get a lightweight summary of the cart including total restaurants, items count, and grand total
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "USER123"
 *     responses:
 *       200:
 *         description: Cart summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Cart summary retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/CartSummary'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:userId/summary', cartController.getCartSummary);

// ============ GET CART ESTIMATE ============

/**
 * @swagger
 * /api/cart/{userId}/estimate:
 *   get:
 *     summary: Get cart total estimate
 *     description: Calculate and get detailed cost breakdown including subtotal, tax, delivery fee, discount, and grand total
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "USER123"
 *     responses:
 *       200:
 *         description: Cart estimate retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Cart estimate calculated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/CartEstimate'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:userId/estimate', cartController.estimateTotal);

// ============ VALIDATE CHECKOUT ============

/**
 * @swagger
 * /api/cart/{userId}/checkout:
 *   post:
 *     summary: Validate cart for checkout
 *     description: Validate cart and get checkout details including payment summary
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "USER123"
 *     responses:
 *       200:
 *         description: Cart is ready for checkout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Cart is valid for checkout"
 *                 data:
 *                   type: object
 *                   properties:
 *                     restaurantCount:
 *                       type: integer
 *                       example: 1
 *                     itemCount:
 *                       type: integer
 *                       example: 4
 *                     grandTotal:
 *                       type: number
 *                       example: 152000
 *                     isReadyForCheckout:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Cart not valid for checkout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:userId/checkout', cartController.validateCartForCheckout);

// ============ APPLY COUPON ============

/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}/apply-coupon:
 *   patch:
 *     summary: Apply coupon/discount code
 *     description: Apply a coupon code to get discount on cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "USER123"
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               couponCode:
 *                 type: string
 *                 example: "HELLO50"
 *               discountAmount:
 *                 type: number
 *                 example: 50000
 *             required:
 *               - couponCode
 *               - discountAmount
 *     responses:
 *       200:
 *         description: Coupon applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Coupon \"HELLO50\" applied successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid coupon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:userId/restaurant/:restaurantId/apply-coupon', cartController.applyCoupon);

// ============ GET SPECIFIC RESTAURANT CART ============

/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}:
 *   get:
 *     summary: Get specific restaurant cart
 *     description: Get cart details for a specific restaurant only
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "USER123"
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f"
 *     responses:
 *       200:
 *         description: Restaurant cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Restaurant cart retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/RestaurantCart'
 */
router.get('/:userId/restaurant/:restaurantId', cartController.getRestaurantCart);

// ============ MERGE CART ============

/**
 * @swagger
 * /api/cart/{userId}/merge:
 *   post:
 *     summary: Merge guest cart into user cart
 *     description: Merge all items from a guest cart into an authenticated user's cart. Used when guest logs in.
 *     tags:
 *       - Cart
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "USER123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guestCartId:
 *                 type: string
 *                 example: "GUEST_ABC123_XYZ"
 *             required:
 *               - guestCartId
 *     responses:
 *       200:
 *         description: Carts merged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Carts merged successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:userId/merge', cartController.mergeCart);

// ============ BULK UPDATE ITEMS ============

/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}/bulk-update:
 *   patch:
 *     summary: Bulk update multiple items
 *     description: Update quantities for multiple items at once
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "USER123"
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                   required:
 *                     - productId
 *                     - quantity
 *                 example:
 *                   - productId: "PROD001"
 *                     quantity: 2
 *                   - productId: "PROD002"
 *                     quantity: 3
 *             required:
 *               - items
 *     responses:
 *       200:
 *         description: Items updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Items updated successfully (2 items)"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:userId/restaurant/:restaurantId/bulk-update', cartController.bulkUpdateItems);

export default router;
