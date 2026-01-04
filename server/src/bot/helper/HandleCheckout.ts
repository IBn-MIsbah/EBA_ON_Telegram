import TelegramBot from "node-telegram-bot-api";
import { Cart } from "../../models/Cart.js";
import { User } from "../../models/User.js";
import { Order } from "../../models/Order.js";
import { v4 as uuidv4 } from "uuid";

export const HandleCheckout = async (
  chatId: number,
  telegramUserId: number,
  telegramBot: TelegramBot
) => {
  try {
    const [cart, user] = await Promise.all([
      Cart.findOne({ telegramUserId: String(telegramUserId) }).populate(
        "items.productId"
      ),
      User.findOne({ telegramUserId: String(telegramUserId) }),
    ]);

    if (!cart) {
      return telegramBot.sendMessage(chatId, "🛒 Your cart is empty.");
    }

    if (!user) {
      return telegramBot.sendMessage(
        chatId,
        "❌ User profile not found. Register with /start command"
      );
    }

    let totalAmount: number = 0;

    const orderProducts = cart.items.map((item: any) => {
      const subtotal = item.productId.price * item.quantity;
      totalAmount += subtotal;
      return {
        productId: item.productId._id,
        quntity: item.quantity,
        price: item.productId.price,
      };
    });
    const order = await Order.create({
      orderNumber: `ORD-${uuidv4().split("-")[0].toUpperCase()}`,
      userId: user._id,
      userGender: user.gender, // Essential for admin filtering
      phone: user.phone,
      products: orderProducts,
      totalAmount: totalAmount,
      status: "awaiting_payment",
    });
    const bankMessage = `
    📝 *Order Summary: ${order.orderNumber}*
    ━━━━━━━━━━━━━━━━
    💰 *Total Amount: $${totalAmount.toFixed(2)}*

    🏦 *Bank Transfer Details:*
    Bank: Your Bank Name
    Account Holder Name: EBA Admin
    Account Number: 1234567890

    📸 *Next Step:*
    Please transfer the total amount and **send a screenshot/receipt** of the transaction to this chat. 
    `;

    const sentMessage = await telegramBot.sendMessage(chatId, bankMessage, {
      parse_mode: "Markdown",
    });

    order.telegramMessageId = sentMessage.message_id;
    await order.save();

    await Cart.findOneAndUpdate(
      { telegramUserId: String(telegramUserId) },
      { items: [] }
    );
  } catch (err) {
    console.error("Checkout Error:", err);
    telegramBot.sendMessage(chatId, "❌ An error occurred during checkout.");
  }
};
