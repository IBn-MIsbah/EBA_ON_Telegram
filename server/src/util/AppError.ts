import { Response } from "express";

export const AppError = (route: string, res: Response, error: any) => {
  res.status(500).json({
    success: false,
    message: "Internal Sever Error",
    route: route,
    Error: error instanceof Error ? error.message : error,
  });
};
