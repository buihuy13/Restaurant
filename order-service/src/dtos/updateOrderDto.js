import Joi from "joi";

const updateOrderStatusSchema = Joi.object({
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

export default updateOrderStatusSchema;
