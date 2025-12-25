import { Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { userCreateInputSchema } from "../schema/userSchema.js";
import { User } from "../models/User.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const UserController = {
  create: async (req: Request, res: Response) => {
    try {
      const { name, phone, role, telegramUserId } = userCreateInputSchema.parse(
        req.body
      );
      const user = await User.create({
        name,
        phone,
        role,
        telegramUserId,
      });

      return res.status(201).json({
        success: true,
        message: "User Created Successfully",
        data: user,
      });
    } catch (error) {
      AppError("POST /user", res, error);
    }
  },
  getAll: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { role } = req.user as { role: string };

      let query: any = {};

      switch (role) {
        case "AMIR":
        case "VICEAMIR":
          query.gender = "MALE";
          query.role = "USER";
          break;
        case "AMIRA":
        case "VICEAMIRA":
          query.gender = "FEMALE";
          query.role = "USER";
          break;
        case "ADMIN":
          break;
        default:
          query.role = "USER";
      }

      const users = await User.find(query).select(
        "-password -refreshToken -__v"
      );

      return res.status(200).json({
        success: true,
        message: `User list retrieved for role: ${role}`,
        count: users.length,
        data: users,
      });
    } catch (error) {
      AppError("GET /users", res, error);
    }
  },
};
