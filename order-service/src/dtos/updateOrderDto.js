import Joi from "joi";

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivered",
      "cancelled"
    )
    .required(),
  cancellationReason: Joi.string().when("status", {
    is: "cancelled",
    then: Joi.required(),
  }),
});
