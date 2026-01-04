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
      }

      const orders = await Order.find(query)
        .populate("user", "phone")
        .select("-__v");
      if (!orders) {
        return res.status(404).json({
          message: "No Order found.",
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
