import express from "express";
import orderController from "../controllers/orderController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create order
router.post("/", authenticate, authorize("USER"), orderController.createOrder);

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
  orderController.updateOrderStatus
);

// Cancel order
router.patch("/:orderId/cancel", authenticate, orderController.cancelOrder);

// Add rating
router.post(
  "/:orderId/rating",
  authenticate,
  authorize("USER"),
  orderController.addRating
);

export default router;
