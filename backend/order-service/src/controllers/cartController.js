import cartService from '../services/cartService.js';
import logger from '../utils/logger.js';

class CartController {
    // GET /api/cart/{userId} - Get user's cart
    async getCart(req, res) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'userId is required',
                });
            }

            logger.info(`GET - Cart for user: ${userId}`);

            const cart = await cartService.getCart(userId);

            if (!cart) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Cart is empty',
                    data: null,
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'Cart retrieved successfully',
                data: cart,
            });
        } catch (error) {
            logger.error(`❌ Get cart error: ${error.message}`);
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    // POST /api/cart/{userId} - Add item to cart
    async addItemToCart(req, res) {
        try {
            const { userId } = req.params;
            const { restaurant, item } = req.body;

            if (!userId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'userId is required',
                });
            }

            if (!restaurant || !restaurant.restaurantId || !restaurant.restaurantName) {
                return res.status(400).json({
                    status: 'error',
                    message: 'restaurant.restaurantId and restaurant.restaurantName are required',
                });
            }

            if (!item || !item.productId || !item.productName || !item.price || !item.quantity) {
                return res.status(400).json({
                    status: 'error',
                    message: 'item must have: productId, productName, price, quantity',
                });
            }

            logger.info(`🛒 POST - Add item: ${userId} - ${item.productId}`);

            const cart = await cartService.addItemToCart(userId, restaurant, item);

            res.status(201).json({
                status: 'success',
                message: 'Item added to cart',
                data: cart,
            });
        } catch (error) {
            logger.error(`❌ Add item error: ${error.message}`);
            res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    // PATCH /api/cart/{userId}/restaurant/{restaurantId}/item/{productId} - Update quantity
    async updateItemQuantity(req, res) {
        try {
            const { userId, restaurantId, productId } = req.params;
            const { quantity, sizeId = null, customizations = '' } = req.body;

            if (!userId || !restaurantId || !productId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'userId, restaurantId, and productId are required',
                });
            }

            if (!quantity || quantity <= 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'quantity must be greater than 0',
                });
            }

            logger.info(`PATCH - Update quantity: ${userId} - ${restaurantId} - ${productId} -> ${quantity}`);

            const cart = await cartService.updateItemQuantity(
                userId,
                restaurantId,
                productId,
                quantity,
                sizeId,
                customizations,
            );

            res.status(200).json({
                status: 'success',
                message: 'Item quantity updated',
                data: cart,
            });
        } catch (error) {
            logger.error(`Update quantity error: ${error.message}`);
            res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    // DELETE /api/cart/{userId}/restaurant/{restaurantId}/item/{productId} - Remove item
    async removeItemFromCart(req, res) {
        try {
            const { userId, restaurantId, productId } = req.params;
            const { sizeId = null, customizations = '' } = req.query;

            if (!userId || !restaurantId || !productId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'userId, restaurantId, and productId are required',
                });
            }

            logger.info(`DELETE - Remove item: ${userId} - ${restaurantId} - ${productId}`);

            const cart = await cartService.removeItemFromCart(userId, restaurantId, productId, sizeId, customizations);

            res.status(200).json({
                status: 'success',
                message: 'Item removed from cart',
                data: cart,
            });
        } catch (error) {
            logger.error(`Remove item error: ${error.message}`);
            res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    // DELETE /api/cart/{userId}/restaurant/{restaurantId} - Remove restaurant
    async removeRestaurantFromCart(req, res) {
        try {
            const { userId, restaurantId } = req.params;

            if (!userId || !restaurantId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'userId and restaurantId are required',
                });
            }

            logger.info(`🏪 DELETE - Remove restaurant: ${userId} - ${restaurantId}`);

            const cart = await cartService.removeRestaurantFromCart(userId, restaurantId);

            res.status(200).json({
                status: 'success',
                message: 'Restaurant removed from cart',
                data: cart,
            });
        } catch (error) {
            logger.error(`❌ Remove restaurant error: ${error.message}`);
            res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    // ✅ DELETE /api/cart/{userId} - Clear entire cart
    async clearCart(req, res) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'userId is required',
                });
            }

            logger.info(`🧹 DELETE - Clear cart: ${userId}`);

            await cartService.clearCart(userId);

            res.status(200).json({
                status: 'success',
                message: 'Cart cleared successfully',
            });
        } catch (error) {
            logger.error(`❌ Clear cart error: ${error.message}`);
            res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    // PUT /api/cart/{userId}/restaurant/{restaurantId} - Update cart details
    async updateCartDetails(req, res) {
        try {
            const { userId, restaurantId } = req.params;
            const { notes, deliveryAddress, discount, deliveryFee } = req.body;

            if (!userId || !restaurantId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'userId and restaurantId are required',
                });
            }

            logger.info(`✏️ PUT - Update details: ${userId} - ${restaurantId}`);

            const cart = await cartService.updateCartDetails(userId, restaurantId, {
                notes,
                deliveryAddress,
                discount,
                deliveryFee,
            });

            res.status(200).json({
                status: 'success',
                message: 'Cart details updated',
                data: cart,
            });
        } catch (error) {
            logger.error(`❌ Update details error: ${error.message}`);
            res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    // ✅ GET /api/cart/{userId}/summary - Get cart summary
    async getCartSummary(req, res) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'userId is required',
                });
            }

            logger.info(`📊 GET - Cart summary: ${userId}`);

            const summary = await cartService.getCartSummary(userId);

            res.status(200).json({
                status: 'success',
                message: 'Cart summary retrieved',
                data: summary,
            });
        } catch (error) {
            logger.error(`❌ Get summary error: ${error.message}`);
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    // ✅ POST /api/cart/{userId}/checkout - Validate cart for checkout
    async validateCartForCheckout(req, res) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'userId is required',
                });
            }

            logger.info(`✅ POST - Validate checkout: ${userId}`);

            const checkoutData = await cartService.getCartForCheckout(userId);

            res.status(200).json({
                status: 'success',
                message: 'Cart is ready for checkout',
                data: checkoutData,
            });
        } catch (error) {
            logger.error(`❌ Validate checkout error: ${error.message}`);
            res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    }
}

export default new CartController();
