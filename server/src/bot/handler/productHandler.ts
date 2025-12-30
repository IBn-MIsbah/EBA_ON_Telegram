import { Product } from "../../models/Product.js";
import { telegramBot } from "../bot.js";
import { formatImageUrl, productBrowsingStates } from "../helpers.js";
import { InlineKeyboardButton } from "node-telegram-bot-api";

export async function sendAllProducts(chatId: number) {
  const products = await Product.find({ isAvailable: true });
  if (products.length === 0)
    return telegramBot.sendMessage(chatId, "📭 No products available.");

  for (const product of products) {
    const message = `🏷️ *${product.name}*\n💰 *Price:* $${product.price.toFixed(
      2
    )}`;
    const keyboard = {
      inline_keyboard: [
        [
          {
            text: "🔍 Details",
            callback_data: `PRODUCT_DETAIL|${product._id}`,
          },
          { text: "🛒 Add to Cart", callback_data: `ADD_CAR|${product._id}` },
        ],
      ],
    };
    const photo = formatImageUrl(product.imageUrl);
    photo
      ? await telegramBot.sendPhoto(chatId, photo, {
          caption: message,
          parse_mode: "Markdown",
          reply_markup: keyboard,
        })
      : await telegramBot.sendMessage(chatId, message, {
          parse_mode: "Markdown",
          reply_markup: keyboard,
        });
  }
}

export async function handleProductBrowsing(
  chatId: number,
  messageId?: number,
  startIndex: number = 0
) {
  const products = await Product.find({ isAvailable: true });
  if (products.length === 0) return telegramBot.sendMessage(chatId, "Empty.");

  const currentIndex = Math.min(startIndex, products.length - 1);
  const product = products[currentIndex];
  productBrowsingStates.set(chatId, {
    currentIndex,
    productIds: products.map((p) => p._id.toString()),
    messageId,
  });

  const message = `🏷️ *${product.name}* (${currentIndex + 1}/${
    products.length
  })\n💰 *$${product.price}*`;
  const keyboard: InlineKeyboardButton[][] = [
    [
      { text: "◀️ Prev", callback_data: `PRODUCT_PREV` },
      { text: "Next ▶️", callback_data: `PRODUCT_NEXT` },
    ],
    [{ text: "🛒 Add to Cart", callback_data: `ADD_CAR|${product._id}` }],
  ];

  if (messageId) {
    await telegramBot.editMessageText(message, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: keyboard },
    });
  } else {
    const sent = await telegramBot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: keyboard },
    });
    productBrowsingStates.get(chatId)!.messageId = sent.message_id;
  }
}
