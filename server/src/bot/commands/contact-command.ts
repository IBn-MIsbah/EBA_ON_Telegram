import { User } from "../../models/User.js";
import { telegramBot } from "../bot.js";

export const setupContact = () => {
  telegramBot.on("contact", async (msg) => {
    const chatId = msg.chat.id;
    const contact = msg.contact;
    if (!contact) return;

    const phone = contact.phone_number;
    const name = contact.first_name || msg.from?.first_name || "User";
    const telegramUserId = String(contact.user_id || msg.from?.id);

    try {
      await User.findOneAndUpdate(
        { telegramUserId: telegramUserId },
        {
          name,
          phone,
          telegramUserId,
          $setOnInsert: { role: "USER" },
        },
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
        `✅ *Contact Received!*\n\nThanks ${name}! To provide you with the best experience, please select your department:`,
        { parse_mode: "Markdown", ...genderOptions }
      );
    } catch (err) {
      console.error("Contact handler error:", err);
      telegramBot.sendMessage(
        chatId,
        "❌ Failed to save contact. Please try /start again."
      );
    }
  });

  // 2. COMMAND: User types /contact (Support Flow)
  telegramBot.onText(/\/contact/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramUserId = String(msg.from?.id);

    try {
      const user = await User.findOne({ telegramUserId }).select("gender");

      if (!user || !user.gender) {
        return telegramBot.sendMessage(
          chatId,
          "⚠️ *Not Registered*\n\nPlease use the /start command to register your profile first.",
          { parse_mode: "Markdown" }
        );
      }

      // Find the appropriate moderator based on gender
      let moderator = null;
      if (user.gender === "MALE") {
        moderator = await User.findOne({ role: "AMIR" }).select("phone name");
      } else if (user.gender === "FEMALE") {
        moderator = await User.findOne({ role: "AMIRA" }).select("phone name");
      }

      // Fallback to Admin if specific gender moderator isn't found
      if (!moderator || !moderator.phone) {
        moderator = await User.findOne({ role: "ADMIN" }).select("phone name");
      }

      if (!moderator || !moderator.phone) {
        return telegramBot.sendMessage(
          chatId,
          "📍 Support contact is currently unavailable."
        );
      }

      const response =
        `📞 *Help & Support*\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `Representative: *${moderator.name || "Moderator"}*\n` +
        `Phone: [${moderator.phone}](tel:${moderator.phone.replace(
          /\s/g,
          ""
        )})\n\n` +
        `_Tap the number to call directly._`;

      await telegramBot.sendMessage(chatId, response, {
        parse_mode: "Markdown",
      });
    } catch (err) {
      console.error("Error in /contact command: ", err);
      telegramBot.sendMessage(
        chatId,
        "❌ Something went wrong while fetching contact info."
      );
    }
  });
};
