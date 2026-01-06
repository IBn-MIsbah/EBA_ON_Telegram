import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { OrderController } from "../controller/order.controller.js";

const router = Router();

router
  .get("/", authenticateUser, OrderController.getOrders)
  .patch("/verify/:orderId", authenticateUser, OrderController.verifyOrder);

export default router;
