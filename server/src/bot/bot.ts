// src/services/bot/index.ts
import TelegramBot, { InlineKeyboardButton } from "node-telegram-bot-api";
import { BOT_TOKEN, isProduction } from "../common/index.js";
// import { Product } from "../models/Product.js";
// import { User } from "../models/User.js";
// import { Cart } from "../models/Cart.js";

if (!BOT_TOKEN) {
  throw new Error("Telegram Bot token is not defined in .env");
}

export const telegramBot = new TelegramBot(BOT_TOKEN, {
  polling: !isProduction,
});

// Helper to format image URLs for Telegram
// This prepends the Ngrok tunnel URL if the image is a local path
// const formatImageUrl = (imageUrl?: string): string | undefined => {
//   if (!imageUrl) return undefined;

//   // If it's already a full external URL, return it
//   if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
//     // If it's a localhost URL, try to swap it with the public tunnel URL
//     if (imageUrl.includes("localhost") && process.env.PUBLIC_URL) {
//       const urlPath = imageUrl.split(":5000")[1] || "";
//       return `${process.env.PUBLIC_URL.replace(/\/$/, "")}${urlPath}`;
//     }
//     return imageUrl;
//   }

//   // If it's a relative local path (e.g., /public/uploads/...)
//   if (imageUrl.startsWith("/public") || imageUrl.startsWith("public")) {
//     const baseUrl = process.env.PUBLIC_URL || `http://localhost:5000`;
//     const cleanPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
//     return `${baseUrl.replace(/\/$/, "")}${cleanPath}`;
//   }

//   return imageUrl;
// };

// // Store user's product browsing state
// interface ProductBrowsingState {
//   currentIndex: number;
//   productIds: string[];
//   messageId?: number;
// }

// const productBrowsingStates = new Map<number, ProductBrowsingState>();

// telegramBot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;

//   const options = {
//     reply_markup: {
//       one_time_keyboard: true,
//       resize_keyboard: true,
//       keyboard: [
//         [
//           {
//             text: "📱 Register with Phone Number",
//             request_contact: true,
//           },
//         ],
//       ],
//     },
//   };

//   telegramBot.sendMessage(
//     chatId,
//     `Hello ${msg.from?.first_name}!\nWelcome to EBA Store. Please share your contact to start.`,
//     options
//   );
// });

// telegramBot.on("contact", async (msg) => {
//   const chatId = msg.chat.id;
//   if (!chatId) return;
//   const phone = msg.contact?.phone_number;
//   const name = msg.contact?.first_name || msg.from?.first_name || "Unknown";
//   const telegramUserId = String(msg.contact?.user_id || msg.from?.id);

//   if (!phone) return;
//   if (!telegramUserId || telegramUserId === "undefined")
//     throw new Error("Telegram User_id is missing");

//   try {
//     await User.findOneAndUpdate(
//       { telegramUserId: telegramUserId },
//       { name, phone, telegramUserId, role: "USER" },
//       { upsert: true, new: true }
//     );
//     const genderOptions = {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             { text: "Male 👨", callback_data: `GEN_M|${telegramUserId}` },
//             { text: "Female 👩", callback_data: `GEN_F|${telegramUserId}` },
//           ],
//         ],
//       },
//     };

//     await telegramBot.sendMessage(
//       chatId,
//       `Thanks ${name}! One last step.\nPlease select your gender:`,
//       genderOptions
//     );
//   } catch (error) {
//     console.error("Contact handler error:", error);
//     telegramBot.sendMessage(
//       chatId,
//       "❌ Something went wrong. Please try /start again."
//     );
//   }
// });

// telegramBot.on("callback_query", async (query) => {
//   const chatId = query.message?.chat.id;
//   const messageId = query.message?.message_id;
//   const data = query.data;
//   const telegramUserId = String(query.from.id);

//   if (!chatId || !messageId || !data) {
//     return telegramBot.answerCallbackQuery(query.id, {
//       text: "Error: Message expired or invalid data.",
//     });
//   }

