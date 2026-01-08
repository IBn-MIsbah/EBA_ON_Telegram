import { Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { Order } from "../models/Order.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { telegramBot } from "../bot/bot.js";

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

  verifyOrder: async (req: Request, res: Response) => {
    const { orderId } = req.params;
    try {
      const order = await Order.findById(orderId).populate(
        "products.productId"
      );
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      if (order.status === "verified") {
        return res.status(400).json({
          success: false,
          message: "Order is Already verified",
        });
      }

      for (const items of order.products) {
        const product = await Product.findById(items.productId);
        if (product) {
          if (product.stock < items.quantity) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock for ${product.name}. Current: ${product.stock}`,
            });
          }

          product.stock -= items.quantity;
          await product.save();
        }
      }

      order.status = "verified";
      await order.save();

      const user = await User.findById(order.userId);
      if (user && user.telegramUserId) {
        const message =
          `✅ *Payment Verified!*\n\n` +
          `Your order *${order.orderNumber}* has been confirmed.\n` +
          `We are preparing your items for delivery. 🚀`;

        await telegramBot.sendMessage(user.telegramUserId, message);
      }

      return res.status(200).json({
        success: true,
        message: "Order verified and stock update successfully",
      });
    } catch (err) {
      AppError("PATCH /orders/verify/orderId", res, err);
    }
  },
};
