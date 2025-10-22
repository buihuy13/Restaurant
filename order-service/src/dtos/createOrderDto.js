import Joi from "joi";

const createOrderSchema = Joi.object({
  userId: Joi.string().required(),
  restaurantId: Joi.string().required(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        productName: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().min(0).required(),
        specialInstructions: Joi.string().optional(),
      })
    )
    .min(1)
    .required(),
  deliveryAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
  }).required(),
  paymentMethod: Joi.string().valid("cash", "card", "wallet").required(),
  orderNote: Joi.string().optional(),
});

export default createOrderSchema;