//   // Handle gender selection
//   if (data?.startsWith("GEN_")) {
//     const [action, telegramUserId] = data.split("|");
//     const gender = action === "GEN_M" ? "MALE" : "FEMALE";

//     try {
//       const updateUser = await User.findOneAndUpdate(
//         { telegramUserId: String(telegramUserId) },
//         { gender: gender },
//         { new: true }
//       );

//       if (updateUser) {
//         await telegramBot.editMessageText(
//           `✅ Registration successful!\n\nWelcome to EBA Store ${updateUser.name}!\n\nUse /products to browse our collection.`,
//           {
//             chat_id: chatId,
//             message_id: messageId,
//           }
//         );
//       }
//     } catch (err) {
//       console.error("Callback registration error:", err);
//       telegramBot.sendMessage(
//         chatId,
//         "❌ Registration failed. You might already be registered."
//       );
//     }
//   }

//   // Handle product browsing
//   else if (data?.startsWith("PRODUCT_")) {
//     const [action, ...params] = data.split("|");

//     switch (action) {
//       case "PRODUCT_BROWSE":
//         const startIndex = parseInt(params[0] || "0");
//         await handleProductBrowsing(chatId, messageId, startIndex);
//         break;

//       case "PRODUCT_NEXT":
//         await handleNextProduct(chatId, messageId);
//         break;

//       case "PRODUCT_PREV":
//         await handlePreviousProduct(chatId, messageId);
//         break;

//       case "PRODUCT_REFRESH":
//         await handleRefreshProduct(chatId, messageId);
//         break;

//       case "PRODUCT_DETAIL":
//         const productId = params[0];
//         await handleProductDetail(chatId, productId);
//         break;

//       case "PRODUCT_METHOD":
//         const method = params[0];
//         await handleProductDisplayMethod(chatId, messageId, method);
//         break;
//     }
//   }
//   if (data.startsWith("ADD_CAR")) {
//     const productId = data.split("|")[1];

//     try {
//       const product = await Product.findById(productId);
//       if (!product || product.stock <= 0) {
//         return telegramBot.answerCallbackQuery(query.id, {
//           text: "❌ Out of stock!",
//         });
//       }

//       let cart = await Cart.findOne({ telegramUserId });
//       if (!cart) {
//         cart = new Cart({ telegramUserId, items: [] });
//       }

//       const itemIndex = cart.items.findIndex(
//         (item) => item.productId.toString() === productId
//       );
//       if (itemIndex > -1) {
//         cart.items[itemIndex].quantity += 1;
//       } else {
//         cart.items.push({ productId: productId as any, quantity: 1 });
//       }
//       await cart.save();
//       return telegramBot.answerCallbackQuery(query.id, {
//         text: `✅ Added ${product.name} to cart!`,
//       });
//     } catch (error) {
//       console.error("Add to cart error:", error);
//       return telegramBot.answerCallbackQuery(query.id, {
//         text: "❌ Error adding to cart.",
//       });
//     }
//   }
//   telegramBot.answerCallbackQuery(query.id);
// });

// // Handle /products command
// telegramBot.onText(/\/products/, async (msg) => {
//   const chatId = msg.chat.id;

//   try {
//     const user = await User.findOne({ telegramUserId: String(msg.from?.id) });
//     if (!user) {
//       return telegramBot.sendMessage(
//         chatId,
//         "Please register first using /start command."
//       );
//     }

//     const options = {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "📦 Send All Products",
//               callback_data: "PRODUCT_METHOD|all",
//             },
//             {
//               text: "➡️ Browse One by One",
//               callback_data: "PRODUCT_METHOD|browse",
//             },
//           ],
//         ],
//       },
//     };

//     await telegramBot.sendMessage(
//       chatId,
//       `🛒 Welcome to EBA Store Products!\n\nHow would you like to view our products?`,
//       options
//     );
//   } catch (error) {
//     console.error("Products command error:", error);
//     telegramBot.sendMessage(
//       chatId,
//       "❌ Error loading products. Please try again."
//     );
//   }
// });

// telegramBot.onText(/\/cart/, async (msg) => {
//   const chatId = msg.chat.id;
//   const telegramUserId = String(msg.from?.id);

