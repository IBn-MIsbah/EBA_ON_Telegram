import { Cart } from "../../models/Cart.js";
import { Product } from "../../models/Product.js";
import { User } from "../../models/User.js";
import { telegramBot } from "../bot.js";
import { RemoveCartItem } from "../helper/HandleCartItem.js";
import { HandleCheckout } from "../helper/HandleCheckout.js";
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
    const queryId = query.id;

    // To prevent "Query is answered" errors
    let isAnswered = false;

    try {
      if (!chatId || !messageId || !data) {
        return telegramBot.answerCallbackQuery(queryId, {
          text: "Error: Invalid data or expired message.",
        });
      }

      // 1. GENDER SELECTION
      if (data.startsWith("GEN_")) {
        const [action] = data.split("|");
        const gender = action === "GEN_M" ? "MALE" : "FEMALE";

        const updateUser = await User.findOneAndUpdate(
          { telegramUserId },
          { gender },
          { new: true }
        );

        if (updateUser) {
          const welcomeMessage =
            `🎊 *Registration Complete!* 🎊\n\n` +
            `Welcome to the family, *${updateUser.name}*! We've customized your experience for the *${gender}* department.\n\n` +
            `🛍 *What's Next?*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `📦 /products — Browse collection\n` +
            `🛒 /cart — View items\n` +
            `📞 /contact — Support\n` +
            `🗑 /delete — Clear data\n\n` +
            `*Happy Shopping!* ☕✨`;

          await telegramBot.editMessageText(welcomeMessage, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: "Markdown",
          });
        }
      }

      // 2. PRODUCT BROWSING
      else if (data.startsWith("PRODUCT_")) {
        const [action, ...params] = data.split("|");
        switch (action) {
          case "PRODUCT_METHOD":
            await HandleProductDisplayMethod(
              chatId,
              messageId,
              params[0],
              telegramBot
            );
            break;
          case "PRODUCT_BROWSE":
            await HandleProductBrowsing(
              chatId,
              messageId,
              parseInt(params[0] || "0"),
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
            await handleProductDetail(chatId, params[0], telegramBot);
            break;
        }
      }

      // 3. ADD TO CART
      else if (data.startsWith("ADD_CART")) {
        const [action, productId] = data.split("|");
        const product = await Product.findById(productId);

        if (!product || !product.isAvailable || product.stock <= 0) {
          isAnswered = true;
          return telegramBot.answerCallbackQuery(queryId, {
            text: "⚠️ Sorry, this product is out of stock.",
            show_alert: true,
          });
        }

        let cart = await Cart.findOne({ telegramUserId });
        if (!cart) {
          cart = new Cart({
            telegramUserId,
            items: [{ productId, quantity: 1 }],
          });
        } else {
          const itemIndex = cart.items.findIndex(
            (i) => i.productId.toString() === productId
          );
          if (itemIndex > -1) {
            if (cart.items[itemIndex].quantity >= product.stock) {
              isAnswered = true;
              return telegramBot.answerCallbackQuery(queryId, {
                text: `❌ Limit reached. Only ${product.stock} in stock.`,
                show_alert: true,
              });
            }
            cart.items[itemIndex].quantity += 1;
          } else {
            cart.items.push({ productId: productId as any, quantity: 1 });
          }
        }
        await cart.save();
        isAnswered = true;
        await telegramBot.answerCallbackQuery(queryId, {
          text: "✅ Added to cart!",
        });
      }

      // 4. CART STATUS & CHECKOUT
      else if (data.startsWith("CART_")) {
        const [action, ...params] = data.split("|");
        switch (action) {
          case "CART_CHECKOUT":
            await HandleCheckout(chatId, Number(telegramUserId), telegramBot);
            break;
          case "CART_CLEAR":
            await RemoveCartItem(chatId, telegramUserId, telegramBot);
            break;
          case "CART_REMOVE_ITEM":
            const productId = params[0];
            await RemoveCartItem(
              chatId,
              telegramUserId,
              telegramBot,
              productId
            );
            break;
        }
      }

      // 5. DELETE DATA FLOW
      else if (data.startsWith("DELETE_")) {
        const [action] = data.split("|");
        if (action === "DELETE_CONFIRM") {
          await Promise.all([
            User.findOneAndDelete({ telegramUserId }),
            Cart.findOneAndDelete({ telegramUserId }),
          ]);
          await telegramBot.editMessageText(
            `🗑 *Data Successfully Removed*\n\nYour profile has been cleared.👋`,
            {
              chat_id: chatId,
              message_id: messageId,
              parse_mode: "Markdown",
            }
          );
        } else {
          await telegramBot.editMessageText("✅ *Deletion Cancelled*", {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: "Markdown",
          });
        }
        isAnswered = true;
        await telegramBot.answerCallbackQuery(queryId, {
          text: action === "DELETE_CONFIRM" ? "Deleted" : "Cancelled",
        });
      }

      // Final fallback answer
      if (!isAnswered) {
        await telegramBot.answerCallbackQuery(queryId);
      }
    } catch (err) {
      console.error("Global Callback Error:", err);
      if (!isAnswered) {
        await telegramBot.answerCallbackQuery(queryId, {
          text: "⚠️ Process failed.",
        });
      }
    }
  });
};
