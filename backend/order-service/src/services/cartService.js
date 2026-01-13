import Cart from '../models/Cart.js';
import cacheService from './cacheService.js';
import logger from '../utils/logger.js';

class CartService {
    // Get cart by userId
    async getCart(userId) {
        try {
            if (!userId) {
                throw new Error('userId is required');
            }

            logger.info(`Getting cart for user: ${userId}`);

            // Try cache first
            let cart = await cacheService.getCart(userId);

            if (!cart) {
                cart = await Cart.findOne({ userId });
                if (cart) {
                    await cacheService.setCart(userId, cart.toObject());
                    logger.info(`Cart found in database`);
                } else {
                    logger.info(`No cart found for user: ${userId}`);
                }
            } else {
                logger.info(`Cart found in cache`);
            }

            return cart || null;
        } catch (error) {
            logger.error('Get cart error:', error.message);
            throw error;
        }
    }

    // Add item to cart (Multi-restaurant support)
    async addItemToCart(userId, restaurant, item) {
        try {
            logger.info(`Adding item to cart: ${userId} - ${item.productId}`);

            // Validation
            if (!userId || !restaurant?.restaurantId || !item?.productId) {
                throw new Error('userId, restaurantId, and productId are required');
            }

            if (!item.price || item.quantity <= 0) {
                throw new Error('price and quantity (>0) are required');
            }

            if (!item.productName) {
                throw new Error('productName is required');
            }

            // Get or create cart
            let cart = await Cart.findOne({ userId });

            if (!cart) {
                logger.info(`Creating new cart for user: ${userId}`);
                cart = new Cart({
                    userId,
                    restaurants: [],
                });
            }

            // Find restaurant in cart
            let restaurantCart = cart.restaurants.find((r) => r.restaurantId === restaurant.restaurantId);

            if (!restaurantCart) {
                logger.info(`Adding new restaurant to cart: ${restaurant.restaurantName} (${restaurant.restaurantId})`);
                restaurantCart = {
                    restaurantId: restaurant.restaurantId,
                    restaurantName: restaurant.restaurantName,
                    restaurantSlug: restaurant.restaurantSlug || '',
                    restaurantImage: restaurant.restaurantImage || '',
                    items: [],
                    subtotal: 0,
                    tax: 0,
                    deliveryFee: restaurant.deliveryFee || 0,
                    discount: 0,
                    totalAmount: 0,
                    notes: '',
                    deliveryAddress: '',
                };
                cart.restaurants.push(restaurantCart);
            }

            // Check if item already exists
            const existingItem = restaurantCart.items.find((i) => i.productId === item.productId);

            if (existingItem) {
                logger.info(
                    `Item exists, updating quantity from ${existingItem.quantity} to ${
                        existingItem.quantity + item.quantity
                    }`,
                );
                existingItem.quantity += item.quantity;
                existingItem.subtotal = existingItem.price * existingItem.quantity;
                // update image if provided
                if (item.cartItemImage || item.image) {
                    existingItem.cartItemImage = item.cartItemImage || item.image;
                }
            } else {
                logger.info(`Adding new item: ${item.productName}`);
                restaurantCart.items.push({
                    productId: item.productId,
                    productName: item.productName,
                    cartItemImage: item.cartItemImage || item.image || '',
                    price: item.price,
                    quantity: item.quantity,
                    customizations: item.customizations || '',
                    subtotal: item.price * item.quantity,
                });
            }

            // Save and cache
            await cart.save();
            await cacheService.setCart(userId, cart.toObject());

            logger.info(`Item added successfully. Cart now has ${cart.restaurants.length} restaurant(s)`);
            return cart;
        } catch (error) {
            logger.error(`Add item to cart error: ${error.message}`);
            throw error;
        }
    }