//   try {
//     const cart = await Cart.findOne({ telegramUserId }).populate(
//       "items.productId"
//     );
//     if (!cart || cart.items.length === 0) {
//       return telegramBot.sendMessage(chatId, "🛒 Your cart is empty.");
//     }

//     let total = 0;
//     let summary = "🛒 *Your Shopping Cart:*\n━━━━━━━━━━━━━━━\n";

//     cart.items.forEach((item: any) => {
//       const subtotal = item.productId.price * item.quantity;
//       total += subtotal;
//       summary += `🔹 *${item.productId.name}*\n   ${
//         item.quantity
//       } x $${item.productId.price.toFixed(2)} = *$${subtotal.toFixed(2)}*\n`;
//     });

//     summary += `━━━━━━━━━━━━━━━\n💰 *Total: $${total.toFixed(2)}*`;

//     const options = {
//       parse_mode: "Markdown" as const,
//       reply_markup: {
//         inline_keyboard: [
//           [{ text: "💳 Checkout", callback_data: "CHECKOUT" }],
//           [{ text: "🗑 Clear Cart", callback_data: "CLEAR_CART" }],
//         ],
//       },
//     };

//     await telegramBot.sendMessage(chatId, summary, options);
//   } catch (err) {
//     console.error("View cart error:", err);
//     telegramBot.sendMessage(chatId, "❌ Could not load cart.");
//   }
// });

// async function handleProductDisplayMethod(
//   chatId: number,
//   messageId: number,
//   method: string
// ) {
//   try {
//     if (method === "all") {
//       await sendAllProducts(chatId);
//       await telegramBot.deleteMessage(chatId, messageId);
//     } else if (method === "browse") {
//       await handleProductBrowsing(chatId, messageId, 0);
//     }
//   } catch (error) {
//     console.error("Product method error:", error);
//     telegramBot.sendMessage(
//       chatId,
//       "❌ Error processing your request. Please try again."
//     );
//   }
// }

// async function sendAllProducts(chatId: number) {
//   try {
//     const products = await Product.find({ isAvailable: true }).exec();

//     if (products.length === 0) {
//       return telegramBot.sendMessage(
//         chatId,
//         "📭 No products available at the moment. Please check back later!"
//       );
//     }

//     await telegramBot.sendMessage(
//       chatId,
//       `📊 *Found ${products.length} available products:*`,
//       { parse_mode: "Markdown" }
//     );

//     for (let i = 0; i < products.length; i++) {
//       const product = products[i];
//       const message = `
// 🏷️ *${product.name}*
// ━━━━━━━━━━━━━━━━
// 📝 ${product.description || "No description available"}
// ━━━━━━━━━━━━━━━━
// 💰 *Price:* $${product.price.toFixed(2)}
// 📦 *Stock:* ${product.stock > 0 ? `${product.stock} available` : "Out of stock"}
// 🏷️ *Category:* ${product.category || "Uncategorized"}
//       `;

//       const keyboard = {
//         inline_keyboard: [
//           [
//             {
//               text: "🔍 View Details",
//               callback_data: `PRODUCT_DETAIL|${product._id}`,
//             },
//             {
//               text: "Add to cart",
//               callback_data: `ADD_CAR|${product._id}`,
//             },
//           ],
//         ],
//       };

//       const finalPhotoUrl = formatImageUrl(product.imageUrl);

//       if (finalPhotoUrl) {
//         try {
//           await telegramBot.sendPhoto(chatId, finalPhotoUrl, {
//             caption: message,
//             parse_mode: "Markdown",
//             reply_markup: keyboard,
//           });
//         } catch (photoError) {
//           console.error(
//             `Photo send failed for product ${product._id}:`,
//             photoError
//           );
//           await telegramBot.sendMessage(chatId, message, {
//             parse_mode: "Markdown",
//             reply_markup: keyboard,
//           });
//         }
//       } else {
//         await telegramBot.sendMessage(chatId, message, {
//           parse_mode: "Markdown",
//           reply_markup: keyboard,
//         });
//       }

