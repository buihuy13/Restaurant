import Joi from 'joi';

export const updateOrderStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled').required(),
    cancellationReason: Joi.string().when('status', {
        is: 'cancelled',
        then: Joi.required(),
        otherwise: Joi.forbidden(), // chỉ cho phép khi status là 'cancelled'
    }),
});

export const addRatingSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    review: Joi.string().allow('').optional(),
});
