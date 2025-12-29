import TelegramBot from "node-telegram-bot-api";
import { Product } from "../models/Product.js";

export const sendProductCatalog = async (
  bot: TelegramBot,
  chatId: number,
  page: number = 1,
  itemsPerPage: number = 5
) => {
  const skip = (page - 1) * itemsPerPage;

  const products = await Product.find({ isAvailable: true })
    .skip(skip)
    .limit(itemsPerPage);

  if (products.length === 0) {
    await bot.sendMessage(chatId, "📭 No products available at the moment.");
  }

  for (const product of products) {
    const aption = `
🏷️ *${product.name}*
💰 Price: $${product.price}
📦 Stock: ${product.stock} available
📝 ${product.description}
    `;

    await bot.sendPhoto(chatId, product.imageUrl, {
      caption: aption,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🛒 Add to Cart",
              callback_data: `add_to_cart_${product._id}`,
            },
            {
              text: "📋 Details",
              callback_data: `product_details_${product._id}`,
            },
          ],
        ],
      },
    });
  }

  const totalProducts = await Product.countDocuments({ isAvailable: true });
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const paginationButtons = [];
  if (page > 1) {
    paginationButtons.push({
      text: "⬅️ Previous",
      callback_data: `products_page_${page - 1}`,
    });
  }
  if (page < totalPages) {
    paginationButtons.push({
      text: "Next ➡️",
      callback_data: `products_page_${page + 1}`,
    });
  }

  if (paginationButtons.length > 0) {
    await bot.sendMessage(chatId, "Browse more products:", {
      reply_markup: {
        inline_keyboard: [paginationButtons],
      },
    });
  }
};
