import TelegramBot, { InlineKeyboardButton } from "node-telegram-bot-api";
import { Product } from "../../models/Product.js";
import { ImageHelper } from "./Image-helper.js";

interface ProductBrowsingState {
  currentIndex: number;
  productIds: string[];
  messageId: number;
  lastActive: number;
}

// State management with basic cleanup to prevent memory leaks
const productBrowsingStates = new Map<number, ProductBrowsingState>();

// Run cleanup every 10 minutes to remove inactive users from memory
setInterval(() => {
  const now = Date.now();
  for (const [chatId, state] of productBrowsingStates.entries()) {
    if (now - state.lastActive > 1000 * 60 * 60) {
      // 1 hour timeout
      productBrowsingStates.delete(chatId);
    }
  }
}, 600000);

export const HandleProductBrowsing = async (
  chatId: number,
  messageId: number,
  startIndex: number = 0,
  telegramBot: TelegramBot // Required parameter
) => {
  try {
    const products = await Product.find({ isAvailable: true }).exec();

    if (products.length === 0) {
      const text = "📭 No products available.";
      if (messageId) {
        return await telegramBot.editMessageText(text, {
          chat_id: chatId,
          message_id: messageId,
        });
      }
      return await telegramBot.sendMessage(chatId, text);
    }

    // Ensure index is within bounds (circular navigation)
    const currentIndex = (startIndex + products.length) % products.length;
    const product = products[currentIndex];

    // Update state with activity timestamp
    productBrowsingStates.set(chatId, {
      currentIndex,
      productIds: products.map((p) => p._id.toString()),
      messageId,
      lastActive: Date.now(),
    });

    const message = `🏷️ *${product.name}* (${currentIndex + 1}/${
      products.length
    })
━━━━━━━━━━━━━━━━
📝 ${product.description || "No description available"}
━━━━━━━━━━━━━━━━
💰 *Price:* $${product.price.toFixed(2)}
📦 *Stock:* ${product.stock > 0 ? "In Stock" : "Out of stock"}
🏷️ *Category:* ${product.category || "Uncategorized"}`;

    const keyboard: InlineKeyboardButton[][] = [];
    if (products.length > 1) {
      keyboard.push([
        { text: "◀️ Previous", callback_data: `PRODUCT_PREV|${currentIndex}` },
        {
          text: "🔄 Refresh",
          callback_data: `PRODUCT_REFRESH|${currentIndex}`,
        },
        { text: "Next ▶️", callback_data: `PRODUCT_NEXT|${currentIndex}` },
      ]);
    }
    keyboard.push([
      {
        text: "🔍 View Details",
        callback_data: `PRODUCT_DETAIL|${product._id}`,
      },
      { text: "🛒 Add to Cart", callback_data: `ADD_CART|${product._id}` },
    ]);
    keyboard.push([
      { text: "📦 Send All", callback_data: "PRODUCT_METHOD|all" },
    ]);

    const photoUrl = ImageHelper(product.imageUrl);

    if (messageId) {
      try {
        if (photoUrl) {
          await telegramBot.editMessageMedia(
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
        } else {
          await telegramBot.editMessageText(message, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: keyboard },
          });
        }
      } catch (err: any) {
        // If "Message Not Modified", we ignore the error
        if (!err.message.includes("message is not modified")) {
          console.error("Edit error:", err);
        }
      }
    } else {
      let sentMsg;
      if (photoUrl) {
        sentMsg = await telegramBot.sendPhoto(chatId, photoUrl, {
          caption: message,
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: keyboard },
        });
      } else {
        sentMsg = await telegramBot.sendMessage(chatId, message, {
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: keyboard },
        });
      }
      // Store the new messageId in state
      const state = productBrowsingStates.get(chatId);
      if (state) state.messageId = sentMsg.message_id;
    }
  } catch (err) {
    console.error("Browsing error:", err);
  }
};

export const handleNextProduct = async (
  chatId: number,
  messageId: number,
  telegramBot: TelegramBot
) => {
  const state = productBrowsingStates.get(chatId);
  const nextIndex = state ? state.currentIndex + 1 : 0;
  await HandleProductBrowsing(chatId, messageId, nextIndex, telegramBot);
};

export const handlePreviousProduct = async (
  chatId: number,
  messageId: number,
  telegramBot: TelegramBot
) => {
  const state = productBrowsingStates.get(chatId);
  const prevIndex = state ? state.currentIndex - 1 : 0;
  await HandleProductBrowsing(chatId, messageId, prevIndex, telegramBot);
};

export const handleRefreshProduct = async (
  chatId: number,
  messageId: number,
  telegramBot: TelegramBot
) => {
  const state = productBrowsingStates.get(chatId);
  await HandleProductBrowsing(
    chatId,
    messageId,
    state?.currentIndex || 0,
    telegramBot
  );
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

    const message = `📋 *Product Details*
━━━━━━━━━━━━━━━━
🏷️ *Name:* ${product.name}
━━━━━━━━━━━━━━━━
📝 *Description:*
${product.description || "No description available"}
━━━━━━━━━━━━━━━━
💰 *Price:* $${product.price.toFixed(2)}
✅ *Status:* ${product.isAvailable ? "Available" : "Out of Stock"}`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: "← Back to Browse", callback_data: `PRODUCT_REFRESH` },
          { text: "🛒 Add to Cart", callback_data: `ADD_CART|${product._id}` },
        ],
      ],
    };

    const photoUrl = ImageHelper(product.imageUrl);
    if (photoUrl) {
      await telegramBot.sendPhoto(chatId, photoUrl, {
        caption: message,
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
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
