import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN, isProduction } from "../common/index.js";
import { setupStartCommand } from "./commands/start-command.js";
import { setupContact } from "./commands/contact-command.js";
import { callbackHandler } from "./handler/callback-handler.js";
import { setupProductCommand } from "./commands/product-command.js";
import { setupCartCommand } from "./commands/cart-command.js";
import { CheckoutHandler } from "./handler/chechout-handler.js";

if (!BOT_TOKEN) {
  throw new Error("Telegram Bot token is not defined in .env");
}

export const telegramBot = new TelegramBot(BOT_TOKEN, {
  polling: !isProduction,
});

export const setupBot = () => {
  setupStartCommand();
  setupContact();
  setupProductCommand();
  setupCartCommand();

  callbackHandler();
  CheckoutHandler();

  setupBotError();
  setupBotCommands();
};

export const setupBotError = async () => {
  telegramBot.on("polling_error", (err) => {
    console.error(`[Polling Error] ; `, err);
  });
};
export const setupBotCommands = () => {
  telegramBot.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "products", description: "Browse products" },
    { command: "cart", description: "Show cart" },
  ]);
};
