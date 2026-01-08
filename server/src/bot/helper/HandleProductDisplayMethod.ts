import TelegramBot, { InlineKeyboardButton } from "node-telegram-bot-api";
import { HandleProductBrowsing } from "./HandleProductBrowsing.js";
import { Product } from "../../models/Product.js";
import { ImageHelper } from "./Image-helper.js";

export const HandleProductDisplayMethod = async (
  chatId: number,
  messageId: number | undefined,
  method: string,
  telegramBot: TelegramBot
) => {
  try {
    if (method === "all") {
      await sendAllProducts(chatId, telegramBot);
      await telegramBot.deleteMessage(chatId, Number(messageId));
    } else if (method === "browse") {
      await HandleProductBrowsing(chatId, Number(messageId), 0, telegramBot);
    }
  } catch (err) {
    console.error("Product method error: ", err);
    telegramBot.sendMessage(
      chatId,
      "❌ Error processing your request. Please try again."
    );
  }
};

export const sendAllProducts = async (
  chatId: number,
  telegramBot: TelegramBot
) => {
  try {
    const products = await Product.find({ isAvailable: true }).exec();

    if (products.length === 0) {
      return telegramBot.sendMessage(
        chatId,
        "📭 No products available at the moment. Please check back later!"
      );
    }

    await telegramBot.sendMessage(
      chatId,
      `📊 *Found ${products.length} available products:*`,
      { parse_mode: "Markdown" }
    );

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const message = `
      🏷️ *${product.name}*
      ━━━━━━━━━━━━━━━━
    📝 ${product.description || "No description available"}
    ━━━━━━━━━━━━━━━━
    💰 *Price:* $${product.price.toFixed(2)}
    📦 *Stock:* ${product.stock > 0 ? `available` : "Out of stock"}
    🏷️ *Category:* ${product.category || "Uncategorized"}
            `;

      const keyboard = {
        inline_keyboard: [
          [
            {
              text: "🔍 View Details",
              callback_data: `PRODUCT_DETAIL|${product._id}`,
            },
            {
              text: "Add to cart",
              callback_data: `ADD_CART|${product._id}`,
            },
          ],
        ],
      };

      const finalPhotoUrl = ImageHelper(product.imageUrl);

      if (finalPhotoUrl) {
        try {
          await telegramBot.sendPhoto(chatId, finalPhotoUrl, {
            caption: message,
            parse_mode: "Markdown",
            reply_markup: keyboard,
          });
        } catch (err) {
          console.error(`Photo send failed for product ${product._id}`, err);
        }
      } else {
        await telegramBot.sendMessage(chatId, message, {
          parse_mode: "Markdown",
          reply_markup: keyboard,
        });
      }

      if (i < products.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
  } catch (err) {
    console.error("Send all products error: ", err);
    telegramBot.sendMessage(chatId, "❌ Error fetching products.");
  }
};
