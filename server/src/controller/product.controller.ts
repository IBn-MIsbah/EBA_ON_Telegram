import { Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { productCreateInputSchema } from "../schema/productSchema.js";
import { Product } from "../models/Product.js";

export const ProductController = {
  create: async (req: Request, res: Response) => {
    try {
      const { name, description, price, stock, isAvailable } =
        productCreateInputSchema.parse(req.body);

      if (!req.file) {
        return res.status(400).json({ message: "Please Upload a file" });
      }

      const imageUrl = `/public/uploads/${req.file.filename}`;

      const newProduct = await Product.create({
        name: name,
        description: description,
        imageUrl: imageUrl,
        price: price,
        stock: stock,
        isAvailable: isAvailable,
      });

      return res.status(200).json({
        success: true,
        message: "Product created successfully!",
        data: newProduct,
      });
    } catch (error) {
      AppError("POST /product", res, error);
    }
  },
};
