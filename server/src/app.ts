import "dotenv/config";
import express, { Request, Response, Application, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dbConnection from "./config/dbConfig.js";

//========= Routes ==============
import userRouter from "./router/user.route.js";
import authRouter from "./router/auth.route.js";

import { isProduction } from "./common/index.js";
import { setupTelegramWebhook } from "./telegram/webhook.js";
import { telegramBot } from "./telegram/bot.js";
import cookieParser from "cookie-parser";

//========= Database connection ============
dbConnection();

//=============== Constants ================
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "5000");
const apiPrefix = "/api/v1";

const BASE_URL = isProduction ? process.env.BASE_URL : "http://loalhost:5371";

//================== Middleware config ===============
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: BASE_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

app.use(limiter);

//============== Telegram Routes ===========
setupTelegramWebhook(app, telegramBot);

//============== Web Routes ================
app.use(`${apiPrefix}/users`, userRouter);
app.use(`${apiPrefix}/auth`, authRouter);

//============= API Health check =================
app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Health check passed",
    timestamp: new Date().toISOString(),
  });
});

//================  404 handler ===============
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

//================ Global Error Handler ============
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("Server Error: ", err);
  res.status(500).json({
    error: "Internal server error",
    message: isProduction ? undefined : err.message,
  });
});

//============= server =================
app.listen(PORT, () => {
  console.log(
    `Server running in ${isProduction ? "PRODUCTION" : "DEVELOPMENT"} mode`
  );
  console.log(`server running on http://localhost:${PORT}`);
});

export { app };