    // Update item quantity
    async updateItemQuantity(userId, restaurantId, productId, quantity) {
        try {
            logger.info(`📝 Updating item quantity: ${userId} - ${restaurantId} - ${productId} -> qty: ${quantity}`);

            if (quantity <= 0) {
                throw new Error('Quantity must be greater than 0');
            }

            const cart = await Cart.findOne({ userId });

            if (!cart) {
                throw new Error('Cart not found');
            }

            const restaurantCart = cart.restaurants.find((r) => r.restaurantId === restaurantId);

            if (!restaurantCart) {
                throw new Error(`Restaurant ${restaurantId} not found in cart`);
            }

            const item = restaurantCart.items.find((i) => i.productId === productId);

            if (!item) {
                throw new Error(`Product ${productId} not found in cart`);
            }

            item.quantity = quantity;
            item.subtotal = item.price * quantity;

            await cart.save();
            await cacheService.setCart(userId, cart.toObject());

            logger.info(`Item quantity updated to ${quantity}`);
            return cart;
        } catch (error) {
            logger.error(`Update item quantity error: ${error.message}`);
            throw error;
        }
    }

    // Remove item from cart
    async removeItemFromCart(userId, restaurantId, productId) {
        try {
            logger.info(`Removing item: ${userId} - ${restaurantId} - ${productId}`);

            const cart = await Cart.findOne({ userId });

            if (!cart) {
                throw new Error('Cart not found');
            }

            const restaurantCart = cart.restaurants.find((r) => r.restaurantId === restaurantId);

            if (!restaurantCart) {
                throw new Error(`Restaurant ${restaurantId} not found in cart`);
            }

            const initialLength = restaurantCart.items.length;
            restaurantCart.items = restaurantCart.items.filter((i) => i.productId !== productId);

            if (restaurantCart.items.length === initialLength) {
                throw new Error(`Product ${productId} not found in cart`);
            }

            // Remove restaurant if no items left
            if (restaurantCart.items.length === 0) {
                logger.info(`Removing restaurant from cart (no items left)`);
                cart.restaurants = cart.restaurants.filter((r) => r.restaurantId !== restaurantId);
            }

            // Delete cart if no restaurants left
            if (cart.restaurants.length === 0) {
                await Cart.deleteOne({ userId });
                await cacheService.deleteCart(userId);
                logger.info(`Cart deleted (empty)`);
                return null;
            }

            await cart.save();
            await cacheService.setCart(userId, cart.toObject());

            logger.info(`Item removed from cart`);
            return cart;
        } catch (error) {
            logger.error(`Remove item error: ${error.message}`);
            throw error;
        }
    }

    // Remove restaurant from cart
    async removeRestaurantFromCart(userId, restaurantId) {
        try {
            logger.info(`Removing restaurant: ${userId} - ${restaurantId}`);

            const cart = await Cart.findOne({ userId });

            if (!cart) {
                throw new Error('Cart not found');
            }

            const initialLength = cart.restaurants.length;
            cart.restaurants = cart.restaurants.filter((r) => r.restaurantId !== restaurantId);

            if (cart.restaurants.length === initialLength) {
                throw new Error(`Restaurant ${restaurantId} not found in cart`);
            }

            // Delete cart if no restaurants left
            if (cart.restaurants.length === 0) {
                await Cart.deleteOne({ userId });
                await cacheService.deleteCart(userId);
                logger.info(`🧹 Cart deleted (empty)`);
                return null;
            }

            await cart.save();
            await cacheService.setCart(userId, cart.toObject());

            logger.info(`Restaurant removed from cart`);
            return cart;
        } catch (error) {
            logger.error(`Remove restaurant error: ${error.message}`);
            throw error;
        }
    }

    // Clear entire cart
    async clearCart(userId) {
        try {
            logger.info(`🧹 Clearing cart for user: ${userId}`);

            const result = await Cart.deleteOne({ userId });

            if (result.deletedCount === 0) {
                throw new Error('Cart not found');
            }

            await cacheService.deleteCart(userId);

            logger.info(`Cart cleared`);
            return { message: 'Cart cleared successfully' };
        } catch (error) {
            logger.error(`Clear cart error: ${error.message}`);
            throw error;
        }
    }

