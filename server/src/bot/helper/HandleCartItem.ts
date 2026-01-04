import TelegramBot, { InlineKeyboardButton } from "node-telegram-bot-api";
import { Cart } from "../../models/Cart.js";

export const HandleCartItem = async (
  chatId: number,
  telegramUserId: number,
  telegramBot: TelegramBot
) => {
  try {
    const cart = await Cart.findOne({
      telegramUserId: String(telegramUserId),
    })
      .populate({ path: "items.productId" })
      .select("-__v");

    if (!cart || cart.items.length === 0) {
      telegramBot.sendMessage(chatId, "🛒 Your cart is currently empty.");
    }

    let total = 0;

    let message = "🛒 *Your Shopping Cart*\n━━━━━━━━━━━━━━━━\n";

    cart?.items.forEach((item: any, index: number) => {
      const product = item.productId;
      if (product && typeof product.price === "number") {
        const subtotal = product.price * item.quantity;
        total += subtotal;
        message += `${index + 1}. *${product.name}*\n   ${
          item.quantity
        } x $${product.price.toFixed(2)} = *$${subtotal.toFixed(2)}*\n`;
      } else {
        message += `${index + 1}. *[Product No Longer Available]*\n`;
      }
    });
    message += `━━━━━━━━━━━━━━━━\n💰 *Total: $${total.toFixed(2)}*`;

    const keyboard: InlineKeyboardButton[][] = [
      [
        { text: "💳 Checkout", callback_data: "CART_CHECKOUT" },
        { text: "🗑 Clear Cart", callback_data: "CART_CLEAR" },
      ],
      [{ text: "🛍 Continue Shopping", callback_data: "PRODUCT_METHOD|browse" }],
    ];

    await telegramBot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: keyboard },
    });
  } catch (err) {
    console.error("Cart retrieval error:", err);
    telegramBot.sendMessage(chatId, "❌ Error loading your cart.");
  }
};

export const ClearCartItem = async (
  chatId: number,
  telegramUserId: string,
  telegramBot: TelegramBot,
  queryId?: string
) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { telegramUserId: telegramUserId },
      { $set: { items: [] } },
      { new: true }
    );

    if (!cart) {
      await telegramBot.sendMessage(
        chatId,
        "🛒 You don't have an active cart to clear."
      );
    }

    await telegramBot.sendMessage(
      chatId,
      "🗑 Your cart has been cleared successfully."
    );

    if (queryId) {
      await telegramBot.answerCallbackQuery(queryId, { text: "Cart cleared" });
    }
  } catch (err) {
    console.log("Clear cart Error: ", err);
    await telegramBot.sendMessage(
      chatId,
      "❌ Failed to clear cart. Please try again."
    );
  }
};
