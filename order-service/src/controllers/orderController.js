import orderService from "../services/orderService.js";
import createOrderSchema from "../dtos/createOrderDto.js";
import logger from "../utils/logger.js";

class OrderController {
  async createOrder(req, res, next) {
    try {
      const { error } = createOrderSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const token = req.headers.authorization?.split(" ")[1];
      const order = await orderService.createOrder(req.body, token);

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error) {
      logger.error("Create order controller error:", error);
      next(error);
    }
  }
}

export default new OrderController();