    // Update cart details for specific restaurant
    async updateCartDetails(userId, restaurantId, details) {
        try {
            logger.info(`✏️ Updating cart details: ${userId} - ${restaurantId}`);

            const cart = await Cart.findOne({ userId });

            if (!cart) {
                throw new Error('Cart not found');
            }

            const restaurantCart = cart.restaurants.find((r) => r.restaurantId === restaurantId);

            if (!restaurantCart) {
                throw new Error(`Restaurant ${restaurantId} not found in cart`);
            }

            if (details.notes !== undefined) {
                restaurantCart.notes = details.notes;
                logger.info(`📝 Notes updated: ${details.notes}`);
            }

            if (details.deliveryAddress !== undefined) {
                restaurantCart.deliveryAddress = details.deliveryAddress;
                logger.info(`📍 Delivery address updated`);
            }

            if (details.discount !== undefined) {
                restaurantCart.discount = Math.max(0, details.discount);
                logger.info(`Discount updated: ${restaurantCart.discount}`);
            }

            if (details.deliveryFee !== undefined) {
                restaurantCart.deliveryFee = Math.max(0, details.deliveryFee);
                logger.info(`Delivery fee updated: ${restaurantCart.deliveryFee}`);
            }

            await cart.save();
            await cacheService.setCart(userId, cart.toObject());

            logger.info(`Cart details updated`);
            return cart;
        } catch (error) {
            logger.error(`Update cart details error: ${error.message}`);
            throw error;
        }
    }

    // Get cart for checkout (validation)
    async getCartForCheckout(userId) {
        try {
            logger.info(`🛒 Preparing cart for checkout: ${userId}`);

            const cart = await Cart.findOne({ userId });

            if (!cart) {
                throw new Error('Cart not found');
            }

            if (cart.restaurants.length === 0) {
                throw new Error('Cart is empty');
            }

            // Validate each restaurant has items
            const invalidRestaurants = cart.restaurants.filter((r) => r.items.length === 0);

            if (invalidRestaurants.length > 0) {
                throw new Error(
                    `${invalidRestaurants.length} restaurant(s) have no items. Please remove them from cart.`,
                );
            }

            // Validate delivery address for each restaurant
            const noAddressRestaurants = cart.restaurants.filter((r) => !r.deliveryAddress);

            if (noAddressRestaurants.length > 0) {
                throw new Error(`Please set delivery address for ${noAddressRestaurants.length} restaurant(s)`);
            }

            // Calculate grand total
            const grandTotal = cart.restaurants.reduce((sum, r) => sum + r.totalAmount, 0);

            logger.info(`Cart ready for checkout: ${cart.restaurants.length} restaurant(s), total: ${grandTotal}`);

            return {
                cart,
                restaurantCount: cart.restaurants.length,
                itemCount: cart.restaurants.reduce((sum, r) => sum + r.items.length, 0),
                grandTotal: parseFloat(grandTotal.toFixed(2)),
            };
        } catch (error) {
            logger.error(`Get cart for checkout error: ${error.message}`);
            throw error;
        }
    }

    // Get cart summary (for display)
    async getCartSummary(userId) {
        try {
            logger.info(`Getting cart summary: ${userId}`);

            const cart = await Cart.findOne({ userId });

            if (!cart) {
                return {
                    totalRestaurants: 0,
                    totalItems: 0,
                    grandTotal: 0,
                    restaurants: [],
                };
            }

            return {
                totalRestaurants: cart.restaurants.length,
                totalItems: cart.restaurants.reduce((sum, r) => sum + r.items.length, 0),
                grandTotal: parseFloat(cart.restaurants.reduce((sum, r) => sum + r.totalAmount, 0).toFixed(2)),
                restaurants: cart.restaurants.map((r) => ({
                    restaurantId: r.restaurantId,
                    restaurantName: r.restaurantName,
                    itemCount: r.items.length,
                    totalAmount: r.totalAmount,
                })),
            };
        } catch (error) {
            logger.error(`Get cart summary error: ${error.message}`);
            throw error;
        }
    }
}

export default new CartService();
