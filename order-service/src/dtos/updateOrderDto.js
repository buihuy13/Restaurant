import Joi from "joi";

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "completed",
      "cancelled"
    )
    .required(),
  cancellationReason: Joi.string().when("status", {
    is: "cancelled",
    then: Joi.required(),
  }),
});

export default updateOrderStatusSchema;
