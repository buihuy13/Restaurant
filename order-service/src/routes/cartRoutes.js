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

// ============ GET CART ============
/**
 * @swagger
 * /api/cart/{userId}:
 *   get:
 *     summary: Get user's cart
 *     description: Retrieve the shopping cart for a specific user (supports both authenticated and guest users)
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         description: User ID (can be userId or guestCartId)
 *         example: USER123
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         produces:
 *           - application/json
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *               example: Cart retrieved successfully
 *             data:
 *               $ref: '#/definitions/CartResponse'
 *         examples:
 *           application/json:
 *             status: success
 *             message: Cart retrieved successfully
 *             data:
 *               userId: USER123
 *               restaurants:
 *                 - restaurantId: qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f
 *                   restaurantName: Nhà hàng UIT3
 *                   restaurantSlug: nha-hang-uit3-6rbN8
 *                   restaurantImage: https://via.placeholder.com/300
 *                   items:
 *                     - productId: GrAZGZIci23h6LNRl2BRSaDCGXHrR9obQimft4vyjvFWfwKMaeUnuW5ku58c8Z644cOreH7DsufFFMxSXj1cFPl6K2Qk6U0QFTt4Q6y4rrBNaQa782zA6H5f9ZMHCE3zNw7cYUYZnrvGZYj3oQa1v3hts7anNwQLbEoeRxsi1VWjGZmOdHMdz2AS9XCFUW5UdwPx1S25DybjaMbfkQu9QYnbabrKMU0hHfcuZQrVTDAryZTyUwN0qB0yZvQLS6
 *                       productName: Trà sữa trân châu đường đen
 *                       price: 30000
 *                       quantity: 2
 *                       customizations: Không đường, thêm trân châu
 *                       subtotal: 60000
 *                   subtotal: 60000
 *                   tax: 6000
 *                   deliveryFee: 20000
 *                   discount: 0
 *                   totalAmount: 86000
 *                   notes: Giao cẩn thận, để ở cửa nhà
 *                   deliveryAddress: 113 Đường Hàn Thuyên, Quận Thủ Đức
 *               createdAt: 2023-10-01T12:00:00Z
 *               updatedAt: 2023-10-01T12:05:00Z
 *       400:
 *         description: Invalid request
 *         produces:
 *           - application/json
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 *       500:
 *         description: Server error
 *         produces:
 *           - application/json
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.get('/:userId', cartController.getCart);

// ============ ADD ITEM TO CART ============
/**
 * @swagger
 * /api/cart/{userId}:
 *   post:
 *     summary: Add item to cart
 *     description: Add a product from a restaurant to the user's cart. Supports multi-restaurant carts.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         example: USER123
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - restaurant
 *             - item
 *           properties:
 *             restaurant:
 *               type: object
 *               properties:
 *                 restaurantId:
 *                   type: string
 *                   example: qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f
 *                 restaurantName:
 *                   type: string
 *                   example: Nhà hàng UIT3
 *                 restaurantSlug:
 *                   type: string
 *                   example: nha-hang-uit3-6rbN8
 *                 restaurantImage:
 *                   type: string
 *                   example: https://via.placeholder.com/300
 *                 deliveryFee:
 *                   type: number
 *                   example: 20000
 *             item:
 *               $ref: '#/definitions/CartItem'
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         produces:
 *           - application/json
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *               example: Item added to cart successfully
 *             data:
 *               $ref: '#/definitions/CartResponse'
 *         examples:
 *           application/json:
 *             status: success
 *             message: Item added to cart successfully
 *             data:
 *               userId: USER123
 *               restaurants:
 *                 - restaurantId: qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f
 *                   restaurantName: Nhà hàng UIT3
 *                   restaurantSlug: nha-hang-uit3-6rbN8
 *                   restaurantImage: https://via.placeholder.com/300
 *                   items:
 *                     - productId: GrAZGZIci23h6LNRl2BRSaDCGXHrR9obQimft4vyjvFWfwKMaeUnuW5ku58c8Z644cOreH7DsufFFMxSXj1cFPl6K2Qk6U0QFTt4Q6y4rrBNaQa782zA6H5f9ZMHCE3zNw7cYUYZnrvGZYj3oQa1v3hts7anNwQLbEoeRxsi1VWjGZmOdHMdz2AS9XCFUW5UdwPx1S25DybjaMbfkQu9QYnbabrKMU0hHfcuZQrVTDAryZTyUwN0qB0yZvQLS6
 *                       productName: Trà sữa trân châu đường đen
 *                       price: 30000
 *                       quantity: 2
 *                       customizations: Không đường, thêm trân châu
 *                       subtotal: 60000
 *                   subtotal: 60000
 *                   tax: 6000
 *                   deliveryFee: 20000
 *                   discount: 0
 *                   totalAmount: 86000
 *                   notes: ''
 *                   deliveryAddress: ''
 *               createdAt: 2023-10-01T12:00:00Z
 *               updatedAt: 2023-10-01T12:05:00Z
 *       400:
 *         description: Invalid request - missing required fields
 *         produces:
 *           - application/json
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.post('/:userId', cartController.addItemToCart);

// ============ UPDATE ITEM QUANTITY ============
/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}/item/{productId}:
 *   patch:
 *     summary: Update item quantity
 *     description: Update the quantity of a specific item in the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         example: USER123
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         type: string
 *         example: qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f
 *       - in: path
 *         name: productId
 *         required: true
 *         type: string
 *         example: GrAZGZIci23h6LNRl2BRSaDCGXHrR9obQimft4vyjvFWfwKMaeUnuW5ku58c8Z644cOreH7DsufFFMxSXj1cFPl6K2Qk6U0QFTt4Q6y4rrBNaQa782zA6H5f9ZMHCE3zNw7cYUYZnrvGZYj3oQa1v3hts7anNwQLbEoeRxsi1VWjGZmOdHMdz2AS9XCFUW5UdwPx1S25DybjaMbfkQu9QYnbabrKMU0hHfcuZQrVTDAryZTyUwN0qB0yZvQLS6
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - quantity
 *           properties:
 *             quantity:
 *               type: integer
 *               minimum: 1
 *               example: 4
 *     responses:
 *       200:
 *         description: Item quantity updated successfully
 *         produces:
 *           - application/json
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *               example: Item quantity updated successfully
 *             data:
 *               $ref: '#/definitions/CartResponse'
 *         examples:
 *           application/json:
 *             status: success
 *             message: Item quantity updated successfully
 *             data:
 *               userId: USER123
 *               restaurants:
 *                 - restaurantId: qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f
 *                   restaurantName: Nhà hàng UIT3
 *                   restaurantSlug: nha-hang-uit3-6rbN8
 *                   restaurantImage: https://via.placeholder.com/300
 *                   items:
 *                     - productId: GrAZGZIci23h6LNRl2BRSaDCGXHrR9obQimft4vyjvFWfwKMaeUnuW5ku58c8Z644cOreH7DsufFFMxSXj1cFPl6K2Qk6U0QFTt4Q6y4rrBNaQa782zA6H5f9ZMHCE3zNw7cYUYZnrvGZYj3oQa1v3hts7anNwQLbEoeRxsi1VWjGZmOdHMdz2AS9XCFUW5UdwPx1S25DybjaMbfkQu9QYnbabrKMU0hHfcuZQrVTDAryZTyUwN0qB0yZvQLS6
 *                       productName: Trà sữa trân châu đường đen
 *                       price: 30000
 *                       quantity: 4
 *                       customizations: Không đường, thêm trân châu
 *                       subtotal: 120000
 *                   subtotal: 120000
 *                   tax: 12000
 *                   deliveryFee: 20000
 *                   discount: 0
 *                   totalAmount: 152000
 *                   notes: ''
 *                   deliveryAddress: ''
 *               createdAt: 2023-10-01T12:00:00Z
 *               updatedAt: 2023-10-01T12:05:00Z
 *       400:
 *         description: Invalid quantity or resource not found
 *         produces:
 *           - application/json
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.patch('/:userId/restaurant/:restaurantId/item/:productId', cartController.updateItemQuantity);

// ============ REMOVE ITEM FROM CART ============
/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}/item/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove a specific product from a restaurant in the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         example: USER123
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         type: string
 *         example: qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f
 *       - in: path
 *         name: productId
 *         required: true
 *         type: string
 *         example: GrAZGZIci23h6LNRl2BRSaDCGXHrR9obQimft4vyjvFWfwKMaeUnuW5ku58c8Z644cOreH7DsufFFMxSXj1cFPl6K2Qk6U0QFTt4Q6y4rrBNaQa782zA6H5f9ZMHCE3zNw7cYUYZnrvGZYj3oQa1v3hts7anNwQLbEoeRxsi1VWjGZmOdHMdz2AS9XCFUW5UdwPx1S25DybjaMbfkQu9QYnbabrKMU0hHfcuZQrVTDAryZTyUwN0qB0yZvQLS6
 *     responses:
 *       200:
 *         description: Item removed successfully
 *         produces:
 *           - application/json
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *               example: Item removed from cart successfully
 *             data:
 *               $ref: '#/definitions/CartResponse'
 *         examples:
 *           application/json:
 *             status: success
 *             message: Item removed from cart successfully
 *             data:
 *               userId: USER123
 *               restaurants:
 *                 - restaurantId: qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f
 *                   restaurantName: Nhà hàng UIT3
 *                   restaurantSlug: nha-hang-uit3-6rbN8
 *                   restaurantImage: https://via.placeholder.com/300
 *                   items: []
 *                   subtotal: 0
 *                   tax: 0
 *                   deliveryFee: 20000
 *                   discount: 0
 *                   totalAmount: 20000
 *                   notes: ''
 *                   deliveryAddress: ''
 *               createdAt: 2023-10-01T12:00:00Z
 *               updatedAt: 2023-10-01T12:05:00Z
 *       400:
 *         description: Invalid request
 *         produces:
 *           - application/json
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.delete('/:userId/restaurant/:restaurantId/item/:productId', cartController.removeItemFromCart);

// ============ REMOVE RESTAURANT FROM CART ============
/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}:
 *   delete:
 *     summary: Remove restaurant from cart
 *     description: Remove all items from a specific restaurant in the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         example: USER123
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         type: string
 *         example: qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f
 *     responses:
 *       200:
 *         description: Restaurant removed from cart
 *         produces:
 *           - application/json
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *               example: Restaurant removed from cart successfully
 *             data:
 *               $ref: '#/definitions/CartResponse'
 *         examples:
 *           application/json:
 *             status: success
 *             message: Restaurant removed from cart successfully
 *             data:
 *               userId: USER123
 *               restaurants: []
 *               createdAt: 2023-10-01T12:00:00Z
 *               updatedAt: 2023-10-01T12:05:00Z
 *       400:
 *         description: Invalid request
 *         produces:
 *           - application/json
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.delete('/:userId/restaurant/:restaurantId', cartController.removeRestaurantFromCart);

// ============ CLEAR ENTIRE CART ============
/**
 * @swagger
 * /api/cart/{userId}:
 *   delete:
 *     summary: Clear entire cart
 *     description: Remove all items and restaurants from the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         example: USER123
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         produces:
 *           - application/json
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *               example: Cart cleared successfully
 *         examples:
 *           application/json:
 *             status: success
 *             message: Cart cleared successfully
 *       400:
 *         description: Invalid request
 *         produces:
 *           - application/json
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.delete('/:userId', cartController.clearCart);

// ============ UPDATE CART DETAILS ============
/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}:
 *   put:
 *     summary: Update cart details
 *     description: Update delivery address, notes, discount, and delivery fee for a restaurant
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         example: USER123
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         type: string
 *         example: qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             notes:
 *               type: string
 *               example: Giao cẩn thận, để ở cửa nhà
 *             deliveryAddress:
 *               type: string
 *               example: 113 Đường Hàn Thuyên, Quận Thủ Đức, TP.HCM
 *             discount:
 *               type: number
 *               example: 5000
 *             deliveryFee:
 *               type: number
 *               example: 25000
 *     responses:
 *       200:
 *         description: Cart details updated successfully
 *         produces:
 *           - application/json
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *               example: Cart details updated successfully
 *             data:
 *               $ref: '#/definitions/CartResponse'
 *         examples:
 *           application/json:
 *             status: success
 *             message: Cart details updated successfully
 *             data:
 *               userId: USER123
 *               restaurants:
 *                 - restaurantId: qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f
 *                   restaurantName: Nhà hàng UIT3
 *                   restaurantSlug: nha-hang-uit3-6rbN8
 *                   restaurantImage: https://via.placeholder.com/300
 *                   items:
 *                     - productId: GrAZGZIci23h6LNRl2BRSaDCGXHrR9obQimft4vyjvFWfwKMaeUnuW5ku58c8Z644cOreH7DsufFFMxSXj1cFPl6K2Qk6U0QFTt4Q6y4rrBNaQa782zA6H5f9ZMHCE3zNw7cYUYZnrvGZYj3oQa1v3hts7anNwQLbEoeRxsi1VWjGZmOdHMdz2AS9XCFUW5UdwPx1S25DybjaMbfkQu9QYnbabrKMU0hHfcuZQrVTDAryZTyUwN0qB0yZvQLS6
 *                       productName: Trà sữa trân châu đường đen
 *                       price: 30000
 *                       quantity: 2
 *                       customizations: Không đường, thêm trân châu
 *                       subtotal: 60000
 *                   subtotal: 60000
 *                   tax: 6000
 *                   deliveryFee: 25000
 *                   discount: 5000
 *                   totalAmount: 76000
 *                   notes: Giao cẩn thận, để ở cửa nhà
 *                   deliveryAddress: 113 Đường Hàn Thuyên, Quận Thủ Đức, TP.HCM
 *               createdAt: 2023-10-01T12:00:00Z
 *               updatedAt: 2023-10-01T12:05:00Z
 *       400:
 *         description: Invalid request
 *         produces:
 *           - application/json
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.put('/:userId/restaurant/:restaurantId', cartController.updateCartDetails);

// ============ GET CART SUMMARY ============
/**
 * @swagger
 * /api/cart/{userId}/summary:
 *   get:
 *     summary: Get cart summary
 *     description: Get a lightweight summary of the cart including total restaurants, items count, and grand total
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         example: USER123
 *     responses:
 *       200:
 *         description: Cart summary retrieved successfully
 *         produces:
 *           - application/json
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *               example: Cart summary retrieved successfully
 *             data:
 *               $ref: '#/definitions/CartSummary'
 *         examples:
 *           application/json:
 *             status: success
 *             message: Cart summary retrieved successfully
 *             data:
 *               totalRestaurants: 1
 *               totalItems: 4
 *               grandTotal: 152000
 *               restaurants:
 *                 - restaurantId: qte6F123K9RoI0pg1GBRLwz5Igs4lC9G1BgIGPWmPTyNA9NyMKfslxCXc9clILImVbTAK2pKwURO3wdU5dXkzG0LkxmkjNmroankmr1MzOIPkrFyWrEJkIG06vesXIPmpEpVlYvtgSy1e81086MZpOGGfHedeVJnixTF0iuiyzi8qtyqPyL6hg76zXseJXMrV2VOTIVuzrJpvX1pnRN6XqCM9qu9sCToqiSKvA80pGlnygGy0e4RwB29K9i23f
 *                   restaurantName: Nhà hàng UIT3
 *                   itemCount: 4
 *                   totalAmount: 152000
 *       500:
 *         description: Server error
 *         produces:
 *           - application/json
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.get('/:userId/summary', cartController.getCartSummary);

// ============ VALIDATE CHECKOUT ============
/**
 * @swagger
 * /api/cart/{userId}/checkout:
 *   post:
 *     summary: Validate cart for checkout
 *     description: Validate cart and get checkout details including payment summary
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         example: USER123
 *     responses:
 *       200:
 *         description: Cart is ready for checkout
 *         produces:
 *           - application/json
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *               example: Cart is valid for checkout
 *             data:
 *               type: object
 *               properties:
 *                 restaurantCount:
 *                   type: integer
 *                   example: 1
 *                 itemCount:
 *                   type: integer
 *                   example: 4
 *                 grandTotal:
 *                   type: number
 *                   example: 152000
 *                 isReadyForCheckout:
 *                   type: boolean
 *                   example: true
 *         examples:
 *           application/json:
 *             status: success
 *             message: Cart is valid for checkout
 *             data:
 *               restaurantCount: 1
 *               itemCount: 4
 *               grandTotal: 152000
 *               isReadyForCheckout: true
 *       400:
 *         description: Cart not valid for checkout
 *         produces:
 *           - application/json
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.post('/:userId/checkout', cartController.validateCartForCheckout);

export default router;
