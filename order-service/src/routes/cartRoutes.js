// src/routes/cartRoutes.js
import express from 'express';
import cartController from '../controllers/cartController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Giỏ hàng đa quán (multi-restaurant cart)
 */

/**
 * @swagger
 * /api/cart/{userId}:
 *   get:
 *     summary: Lấy giỏ hàng của người dùng
 *     description: Hỗ trợ cả user đăng nhập và guest (dùng userId hoặc guestCartId)
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng hoặc guestCartId
 *         example: USER123
 *     responses:
 *       200:
 *         description: Lấy giỏ hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 */
router.get('/:userId', cartController.getCart);

/**
 * @swagger
 * /api/cart/{userId}:
 *   post:
 *     summary: Thêm món vào giỏ hàng
 *     description: Hỗ trợ thêm món từ nhiều quán khác nhau vào cùng một giỏ
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: USER123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurant
 *               - item
 *             properties:
 *               restaurant:
 *                 type: object
 *                 required:
 *                   - restaurantId
 *                   - restaurantName
 *                   - deliveryFee
 *                 properties:
 *                   restaurantId: { type: string }
 *                   restaurantName: { type: string }
 *                   restaurantSlug: { type: string }
 *                   restaurantImage: { type: string, format: uri, nullable: true }
 *                   deliveryFee: { type: number, example: 20000 }
 *               item:
 *                 $ref: '#/components/schemas/CartItem'
 *     responses:
 *       201:
         description: Thêm món thành công
         content:
           application/json:
             schema:
               $ref: '#/components/schemas/CartResponse'
 */
router.post('/:userId', cartController.addItemToCart);

/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}/item/{productId}:
 *   patch:
 *     summary: Cập nhật số lượng món trong giỏ
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 5
 *     responses:
 *       200:
 *         description: Cập nhật số lượng thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 */
router.patch('/:userId/restaurant/:restaurantId/item/:productId', cartController.updateItemQuantity);

/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}/item/{productId}:
 *   delete:
 *     summary: Xóa một món khỏi giỏ hàng
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Xóa món thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 */
router.delete('/:userId/restaurant/:restaurantId/item/:productId', cartController.removeItemFromCart);

/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}:
 *   delete:
 *     summary: Xóa toàn bộ món của một quán khỏi giỏ
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Xóa quán khỏi giỏ thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 */
router.delete('/:userId/restaurant/:restaurantId', cartController.removeRestaurantFromCart);

/**
 * @swagger
 * /api/cart/{userId}:
 *   delete:
 *   summary: Xóa toàn bộ giỏ hàng
 *   tags: [Cart]
 *   parameters:
 *     - in: path
 *       name: userId
 *       required: true
 *       schema: { type: string }
 *   responses:
 *     200:
 *       description: Xóa sạch giỏ hàng thành công
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success: { type: boolean, example: true }
 *               message: { type: string, example: "Cart cleared successfully" }
 */
router.delete('/:userId', cartController.clearCart);

/**
 * @swagger
 * /api/cart/{userId}/restaurant/{restaurantId}:
 *   put:
 *     summary: Cập nhật thông tin giao hàng & ghi chú của một quán trong giỏ
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes: { type: string, example: "Giao nhanh giúp em với ạ" }
 *               deliveryAddress: { type: string, example: "113 Hàn Thuyên, Linh Trung, TP. Thủ Đức" }
 *               discount: { type: number, example: 10000 }
 *               deliveryFee: { type: number, example: 25000 }
 *     responses:
 *       200:
 *         description: Cập nhật thông tin giỏ thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 */
router.put('/:userId/restaurant/:restaurantId', cartController.updateCartDetails);

/**
 * @swagger
 * /api/cart/{userId}/summary:
 *   get:
 *     summary: Lấy tóm tắt giỏ hàng (nhẹ, nhanh)
 *     description: Dùng cho hiển thị badge số món, tổng tiền trên header
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartSummary'
 */
router.get('/:userId/summary', cartController.getCartSummary);

/**
 * @swagger
 * /api/cart/{userId}/checkout:
 *   post:
 *     summary: Kiểm tra giỏ hàng có hợp lệ để thanh toán không
 *     description: Trả về tổng tiền cuối, số quán, số món – dùng trước khi chuyển sang trang thanh toán
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Giỏ hàng hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     restaurantCount: { type: integer, example: 2 }
 *                     itemCount: { type: integer, example: 7 }
 *                     grandTotal: { type: number, example: 385000 }
 *                     isReadyForCheckout: { type: boolean, example: true }
 *       400:
 *         description: Giỏ hàng rỗng hoặc không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:userId/checkout', cartController.validateCartForCheckout);

export default router;
