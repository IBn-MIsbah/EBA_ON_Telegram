import TelegramBot from "node-telegram-bot-api";
import { Product } from "../../models/Product.js";

export const sendProduct = async (
  bot: TelegramBot,
  chatId: number,
  page: number,
  messageId?: number
) => {
  const baseUrl = "http://localhost:5000";
  const limit = 1;

  const total = await Product.countDocuments();
  const totalPages = Math.ceil(total / limit);
  if (page < 1 || page > totalPages) return;

  const [product] = await Product.find()
    .skip((page - 1) * limit)
    .limit(limit);

  if (!product) return;

  const caption =
    `🛍 *${product.name}*\n\n` +
    `${product.description}\n\n` +
    `💰 Price: *$${product.price}*\n` +
    `📦 Stock: *${product.stock}*\n\n` +
    `📄 Page *${page}/${totalPages}*`;

  const keyboard = {
    inline_keyboard: [
      [
        ...(page > 1
          ? [{ text: "⬅ Prev", callback_data: `PAGE_${page - 1}` }]
          : []),
        ...(page < totalPages
          ? [{ text: "➡ Next", callback_data: `PAGE_${page + 1}` }]
          : []),
      ],
      [
        { text: "🛒 Buy", callback_data: `BUY_${product._id}` },
        { text: "📦 Stock", callback_data: `STOCK_${product._id}` },
      ],
    ],
  };

  if (messageId) {
    await bot.editMessageMedia(
      {
        type: "photo",
        media: `${baseUrl}${product.imageUrl}`,
        caption,
        parse_mode: "Markdown",
      },
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: keyboard,
      }
    );
  } else {
    await bot.sendPhoto(chatId, `${baseUrl}${product.imageUrl}`, {
      caption,
      parse_mode: "Markdown",
      reply_markup: keyboard,
    });
  }
};
