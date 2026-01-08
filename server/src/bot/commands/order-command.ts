import { Order } from "../../models/Order.js";
import { User } from "../../models/User.js";
import { telegramBot } from "../bot.js";

export const setupOrderCommand = () => {
  telegramBot.onText(/\/order/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramUserId = String(msg.from?.id);

    try {
      // 1. Find the user
      const user = await User.findOne({ telegramUserId });
      if (!user) {
        return telegramBot.sendMessage(
          chatId,
          "❌ *Profile Not Found*\nPlease use /start to register before checking orders.",
          { parse_mode: "Markdown" }
        );
      }

      // 2. Find the most recent order (populated with product names)
      const latestOrder: any = await Order.findOne({ userId: user._id })
        .sort({ createdAt: -1 }) // Get the newest one first
        .populate("products.productId");

      if (!latestOrder) {
        return telegramBot.sendMessage(
          chatId,
          "📦 *No Orders Found*\nYou haven't placed any orders yet. Use /products to browse!",
          { parse_mode: "Markdown" }
        );
      }

      // 3. Format Order Status Text
      const statusEmojis: Record<string, string> = {
        awaiting_payment: "⏳ Awaiting Payment",
        payment_received: "💳 Payment Received (Verifying)",
        verified: "✅ Verified & Preparing",
        cancelled: "❌ Cancelled",
      };

      const productList = latestOrder.products
        .map((p: any) => `• ${p.productId?.name || "Product"} x${p.quantity}`)
        .join("\n");

      let rejectionSection = "";
      if (latestOrder.status === "cancelled" && latestOrder.adminNotes) {
        rejectionSection = `\n⚠️ *Reason for Rejection:*\n_${latestOrder.adminNotes}_\n`;
      }

      const message =
        `📄 *Your Latest Order*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `🔢 *Order:* \`${latestOrder.orderNumber}\` \n` +
        `📅 *Date:* ${new Date(latestOrder.createdAt).toLocaleDateString()}\n` +
        `📍 *Status:* ${
          statusEmojis[latestOrder.status] || latestOrder.status
        }\n` +
        rejectionSection + // Insert the reason here if it exists
        `\n🛒 *Items:*\n${productList}\n\n` +
        `💰 *Total Amount:* $${latestOrder.totalAmount.toFixed(2)}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `_Need help? Use /contact to reach us._`;

      await telegramBot.sendMessage(chatId, message, {
        parse_mode: "Markdown",
      });
    } catch (err) {
      console.error("Error in /order command:", err);
      telegramBot.sendMessage(
        chatId,
        "❌ An error occurred while fetching your order details."
      );
    }
  });
};
