import { Request, Response } from "express";
import { loginInputSchema } from "../schema/authSchema.js";
import { AppError } from "../utils/AppError.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import {
  generateTokens,
  setAuthCookies,
  verifyRefreshToken,
} from "../utils/token.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const AuthController = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = loginInputSchema.parse(req.body);

      const user = await User.findOne({
        email: email,
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "Incorrect username or password",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Incorrect username or password",
        });
      }
      const token = generateTokens(user._id.toString(), user.role);

      await User.findByIdAndUpdate(user._id, {
        refreshToken: token.refreshToken,
      });

      setAuthCookies(res, {
        refreshToken: token.refreshToken,
        accessToken: token.accessToken,
      });

      return res.status(200).json({
        seccess: true,
        message: "Login seccessfully",
        role: user.role,
        isActive: user.isActive,
      });
    } catch (error) {
      AppError("POST /login", res, error);
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.cookies;

      if (refreshToken) {
        await User.updateOne(
          { refreshToken: refreshToken },
          { refreshToken: null }
        );
      }

      res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .status(200)
        .json({
          success: true,
          message: "Logged Out",
        });
    } catch (error) {
      AppError("POST /logout", res, error);
    }
  },

  me: async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
      const user = await User.findById(req.user.id).select(
        "-__v -password -refreshToken"
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          messege: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      AppError("GET /me", res, error);
    }
  },

  refreshToken: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return res.status(401).json({
          message: "No refresh token provided",
        });
      }

      const decode = verifyRefreshToken(refreshToken);
      if (!decode || typeof decode === "string") {
        return res.status(401).json({
          message: "Invalid or expired refresh tokne",
        });
      }

      const { id } = decode as { id: string; role: string };
      const user = await User.findById(id);

      if (!user) {
        await User.updateOne({ _id: id }, { refreshToken: null });
        return res.status(403).json({
          message: "Refresh token is revoked or user is inactive",
        });
      }

      const newTokens = generateTokens(String(user._id), user.role);

      setAuthCookies(res, {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      });

      return res.json({ message: "Token refreshed successfully" });
    } catch (error) {
      AppError("POST /refresh-token", res, error);
    }
  },
};
