import { User } from "../../models/User.js";
import { telegramBot } from "../bot.js";
import {
  handleNextProduct,
  handlePreviousProduct,
  HandleProductBrowsing,
  handleProductDetail,
  handleRefreshProduct,
} from "../helper/HandleProductBrowsing.js";
import { HandleProductDisplayMethod } from "../helper/HandleProductDisplayMethod.js";

export const callbackHandler = () => {
  telegramBot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    const messageId = query.message?.message_id;
    const data = query.data;
    const telegramUserId = String(query.from.id);

    if (!chatId || !messageId || !data) {
      return telegramBot.answerCallbackQuery(query.id, {
        text: "Error: Message expired or invalid data.",
      });
    }

    // Handle gender selection
    if (data?.startsWith("GEN_")) {
      const [action, telegramUserId] = data.split("|");
      const gender = action === "GEN_M" ? "MALE" : "FEMALE";
      try {
        const updateUser = await User.findOneAndUpdate(
          { telegramUserId: String(telegramUserId) },
          { gender: gender },
          { new: true }
        );

        if (updateUser) {
          await telegramBot.editMessageText(
            `✅ Registration successful!\n\nWelcome to EBA Store ${updateUser.name}!\n\nUse /products to browse our collection.`,
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
    //Handle product browsing
    else if (data?.startsWith("PRODUCT_")) {
      const [action, ...params] = data.split("");

      switch (action) {
        case "PRODUCT_METHOD":
          const method = params[0];
          await HandleProductDisplayMethod(
            chatId,
            messageId,
            method,
            telegramBot
          );
          break;
        case "PRODUCT_BROWSE":
          const startIndex = parseInt(params[0] || "0");
          await HandleProductBrowsing(chatId, messageId, startIndex);
          break;
        case "PRODUCT_NEXT":
          await handleNextProduct(chatId, messageId);
          break;

        case "PRODUCT_PREV":
          await handlePreviousProduct(chatId, messageId);
          break;

        case "PRODUCT_REFRESH":
          await handleRefreshProduct(chatId, messageId);
          break;

        case "PRODUCT_DETAIL":
          const productId = params[0];
          await handleProductDetail(chatId, productId, telegramBot);
          break;
      }
    }
  });
};
