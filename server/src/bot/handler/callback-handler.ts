import { Cart } from "../../models/Cart.js";
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
    try {
      if (!chatId || !messageId || !data) {
        return telegramBot.answerCallbackQuery(query.id, {
          text: "Error: Message expired or invalid data.",
        });
      }

      // Handle gender selection
      if (data?.startsWith("GEN_")) {
        const [action] = data.split("|");
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
        const [action, ...params] = data.split("|");

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
            await HandleProductBrowsing(
              chatId,
              messageId,
              startIndex,
              telegramBot
            );
            break;
          case "PRODUCT_NEXT":
            await handleNextProduct(chatId, messageId, telegramBot);
            break;

          case "PRODUCT_PREV":
            await handlePreviousProduct(chatId, messageId, telegramBot);
            break;

          case "PRODUCT_REFRESH":
            await handleRefreshProduct(chatId, messageId, telegramBot);
            break;

          case "PRODUCT_DETAIL":
            const productId = params[0];
            await handleProductDetail(chatId, productId, telegramBot);
            break;
        }
      }
      // Handle add to cart
      else if (data?.startsWith("ADD_CART")) {
        const [action, ...params] = data.split("|");

        try {
          const productId = params[0];

          let cart = await Cart.findOne({ telegramUserId: telegramUserId });
          if (!cart) {
            cart = new Cart({
              telegramUserId: telegramUserId,
              items: [{ productId: productId, quantity: 1 }],
            });
          } else {
            const itemIndex = cart.items.findIndex(
              (item) => item.productId.toString() === productId
            );

            if (itemIndex > -1) {
              cart.items[itemIndex].quantity += 1;
            } else {
              cart.items.push({ productId: productId as any, quantity: 1 });
            }
          }
          await cart.save();

          await telegramBot.answerCallbackQuery(query.id, {
            text: "✅ Product added to cart!",
            show_alert: false,
          });
        } catch (err) {
          console.error("Error adding product to cart: ", err);
          telegramBot.answerCallbackQuery(query.id, {
            text: "❌ Failed to add to cart.",
            show_alert: true,
          });
        }
      }

      await telegramBot.answerCallbackQuery(query.id);
    } catch (err) {
      console.error("Callback Error:", err);
      await telegramBot.answerCallbackQuery(query.id, {
        text: "⚠️ An error occurred.",
      });
    }
  });
};
