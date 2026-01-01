import { SendMessageOptions } from "node-telegram-bot-api";
import { User } from "../../models/User.js";
import { telegramBot } from "../bot.js";

export const setupProductCommand = () => {
  telegramBot.onText(/\/product/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramUserId = msg.from?.id;

    try {
      const user = await User.findOne({
        telegramUserId: String(telegramUserId),
      });

      if (!user) {
        return telegramBot.sendMessage(
          chatId,
          "Please register first using /start command."
        );
      }

      const options: SendMessageOptions = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📦 Send All Products",
                callback_data: "PRODUCT_METHOD|all",
              },
              {
                text: "➡️ Browse One by One",
                callback_data: "PRODUCT_METHOD|browse",
              },
            ],
          ],
        },
      };

      await telegramBot.sendMessage(
        chatId,
        `🛒 Welcome to EBA Store Products!`,
        options
      );
    } catch (err) {
      console.error("Products command error: ", err);
      telegramBot.sendMessage(
        chatId,
        "❌ Error loading products. Please try again."
      );
    }
  });
};
