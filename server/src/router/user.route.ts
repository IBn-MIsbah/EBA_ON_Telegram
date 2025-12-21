import { Router } from "express";
import { UserController } from "../controller/user.controller.js";

const router = Router();

router.get("/", UserController.getAll).post("/", UserController.create);
export default router;
