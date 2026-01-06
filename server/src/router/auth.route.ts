import { Router } from "express";
import { AuthController } from "../controller/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router
  .post("/login", AuthController.login)
  .post("/logout", AuthController.logout)
  .get("/me", authenticateUser, AuthController.me)
  .post("/refresh-token", AuthController.refreshToken)
  .patch("/update/:id", authenticateUser, AuthController.update);

export default router;
