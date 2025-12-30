import { telegramBot } from "../bot.js";

export function setupStatusCommand() {
  telegramBot.onText(/\/status/, (msg) => {
    telegramBot.sendMessage(
      msg.chat.id,
      `Bot status: Running\nMode: ${process.env.NODE_ENV}`
    );
  });
}
