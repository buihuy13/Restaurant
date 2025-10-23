import orderService from "../services/orderService.js";
import createOrderSchema from "../dtos/createOrderDto.js";
import logger from "../utils/logger.js";
import updateOrderStatusSchema from "../dtos/updateOrderDto.js";

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

  async getOrderById(req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await orderService.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      logger.error("Get order controller error:", error);
      next(error);
    }
  }

  async getUserOrders(req, res, next) {
    try {
      const { userId } = req.params;
      const filters = req.query;

      const result = await orderService.getUserOrders(userId, filters);

      res.status(200).json({
        success: true,
        data: result.orders,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error("Get user orders controller error:", error);
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const { orderId } = req.params;
      const { error } = updateOrderStatusSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const order = await orderService.updateOrderStatus(orderId, req.body);

      res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: order,
      });
    } catch (error) {
      logger.error("Update order status controller error:", error);
      next(error);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      const { userId, reason } = req.body;

      if (!reason) {
        return res.status(400).json({
          success: false,
          message: "cancellation reason is required",
        });
      }

      const order = await orderService.cancelOrder(orderId, userId, reason);

      res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        data: order,
      });
    } catch (error) {
      logger.error("Cancel order controller error:", error);
      next(error);
    }
  }

  async addRating(req, res, next) {
    try {
      const { orderId } = req.params;
      const { userId, rating, review } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      const order = await orderService.addRating(
        orderId,
        userId,
        rating,
        review
      );

      res.status(200).json({
        success: true,
        message: "Rating added successfully",
        data: order,
      });
    } catch (error) {
      logger.error("Add rating controller error:", error);
      next(error);
    }
  }

  async getRestaurantOrders(req, res, next) {
    try {
      const { restaurantId } = req.params;
      const filters = req.query;

      const result = await orderService.getRestaurantOrders(
        restaurantId,
        filters
      );

      res.status(200).json({
        success: true,
        data: result.orders,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error("Get restaurant orders controller error:", error);
      next(error);
    }
  }
}

export default new OrderController();
