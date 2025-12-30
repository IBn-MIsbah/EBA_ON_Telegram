import { telegramBot } from "../bot.js";

export function setupClearCommand() {
  telegramBot.onText(/\/clear/, async (msg) => {
    try {
      await telegramBot.deleteMessage(msg.chat.id, msg.message_id);
      const response = await telegramBot.sendMessage(
        msg.chat.id,
        "Cleaning up..."
      );
      setTimeout(
        () => telegramBot.deleteMessage(msg.chat.id, response.message_id),
        3000
      );
    } catch (error) {
      console.error("Delete failed:", error);
    }
  });
}
