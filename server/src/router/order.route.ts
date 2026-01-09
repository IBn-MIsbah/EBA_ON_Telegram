import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { OrderController } from "../controller/order.controller.js";

const router = Router();

router
  .get("/", authenticateUser, OrderController.getOrders)
  .get("/:orderId", authenticateUser, OrderController.getOrderById)
  .patch("/verify/:orderId", authenticateUser, OrderController.verifyOrder)
  .patch("/reject/:orderId", authenticateUser, OrderController.rejectOrder);

export default router;
