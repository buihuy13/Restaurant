import express from "express";
import orderController from "../controllers/orderController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create order
router.post("/", authenticate, orderController.createOrder);

export default router;
