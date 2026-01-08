import { telegramBot } from "../bot.js";
import { HandleProductDisplayMethod } from "../helper/HandleProductDisplayMethod.js";
import { HandleCartItem } from "../helper/HandleCartItem.js";
import { User } from "../../models/User.js";
import { Order } from "../../models/Order.js";

export const setupMessageCommand = () => {
  telegramBot.on("message", async (msg) => {
    // Ignore commands (starts with /) so they don't double-trigger
    if (!msg.text || msg.text.startsWith("/")) return;

    const chatId = msg.chat.id;
    const text = msg.text;
    const telegramUserId = msg.from?.id;

    try {
      switch (text) {
        case "🛍 Browse Products":
          // Trigger the initial browsing method selection
          await HandleProductDisplayMethod(
            chatId,
            undefined,
            "browse",
            telegramBot
          );
          break;

        case "🛒 View Cart":
          if (telegramUserId) {
            await HandleCartItem(chatId, telegramUserId, telegramBot);
          }
          break;

        case "📋 My Orders":
          if (telegramUserId) {
            // Reusing the logic from your setupOrderCommand
            const user = await User.findOne({
              telegramUserId: String(telegramUserId),
            });
            const latestOrder = await Order.findOne({ userId: user?._id }).sort(
              { createdAt: -1 }
            );

            if (!latestOrder) {
              await telegramBot.sendMessage(
                chatId,
                "📦 You haven't placed any orders yet."
              );
            } else {
              // Note: You can call your order display helper here
              await telegramBot.sendMessage(
                chatId,
                `📄 Latest Order: ${latestOrder.orderNumber}\nStatus: ${latestOrder.status}`
              );
            }
          }
          break;

        case "📞 Contact Support":
          // Reusing logic from setupContact command
          const user = await User.findOne({
            telegramUserId: String(telegramUserId),
          });
          let contactPhone = "Please contact our main office.";

          if (user?.gender === "MALE") {
            const amir = await User.findOne({ role: "AMIR" });
            contactPhone = amir?.phone || contactPhone;
          } else if (user?.gender === "FEMALE") {
            const amira = await User.findOne({ role: "AMIRA" });
            contactPhone = amira?.phone || contactPhone;
          }

          await telegramBot.sendMessage(
            chatId,
            `📞 Representative Contact: ${contactPhone}`
          );
          break;
      }
    } catch (err) {
      console.error("Message Command Router Error:", err);
    }
  });
};