//       if (i < products.length - 1) {
//         await new Promise((resolve) => setTimeout(resolve, 300));
//       }
//     }
//   } catch (error) {
//     console.error("Send all products error:", error);
//     telegramBot.sendMessage(chatId, "❌ Error fetching products.");
//   }
// }

// async function handleProductBrowsing(
//   chatId: number,
//   messageId?: number,
//   startIndex: number = 0
// ) {
//   try {
//     const products = await Product.find({ isAvailable: true }).exec();

//     if (products.length === 0) {
//       const text = "📭 No products available.";
//       if (messageId)
//         await telegramBot.editMessageText(text, {
//           chat_id: chatId,
//           message_id: messageId,
//         });
//       else await telegramBot.sendMessage(chatId, text);
//       return;
//     }

//     const currentIndex = Math.min(startIndex, products.length - 1);
//     const product = products[currentIndex];

//     productBrowsingStates.set(chatId, {
//       currentIndex,
//       productIds: products.map((p) => p._id.toString()),
//       messageId,
//     });

//     const message = `
// 🏷️ *${product.name}* (${currentIndex + 1}/${products.length})
// ━━━━━━━━━━━━━━━━
// 📝 ${product.description || "No description available"}
// ━━━━━━━━━━━━━━━━
// 💰 *Price:* $${product.price.toFixed(2)}
// 📦 *Stock:* ${product.stock > 0 ? `${product.stock} available` : "Out of stock"}
// 🏷️ *Category:* ${product.category || "Uncategorized"}
//     `;

//     const keyboard: InlineKeyboardButton[][] = [];
//     if (products.length > 1) {
//       keyboard.push([
//         { text: "◀️ Previous", callback_data: `PRODUCT_PREV|${currentIndex}` },
//         { text: "🔄 Refresh", callback_data: "PRODUCT_REFRESH" },
//         { text: "Next ▶️", callback_data: `PRODUCT_NEXT|${currentIndex}` },
//       ]);
//     }
//     keyboard.push([
//       {
//         text: "🔍 View Details",
//         callback_data: `PRODUCT_DETAIL|${product._id}`,
//       },
//       {
//         text: "Add to cart",
//         callback_data: `ADD_CAR|${product._id}`,
//       },
//       { text: "📦 Send All", callback_data: "PRODUCT_METHOD|all" },
//     ]);

//     const photoUrl = formatImageUrl(product.imageUrl);

//     if (messageId) {
//       if (photoUrl) {
//         try {
//           await telegramBot.editMessageMedia(
//             {
//               type: "photo",
//               media: photoUrl,
//               caption: message,
//               parse_mode: "Markdown",
//             },
//             {
//               chat_id: chatId,
//               message_id: messageId,
//               reply_markup: { inline_keyboard: keyboard },
//             }
//           );
//         } catch {
//           await telegramBot.editMessageText(message, {
//             chat_id: chatId,
//             message_id: messageId,
//             parse_mode: "Markdown",
//             reply_markup: { inline_keyboard: keyboard },
//           });
//         }
//       } else {
//         await telegramBot.editMessageText(message, {
//           chat_id: chatId,
//           message_id: messageId,
//           parse_mode: "Markdown",
//           reply_markup: { inline_keyboard: keyboard },
//         });
//       }
//     } else {
//       let sentMsg;
//       if (photoUrl) {
//         try {
//           sentMsg = await telegramBot.sendPhoto(chatId, photoUrl, {
//             caption: message,
//             parse_mode: "Markdown",
//             reply_markup: { inline_keyboard: keyboard },
//           });
//         } catch {
//           sentMsg = await telegramBot.sendMessage(chatId, message, {
//             parse_mode: "Markdown",
//             reply_markup: { inline_keyboard: keyboard },
//           });
//         }
//       } else {
//         sentMsg = await telegramBot.sendMessage(chatId, message, {
//           parse_mode: "Markdown",
//           reply_markup: { inline_keyboard: keyboard },
//         });
//       }
//       const state = productBrowsingStates.get(chatId);
//       if (state) state.messageId = sentMsg.message_id;
//     }
//   } catch (error) {
//     console.error("Browsing error:", error);
//   }
// }

