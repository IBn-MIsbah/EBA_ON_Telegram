import { telegramBot } from "../bot.js";
import { UserService } from "../services/user.service.js";
import { ProductKeyboards } from "../keyboards/product.keyboard.js";

export function setupProductsCommand() {
  telegramBot.onText(/\/products/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await UserService.findByTelegramId(String(msg.from?.id));
      if (!user) {
        return telegramBot.sendMessage(
          chatId,
          "Please register first using /start command."
        );
      }

      const options = {
        reply_markup: {
          inline_keyboard: ProductKeyboards.getProductMethodKeyboard(),
        },
      };

      await telegramBot.sendMessage(
        chatId,
        `🛒 Welcome to EBA Store Products!\n\nHow would you like to view our products?`,
        options
      );
    } catch (error) {
      console.error("Products command error:", error);
      telegramBot.sendMessage(
        chatId,
        "❌ Error loading products. Please try again."
      );
    }
  });
}
