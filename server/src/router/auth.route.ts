import { Router } from "express";
import { AuthController } from "../controller/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router
  .post("/login", AuthController.login)
  .post("/logout", AuthController.logout)
  .get("/me", AuthController.me)
  .post("/refresh-token", authenticateUser, AuthController.refreshToken);
//.post('/update') // update credential

export default router;
