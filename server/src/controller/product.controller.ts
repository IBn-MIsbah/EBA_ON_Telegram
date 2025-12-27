import { Request, response, Response } from "express";
import { AppError } from "../utils/AppError.js";
import {
  productCreateInputSchema,
  ProductUpdateInput,
  productUpdateInputSchema,
  productWhereUniqueInput,
} from "../schema/productSchema.js";
import { Product } from "../models/Product.js";
import path from "node:path";
import fs from "fs";

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

      return res.status(201).json({
        success: true,
        message: "Product created successfully!",
        data: newProduct,
      });
    } catch (error) {
      AppError("POST /product", res, error);
    }
  },

  getProduct: async (req: Request, res: Response) => {
    try {
      const products = await Product.find().select("-__v");

      return res.status(200).json({
        success: true,
        message: "List of all available Products",
        data: products,
      });
    } catch (error) {
      AppError("GET /product", res, error);
    }
  },

  getProductById: async (req: Request, res: Response) => {
    try {
      const { id } = productWhereUniqueInput.parse(req.params);

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Product by id",
        data: product,
      });
    } catch (error) {
      AppError("GET /product/:id", res, error);
    }
  },

  updateProduct: async (req: Request, res: Response) => {
    try {
      const { id } = productWhereUniqueInput.parse(req.params);
      const { name, describtion, price, isAvailable, stock } =
        productUpdateInputSchema.parse(req.body);

      const oldProduct = await Product.findById(id);

      if (!oldProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const updateData: ProductUpdateInput = {
        name,
        describtion,
        price,
        isAvailable,
        stock,
      };
      if (req.file && oldProduct.imageUrl) {
        const oldFilePath = path.join(process.cwd(), oldProduct.imageUrl);

        if (fs.existsSync(oldFilePath)) {
          fs.unlink(oldFilePath, (err) => {
            if (err) console.error("Failed to delete old image: ", err);
            else
              console.log(
                "Old image deleted successfully: ",
                oldProduct.imageUrl
              );
          });
        }

        updateData.imageUrl = `/public/uploads/${req.file?.filename}`;
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Product updated successfully!",
        data: updatedProduct,
      });
    } catch (error) {
      AppError("PUT /product/:id", res, error);
    }
  },

  deleteProduct: async (req: Request, res: Response) => {
    try {
      const { id } = productWhereUniqueInput.parse(req.params);

      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (deletedProduct.imageUrl) {
        const relativePath = deletedProduct.imageUrl.startsWith("/")
          ? deletedProduct.imageUrl.substring(1)
          : deletedProduct.imageUrl;

        const imagePath = path.join(process.cwd(), relativePath);

        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) console.error("Disk cleanup failed: ", err);
            else console.log("Image removed from server: ", relativePath);
          });
        }
      }

      // 5. Send Success Response
      return res.status(200).json({
        success: true,
        message: "Product and associated image deleted successfully!",
        data: deletedProduct,
      });
    } catch (error) {
      AppError("DELETE /product/:id", res, error);
    }
  },
};
