import Joi from 'joi';

export const orderItemSchema = Joi.object({
    productId: Joi.string().required(),
    productName: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().min(0).required(),
    customizations: Joi.string().allow('').optional(),
});

export const createOrderSchema = Joi.object({
    userId: Joi.string().required(),
    restaurantId: Joi.string().required(),
    restaurantName: Joi.string().required(),
    items: Joi.array().items(orderItemSchema).min(1).required(),
    deliveryAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
    }).required(),
    discount: Joi.number().min(0).default(0),
    deliveryFee: Joi.number().min(0).default(0),
    paymentMethod: Joi.string().valid('card').required(),
    orderNote: Joi.string().allow('').optional(),
    userLat: Joi.number().required().description('Latitude của user'),
    userLon: Joi.number().required().description('Longitude của user'),
});
