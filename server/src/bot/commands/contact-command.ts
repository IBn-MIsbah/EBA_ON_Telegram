import { User } from "../../models/User.js";
import { telegramBot } from "../bot.js";

export const setupContact = () => {
  telegramBot.on("contact", async (msg) => {
    const chatId = msg.chat.id;
    if (!chatId) return;

    const phone = msg.contact?.phone_number;
    const name = msg.contact?.first_name || msg.from?.first_name || "Unknown";
    const telegramUserId = String(msg.contact?.user_id || msg.from?.id);

    if (!phone) return;
    if (!telegramUserId || telegramUserId === "undefined")
      throw new Error("Telegram user_id is missing");

    try {
      await User.findOneAndUpdate(
        { telegramUserId: telegramUserId },
        { name, phone, telegramUserId, role: "USER" },
        { upsert: true, new: true }
      );

      const genderOptions = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Male 👨", callback_data: `GEN_M|${telegramUserId}` },
              { text: "Female 👩", callback_data: `GEN_F|${telegramUserId}` },
            ],
          ],
        },
      };
      await telegramBot.sendMessage(
        chatId,
        `Thanks ${name}! One last step.\nPlease select your gender:`,
        genderOptions
      );
    } catch (err) {
      console.error("Contact handler error:", err);
      telegramBot.sendMessage(
        chatId,
        "❌ Something went wrong. Please try /start again."
      );
    }
  });
};
