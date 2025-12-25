import { Router } from "express";
import { ProductController } from "../controller/product.controller.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/", upload.single("image"), ProductController.create);

export default router;
