import { Router } from "express";
import { ProductController } from "../controller/product.controller.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router
  .post("/", upload.single("image"), ProductController.create)
  .get("/", ProductController.getProduct)
  .get("/:id", ProductController.getProductById)
  .patch("/:id", upload.single("image"), ProductController.updateProduct)
  .delete("/:id", ProductController.deleteProduct);

export default router;
