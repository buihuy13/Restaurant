import Joi from "joi";

export const createPaymentSchema = Joi.object({
  orderId: Joi.string().required(),
  userId: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  paymentMethod: Joi.string().valid("cash", "card", "wallet").required(),
  currency: Joi.string().length(3).default("USD"),
  metadata: Joi.object().optional(),
});

export const refundPaymentSchema = Joi.object({
  amount: Joi.number().min(0).optional(),
  reason: Joi.string().required(),
});
