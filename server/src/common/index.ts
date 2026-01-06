export const isProduction = process.env.NODE_ENV === "production";
export const BOT_TOKEN = process.env.BOT_TOKEN as string;
export const TG_WEBHOOK_SECRET =
  (process.env.TG_WEBHOOK_SECRET as string) || "okmnjiuhb";
export const WEBHOOK_URL = process.env.WEBHOOK_URL as string;
export const SALT_ROUND = process.env.SALT_ROUND as string;
