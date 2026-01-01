import TelegramBot, { InlineKeyboardButton } from "node-telegram-bot-api";
import { Product } from "../../models/Product.js";
import { ImageHelper } from "./Image-helper.js";

interface ProductBrowsingState {
  currentIndex: number;
  productIds: string[];
  messageId: number;
}
const productBrowsingStates = new Map<number, ProductBrowsingState>();

export const HandleProductBrowsing = async (
  chatId: number,
  messageId: number,
  startIndex: number = 0,
  telegramBot?: TelegramBot
) => {
  try {
    const products = await Product.find({ isAvailable: true }).exec();

    if (products.length === 0) {
      const text = "📭 No products available.";
      if (messageId) {
        await telegramBot?.editMessageText(text, {
          chat_id: chatId,
          message_id: messageId,
        });
      } else {
        await telegramBot?.sendMessage(chatId, text);
      }
      return;
    }

    const currentIndex = Math.min(startIndex, products.length - 1);
    const product = products[currentIndex];

    productBrowsingStates.set(chatId, {
      currentIndex,
      productIds: products.map((p) => p._id.toString()),
      messageId,
    });

    const message = `
      🏷️ *${product.name}* (${currentIndex + 1}/${products.length})
      ━━━━━━━━━━━━━━━━
      📝 ${product.description || "No description available"}
      ━━━━━━━━━━━━━━━━
      💰 *Price:* $${product.price.toFixed(2)}
      📦 *Stock:* ${product.stock > 0 ? `available` : "Out of stock"}
      🏷️ *Category:* ${product.category || "Uncategorized"}
          `;

    const keyboard: InlineKeyboardButton[][] = [];
    if (products.length > 1) {
      keyboard.push([
        { text: "◀️ Previous", callback_data: `PRODUCT_PREV|${currentIndex}` },
        { text: "🔄 Refresh", callback_data: "PRODUCT_REFRESH" },
        { text: "Next ▶️", callback_data: `PRODUCT_NEXT|${currentIndex}` },
      ]);
    }
    keyboard.push([
      {
        text: "🔍 View Details",
        callback_data: `PRODUCT_DETAIL|${product._id}`,
      },
      {
        text: "Add to cart",
        callback_data: `ADD_CAR|${product._id}`,
      },
      { text: "📦 Send All", callback_data: "PRODUCT_METHOD|all" },
    ]);

    const photoUrl = ImageHelper(product.imageUrl);

    if (messageId) {
      if (photoUrl) {
        try {
          await telegramBot?.editMessageMedia(
            {
              type: "photo",
              media: photoUrl,
              caption: message,
              parse_mode: "Markdown",
            },
            {
              chat_id: chatId,
              message_id: messageId,
              reply_markup: { inline_keyboard: keyboard },
            }
          );
        } catch (err) {
          await telegramBot?.editMessageText(message, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: keyboard },
          });
        }
      } else {
        await telegramBot?.editMessageText(message, {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: keyboard },
        });
      }
    } else {
      let sentMsg;
      if (photoUrl) {
        try {
          sentMsg = await telegramBot?.sendPhoto(chatId, photoUrl, {
            caption: message,
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: keyboard },
          });
        } catch (err) {
          sentMsg = await telegramBot?.sendMessage(chatId, message, {
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: keyboard },
          });
        }
      } else {
        sentMsg = await telegramBot?.sendMessage(chatId, message, {
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: keyboard },
        });
      }
      const state = productBrowsingStates.get(chatId);
      if (state) state.messageId = Number(sentMsg?.message_id);
    }
  } catch (err) {
    console.error("Browsing error: ", err);
  }
};

export const handleNextProduct = async (chatId: number, messageId: number) => {
  const state = productBrowsingStates.get(chatId);
  if (!state) return HandleProductBrowsing(chatId, messageId, 0);
  const nextIndex = (state.currentIndex + 1) % state.productIds.length;
  await HandleProductBrowsing(chatId, messageId, nextIndex);
};

export const handlePreviousProduct = async (
  chatId: number,
  messageId: number
) => {
  const state = productBrowsingStates.get(chatId);
  if (!state) return HandleProductBrowsing(chatId, messageId, 0);
  const prevIndex =
    state.currentIndex === 0
      ? state.productIds.length - 1
      : state.currentIndex - 1;
  await HandleProductBrowsing(chatId, messageId, prevIndex);
};

export const handleProductDetail = async (
  chatId: number,
  productId: string,
  telegramBot: TelegramBot
) => {
  try {
    const product = await Product.findById(productId).exec();
    if (!product)
      return telegramBot.sendMessage(chatId, "❌ Product not found.");

    const message = `
      📋 *Product Details*
      ━━━━━━━━━━━━━━━━
      🏷️ *Name:* ${product.name}
      ━━━━━━━━━━━━━━━━
      📝 *Description:*
      ${product.description || "No description available"}
      ━━━━━━━━━━━━━━━━
      💰 *Price:* $${product.price.toFixed(2)}
      ✅ *Status:* ${product.isAvailable ? "Available" : "Out of Stock"}
      🏷️ *Category:* ${product.category || "Uncategorized"}
          `;

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: "← Back to Browse",
            callback_data: `PRODUCT_BROWSE|${
              productBrowsingStates.get(chatId)?.currentIndex || 0
            }`,
          },
          {
            text: "Add to cart",
            callback_data: `ADD_CAR|${product._id}`,
          },
        ],
      ],
    };

    const photoUrl = ImageHelper(product.imageUrl);

    if (photoUrl) {
      try {
        await telegramBot.sendPhoto(chatId, photoUrl, {
          caption: message,
          parse_mode: "Markdown",
          reply_markup: keyboard,
        });
      } catch {
        await telegramBot.sendMessage(chatId, message, {
          parse_mode: "Markdown",
          reply_markup: keyboard,
        });
      }
    } else {
      await telegramBot.sendMessage(chatId, message, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
    }
  } catch (err) {
    console.error("Detail error:", err);
  }
};

export const handleRefreshProduct = async (
  chatId: number,
  messageId: number
) => {
  const state = productBrowsingStates.get(chatId);
  await HandleProductBrowsing(chatId, messageId, state?.currentIndex || 0);
};
