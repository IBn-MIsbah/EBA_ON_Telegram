import express, { Request, Response, Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

//=============== Constants ================
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "3000");
const apiPrefix = "/api/v1";

const isProduction = process.env.NODE_ENV === "production";
const BASE_URL = isProduction ? process.env.BASE_URL : "http://loalhost:5371";

//================== Middleware config ===============
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

//============= server =================
app.listen(PORT, () => {
  console.log(
    `Server running in ${isProduction ? "PRODUCTION" : "DEVELOPMENT"} mode`
  );
  console.log(`server running on http://localhost:${PORT}`);
});
