import { User } from "../../models/User.js";
import { Order } from "../../models/Order.js";
import { telegramBot } from "../bot.js";

export const setupDeleteCommand = async () => {
  telegramBot.onText(/\/delete/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const telegramUserId = String(msg.from?.id);

      const user = await User.findOne({ telegramUserId });

      if (!user) {
        return telegramBot.sendMessage(chatId, "❌ *Record Not Found*", {
          parse_mode: "Markdown",
        });
      }

      // 1. Safety Check for Pending Orders
      const pendingOrder = await Order.findOne({
        userId: user._id,
        status: { $in: ["awaiting_payment", "payment_received"] },
      });

      if (pendingOrder) {
        return telegramBot.sendMessage(
          chatId,
          `⚠️ *Active Order Detected*\nYou cannot delete your profile while order \`${pendingOrder.orderNumber}\` is in progress.`,
          { parse_mode: "Markdown" }
        );
      }

      // 2. Show Confirmation Buttons
      const keyboard = {
        inline_keyboard: [
          [
            { text: "✅ Yes, Delete", callback_data: "DELETE_CONFIRM" },
            { text: "❌ No, Cancel", callback_data: "DELETE_CANCEL" },
          ],
        ],
      };

      await telegramBot.sendMessage(
        chatId,
        "🚨 *Final Warning*\n\nThis will permanently delete your profile and shopping cart. Active order history will remain in our archives for accounting.\n\n*Are you sure?*",
        { parse_mode: "Markdown", reply_markup: keyboard }
      );
    } catch (err) {
      console.error("Error in delete command:", err);
    }
  });
};
