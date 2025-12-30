import { telegramBot } from "../bot.js";
import { CartService } from "../services/cart.service.js";
import { CommonKeyboards } from "../keyboards/common.keyboard.js";

export function setupCartCommand() {
  telegramBot.onText(/\/cart/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramUserId = String(msg.from?.id);

    try {
      const cart = await CartService.getCartWithProducts(telegramUserId);
      if (!cart || cart.items.length === 0) {
        return telegramBot.sendMessage(chatId, "🛒 Your cart is empty.");
      }

      const summary = CartService.formatCartSummary(cart);

      const options = {
        parse_mode: "Markdown" as const,
        reply_markup: {
          inline_keyboard: CommonKeyboards.getCartKeyboard(),
        },
      };

      await telegramBot.sendMessage(chatId, summary, options);
    } catch (err) {
      console.error("View cart error:", err);
      telegramBot.sendMessage(chatId, "❌ Could not load cart.");
    }
  });
}
