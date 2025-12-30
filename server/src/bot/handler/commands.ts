import { telegramBot } from "../index.js";
import { productBrowsingStates } from "../helpers.js";
import { Cart } from "../../models/Cart.js";

export const handleStart = (msg: any) => {
  const options = {
    reply_markup: {
      one_time_keyboard: true,
      resize_keyboard: true,
      keyboard: [
        [{ text: "📱 Register with Phone Number", request_contact: true }],
      ],
    },
  };
  telegramBot.sendMessage(
    msg.chat.id,
    `Hello ${msg.from?.first_name}!\nWelcome to EBA Store.`,
    options
  );
};

export const handleViewCart = async (msg: any) => {
  const telegramUserId = String(msg.from?.id);
  try {
    const cart = await Cart.findOne({ telegramUserId }).populate(
      "items.productId"
    );
    if (!cart || cart.items.length === 0) {
      return telegramBot.sendMessage(msg.chat.id, "🛒 Your cart is empty.");
    }

    let total = 0;
    let summary = "🛒 *Your Shopping Cart:*\n━━━━━━━━━━━━━━━\n";

    cart.items.forEach((item: any) => {
      const subtotal = item.productId.price * item.quantity;
      total += subtotal;
      summary += `🔹 *${item.productId.name}*\n   ${
        item.quantity
      } x $${item.productId.price.toFixed(2)} = *$${subtotal.toFixed(2)}*\n`;
    });

    summary += `━━━━━━━━━━━━━━━\n💰 *Total: $${total.toFixed(2)}*`;

    telegramBot.sendMessage(msg.chat.id, summary, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "💳 Checkout", callback_data: "CHECKOUT" }],
          [{ text: "🗑 Clear Cart", callback_data: "CLEAR_CART" }],
        ],
      },
    });
  } catch (err) {
    telegramBot.sendMessage(msg.chat.id, "❌ Error loading cart.");
  }
};

export const handleClear = async (msg: any) => {
  try {
    await telegramBot.deleteMessage(msg.chat.id, msg.message_id);
    const response = await telegramBot.sendMessage(
      msg.chat.id,
      "Cleaning up..."
    );
    setTimeout(
      () => telegramBot.deleteMessage(msg.chat.id, response.message_id),
      3000
    );
  } catch (e) {
    console.error(e);
  }
};
