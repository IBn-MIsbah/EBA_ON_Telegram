import { telegramBot } from "../bot.js";
import { UserService } from "../services/user.service.js";
import { ProductService } from "../services/product.service.js";
import { CartService } from "../services/cart.service.js";
import { ProductKeyboards } from "../keyboards/product.keyboard.js";
import { CallbackData } from "../types/index.js";

function parseCallbackData(data: string): CallbackData {
  const [action, ...params] = data.split("|");
  return { action, params };
}

async function handleGenderSelection(
  chatId: number,
  messageId: number,
  data: CallbackData
) {
  const [action, telegramUserId] = [data.action, data.params[0]];
  const gender = action === "GEN_M" ? "MALE" : "FEMALE";

  try {
    const updatedUser = await UserService.updateGender(telegramUserId, gender);

    if (updatedUser) {
      await telegramBot.editMessageText(
        `✅ Registration successful!\n\nWelcome to EBA Store ${updatedUser.name}!\n\nUse /products to browse our collection.`,
        {
          chat_id: chatId,
          message_id: messageId,
        }
      );
    }
  } catch (err) {
    console.error("Callback registration error:", err);
    telegramBot.sendMessage(
      chatId,
      "❌ Registration failed. You might already be registered."
    );
  }
}

async function handleAddToCart(query: any, productId: string) {
  try {
    const product = await ProductService.getProductById(productId);
    if (!product || product.stock <= 0) {
      return telegramBot.answerCallbackQuery(query.id, {
        text: "❌ Out of stock!",
      });
    }

    const telegramUserId = String(query.from.id);
    await CartService.addToCart(telegramUserId, productId);

    return telegramBot.answerCallbackQuery(query.id, {
      text: `✅ Added ${product.name} to cart!`,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return telegramBot.answerCallbackQuery(query.id, {
      text: "❌ Error adding to cart.",
    });
  }
}

export function setupCallbackHandler() {
  telegramBot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    const messageId = query.message?.message_id;
    const data = query.data;

    if (!chatId || !messageId || !data) {
      return telegramBot.answerCallbackQuery(query.id, {
        text: "Error: Message expired or invalid data.",
      });
    }

    const callbackData = parseCallbackData(data);

    // Handle gender selection
    if (callbackData.action.startsWith("GEN_")) {
      await handleGenderSelection(chatId, messageId, callbackData);
    }
    // Handle product browsing
    else if (callbackData.action.startsWith("PRODUCT_")) {
      await handleProductActions(chatId, messageId, callbackData);
    }
    // Handle add to cart
    else if (callbackData.action.startsWith("ADD_CAR")) {
      const productId = callbackData.params[0];
      await handleAddToCart(query, productId);
    }

    telegramBot.answerCallbackQuery(query.id);
  });
}

// Product actions handler (you'll need to implement this based on your existing code)
async function handleProductActions(
  chatId: number,
  messageId: number,
  data: CallbackData
) {
  // Implement product action handling based on your existing switch case
}
