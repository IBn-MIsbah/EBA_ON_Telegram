import { Response } from "express";
import { AppError } from "../utils/AppError.js";
import { Order } from "../models/Order.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const OrderController = {
  getOrders: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { role } = req.user as { role: string };
      let query: any = {};

      switch (role) {
        case "AMIR":
        case "VICEAMIR":
          query.userGender = "MALE";
          break;
        case "AMIRA":
        case "VICEAMIRA":
          query.userGender = "FEMALE";
          break;
        case "ADMIN":
          break;
        default:
          return res.status(403).json({ message: "Access denied" });
      }

      const orders = await Order.find(query)
        .populate("products.productId")
        .sort({ createdAt: -1 })
        .select("-__v");

      if (orders.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No Order found.",
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: "Available Orders",
        data: orders,
      });
    } catch (err) {
      AppError("GET /orders", res, err);
    }
  },
};
