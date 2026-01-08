import TelegramBot from "node-telegram-bot-api";

export const sendPersistentMenu = async (
  chatId: number,
  text: string,
  telegramBot: TelegramBot
) => {
  await telegramBot.sendMessage(chatId, text, {
    reply_markup: {
      keyboard: [
        [{ text: "🛍 Browse Products" }, { text: "🛒 View Cart" }],
        [{ text: "📋 My Orders" }, { text: "📞 Contact Support" }],
        [{ text: "⚙️ Settings" }],
      ],
      // Professional UX Settings:
      resize_keyboard: true, // Makes buttons fit the height of the text (essential!)
      one_time_keyboard: false, // Keeps the keyboard visible after tapping a button
      persistent: true, // Ensures the keyboard icon stays in the input field
      input_field_placeholder: "Choose an option...", // Text shown in the empty input bar
    },
    parse_mode: "Markdown",
  });
};
