import { telegramBot } from "../bot.js";

export function setupStartCommand() {
  telegramBot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const options = {
      reply_markup: {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: "📱 Register with Phone Number",
              request_contact: true,
            },
          ],
        ],
      },
    };

    telegramBot.sendMessage(
      chatId,
      `Hello ${msg.from?.first_name}!\nWelcome to EBA Store. Please share your contact to start.`,
      options
    );
  });
}