// async function handleNextProduct(chatId: number, messageId: number) {
//   const state = productBrowsingStates.get(chatId);
//   if (!state) return handleProductBrowsing(chatId, messageId, 0);
//   const nextIndex = (state.currentIndex + 1) % state.productIds.length;
//   await handleProductBrowsing(chatId, messageId, nextIndex);
// }

// async function handlePreviousProduct(chatId: number, messageId: number) {
//   const state = productBrowsingStates.get(chatId);
//   if (!state) return handleProductBrowsing(chatId, messageId, 0);
//   const prevIndex =
//     state.currentIndex === 0
//       ? state.productIds.length - 1
//       : state.currentIndex - 1;
//   await handleProductBrowsing(chatId, messageId, prevIndex);
// }

// async function handleRefreshProduct(chatId: number, messageId: number) {
//   const state = productBrowsingStates.get(chatId);
//   await handleProductBrowsing(chatId, messageId, state?.currentIndex || 0);
// }

// async function handleProductDetail(chatId: number, productId: string) {
//   try {
//     const product = await Product.findById(productId).exec();
//     if (!product)
//       return telegramBot.sendMessage(chatId, "❌ Product not found.");

//     const message = `
// 📋 *Product Details*
// ━━━━━━━━━━━━━━━━
// 🏷️ *Name:* ${product.name}
// ━━━━━━━━━━━━━━━━
// 📝 *Description:*
// ${product.description || "No description available"}
// ━━━━━━━━━━━━━━━━
// 💰 *Price:* $${product.price.toFixed(2)}
// 📦 *Stock:* ${product.stock} units
// ✅ *Status:* ${product.isAvailable ? "Available" : "Out of Stock"}
// 🏷️ *Category:* ${product.category || "Uncategorized"}
//     `;

//     const keyboard = {
//       inline_keyboard: [
//         [
//           {
//             text: "← Back to Browse",
//             callback_data: `PRODUCT_BROWSE|${
//               productBrowsingStates.get(chatId)?.currentIndex || 0
//             }`,
//           },
//           {
//             text: "Add to cart",
//             callback_data: `ADD_CAR|${product._id}`,
//           },
//         ],
//       ],
//     };

//     const photoUrl = formatImageUrl(product.imageUrl);

//     if (photoUrl) {
//       try {
//         await telegramBot.sendPhoto(chatId, photoUrl, {
//           caption: message,
//           parse_mode: "Markdown",
//           reply_markup: keyboard,
//         });
//       } catch {
//         await telegramBot.sendMessage(chatId, message, {
//           parse_mode: "Markdown",
//           reply_markup: keyboard,
//         });
//       }
//     } else {
//       await telegramBot.sendMessage(chatId, message, {
//         parse_mode: "Markdown",
//         reply_markup: keyboard,
//       });
//     }
//   } catch (error) {
//     console.error("Detail error:", error);
//   }
// }

// telegramBot.onText(/\/status/, (msg) => {
//   telegramBot.sendMessage(
//     msg.chat.id,
//     `Bot status: Running\nMode: ${process.env.NODE_ENV}`
//   );
// });

// telegramBot.on("polling_error", (error) =>
//   console.log(`Polling error: `, error)
// );

// telegramBot.onText(/\/clear/, async (msg) => {
//   try {
//     await telegramBot.deleteMessage(msg.chat.id, msg.message_id);
//     const response = await telegramBot.sendMessage(
//       msg.chat.id,
//       "Cleaning up..."
//     );
//     setTimeout(
//       () => telegramBot.deleteMessage(msg.chat.id, response.message_id),
//       3000
//     );
//   } catch (error) {
//     console.error("Delete failed:", error);
//   }
// });

// export const setupBotCommands = () => {
//   telegramBot.setMyCommands([
//     { command: "start", description: "Start the bot" },
//     { command: "products", description: "Browse available products" },
//     { command: "cart", description: "View your cart" },
//     { command: "status", description: "Check bot status" },
//     { command: "clear", description: "Clear messages" },
//   ]);
// };

// setupBotCommands();
