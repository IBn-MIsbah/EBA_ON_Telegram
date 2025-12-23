import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router
  .get("/", authenticateUser, UserController.getAll)
  .post("/", authenticateUser, UserController.create);
export default router;
