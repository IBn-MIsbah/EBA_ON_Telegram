import { telegramBot } from "../bot.js";
import { HandleCartItem } from "../helper/HandleCartItem.js";

export const setupCartCommand = () => {
  telegramBot.onText(/\/cart/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramUserId = msg.from?.id;

    console.log("chatId: ", chatId);
    console.log("telegramUserId: ", telegramUserId);

    if (!telegramUserId) return;

    await HandleCartItem(chatId, telegramUserId, telegramBot);
  });
};
