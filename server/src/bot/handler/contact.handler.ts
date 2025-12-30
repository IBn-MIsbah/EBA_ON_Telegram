import { telegramBot } from "../bot.js";
import { UserService } from "../services/user.service.js";
import { CommonKeyboards } from "../keyboards/common.keyboard.js";

export function setupContactHandler() {
  telegramBot.on("contact", async (msg) => {
    const chatId = msg.chat.id;
    if (!chatId) return;

    const phone = msg.contact?.phone_number;
    const name = msg.contact?.first_name || msg.from?.first_name || "Unknown";
    const telegramUserId = String(msg.contact?.user_id || msg.from?.id);

    if (!phone) return;
    if (!telegramUserId || telegramUserId === "undefined")
      throw new Error("Telegram User_id is missing");

    try {
      await UserService.findOrCreate(telegramUserId, { name, phone });

      const genderOptions = {
        reply_markup: {
          inline_keyboard: CommonKeyboards.getGenderKeyboard(telegramUserId),
        },
      };

      await telegramBot.sendMessage(
        chatId,
        `Thanks ${name}! One last step.\nPlease select your gender:`,
        genderOptions
      );
    } catch (error) {
      console.error("Contact handler error:", error);
      telegramBot.sendMessage(
        chatId,
        "❌ Something went wrong. Please try /start again."
      );
    }
  });
}
