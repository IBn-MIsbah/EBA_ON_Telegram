import { Application, Request, Response } from "express";
import TelegramBot from "node-telegram-bot-api";
import {
  isProduction,
  TG_WEBHOOK_SECRET,
  WEBHOOK_URL,
} from "../common/index.js";

export const setupTelegramWebhook = (app: Application, bot: TelegramBot) => {
  if (isProduction) {
    const webhookPath = `/webhook/telegram/${TG_WEBHOOK_SECRET}`;
    const webhookUrl = `${WEBHOOK_URL}${webhookPath}`;

    bot
      .setWebHook(webhookUrl)
      .then((_) => console.log("Webhook set to: ", webhookUrl))
      .catch(console.error);

    app.post(webhookPath, (req: Request, res: Response) => {
      bot.processUpdate(req.body);
      res.sendStatus(200);
    });

    console.log(`Telegram webhook configured at: ${webhookPath}`);
  } else {
    console.log("Development mode: Using polling instead of webhook");
  }

  app.get("/webhook/test", (req: Request, res: Response) => {
    res.status(200).json({
      telegram: "webhook active",
      path: `/webhook/telegram/${TG_WEBHOOK_SECRET}`,
      mode: process.env.NODE_ENV,
    });
  });
};
