import express from "express";
import orderController from "../controllers/orderController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createOrderSchema } from "../dtos/request/createOrderDto.js";
import {
  updateOrderStatusSchema,
  addRatingSchema,
} from "../dtos/request/updateOrderDto.js";

const router = express.Router();

router.get("/", authenticate, authorize("ADMIN"), orderController.getAllOrders);

// Create order
router.post(
  "/",
  authenticate,
  authorize("USER"),
  validateRequest(createOrderSchema),
  orderController.createOrder
);

// Get order by Id
router.get("/:orderId", authenticate, orderController.getOrderById);

// Get user orders
router.get(
  "/user/:userId",
  authenticate,
  authorize("USER", "ADMIN"),
  orderController.getUserOrders
);

// Get restaurant orders
router.get(
  "/restaurant/:restaurantId",
  authenticate,
  authorize("MERCHANT", "ADMIN"),
  orderController.getRestaurantOrders
);

// Update order status
router.patch(
  "/:orderId/status",
  authenticate,
  authorize("MERCHANT", "ADMIN"),
  validateRequest(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

// Cancel order (có thể thêm validate schema riêng nếu muốn)
router.patch("/:orderId/cancel", authenticate, orderController.cancelOrder);

// Add rating
router.post(
  "/:orderId/rating",
  authenticate,
  authorize("USER"),
  validateRequest(addRatingSchema),
  orderController.addRating
);

export default router;
