import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
    {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        cartItemImage: { type: String, default: '' },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        customizations: { type: String, default: '' },
        subtotal: { type: Number, required: true },
    },
    { _id: false },
);

const restaurantCartSchema = new mongoose.Schema(
    {
        restaurantId: { type: String, required: true },
        restaurantName: { type: String, required: true },
        restaurantSlug: String,
        restaurantImage: String,
        items: [cartItemSchema],
        subtotal: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        deliveryFee: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        totalAmount: { type: Number, default: 0 },
        notes: String,
        deliveryAddress: String,
    },
    { _id: false },
);

const cartSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true, index: true },
        restaurants: [restaurantCartSchema],
    },
    {
        timestamps: true,
        collection: 'carts',
    },
);

// Pre-save: Calculate totals for each restaurant
cartSchema.pre('save', function (next) {
    try {
        this.restaurants.forEach((restaurant) => {
            // Calculate subtotal from items
            restaurant.subtotal = restaurant.items.reduce((sum, item) => {
                item.subtotal = item.price * item.quantity;
                return sum + item.subtotal;
            }, 0);

            // Calculate tax (10%)
            restaurant.tax = restaurant.subtotal * 0.1;

            // Calculate total
            restaurant.totalAmount =
                restaurant.subtotal + restaurant.deliveryFee + restaurant.tax - (restaurant.discount || 0);
        });

        next();
    } catch (error) {
        console.error('Error calculating cart totals:', error);
        next(error);
    }
});

export default mongoose.model('Cart', cartSchema);
