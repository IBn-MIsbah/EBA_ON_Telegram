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
    }).populate({ path: "items.productId" });

    // FIX: Added return to stop execution if empty
    if (!cart || cart.items.length === 0) {
      return telegramBot.sendMessage(
        chatId,
        "🛒 Your cart is currently empty."
      );
    }

    let total = 0;
    const keyboard: InlineKeyboardButton[][] = [];

    let message = "🛒 *Your Shopping Cart*\n━━━━━━━━━━━━━━━━\n";

    cart.items.forEach((item: any, index: number) => {
      const product = item.productId;
      if (product) {
        const subtotal = product.price * item.quantity;
        total += subtotal;

        message += `${index + 1}. *${product.name}*\n   ${
          item.quantity
        } x $${product.price.toFixed(2)} = *$${subtotal.toFixed(2)}*\n`;

        // Add a button for THIS specific item
        keyboard.push([
          {
            text: `❌ Remove ${product.name}`,
            callback_data: `CART_REMOVE_ITEM|${product._id}`,
          },
        ]);
      }
    });

    message += `━━━━━━━━━━━━━━━━\n💰 *Total: $${total.toFixed(2)}*`;

    // General Actions
    keyboard.push([
      { text: "💳 Checkout", callback_data: "CART_CHECKOUT" },
      { text: "🗑 Clear All", callback_data: "CART_CLEAR" },
    ]);
    keyboard.push([
      { text: "🛍 Continue Shopping", callback_data: "PRODUCT_REFRESH" },
    ]);

    await telegramBot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: keyboard },
    });
  } catch (err) {
    console.error("Cart retrieval error:", err);
    telegramBot.sendMessage(chatId, "❌ Error loading your cart.");
  }
};

export const RemoveCartItem = async (
  chatId: number,
  telegramUserId: string,
  telegramBot: TelegramBot,
  productId?: string // Optional: if provided, only deletes that item
) => {
  try {
    let update;
    if (productId) {
      // Remove specific product from array
      update = { $pull: { items: { productId: productId } } };
    } else {
      // Clear whole array
      update = { $set: { items: [] } };
    }

    await Cart.findOneAndUpdate({ telegramUserId }, update);

    const msg = productId ? "❌ Item removed." : "🗑 Cart cleared.";

    // Refresh the cart view so the user sees the new list
    await telegramBot.sendMessage(chatId, msg);
    return HandleCartItem(chatId, Number(telegramUserId), telegramBot);
  } catch (err) {
    console.error("Remove cart Error: ", err);
    await telegramBot.sendMessage(chatId, "❌ Failed to update cart.");
  }
};
