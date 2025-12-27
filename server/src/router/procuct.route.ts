import { Router } from "express";
import { ProductController } from "../controller/product.controller.js";
import { upload } from "../middleware/upload.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router
  .post("/", authenticateUser, upload.single("image"), ProductController.create)
  .get("/", authenticateUser, ProductController.getProduct)
  .get("/:id", authenticateUser, ProductController.getProductById)
  .patch(
    "/:id",
    authenticateUser,
    upload.single("image"),
    ProductController.updateProduct
  )
  .delete("/:id", authenticateUser, ProductController.deleteProduct);

export default router;
