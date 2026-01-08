import { Response } from "express";
import { ZodError } from "zod";
import { isProduction } from "../common/index.js";

/**
 *
 * @param route Route path
 * @param res Express response object
 * @param error Error object
 */
export const AppError = (route: string, res: Response, error: any) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let details = error instanceof Error ? error.message : error;

  // Handle Zod Validation Errors (400)
  if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation Failed";
    details = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }

  // Handle Custom Operational Errors (Optional)
  if (error.statusCode) {
    statusCode = error.statusCode;
  }
  isProduction ? null : console.error(`[${route}] Error:`, error);

  res.status(statusCode).json({
    success: false,
    message: message,
    route: route,
    error: process.env.NODE_ENV === "development" ? details : undefined,
  });
};
