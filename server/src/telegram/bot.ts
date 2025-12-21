import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN, isProduction } from "../common/index.js";
import { createUser } from "./util/user.js";

if (!BOT_TOKEN) {
  throw new Error("Telegram Bot token is not defined in .env");
}

export const telegramBot = new TelegramBot(BOT_TOKEN, {
  polling: !isProduction,
});

telegramBot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [
        [
          {
            text: "Register with Phone Number",
            request_contact: true,
          },
        ],
      ],
    },
  };

  telegramBot.sendMessage(
    chatId,
    `Hello, ${msg.from?.username}\nWellcome To EBA Store`,
    options
  );
});

telegramBot.on("contact", async (msg) => {
  const chatId = msg.chat.id;

  const phone = msg.contact?.phone_number;
  const name = msg.contact?.first_name || msg.from?.first_name || "Unkwown";
  const telegramUserId = msg.contact?.user_id || msg.from?.id;

  if (!phone) return;
  if (!telegramUserId) throw new Error("Telegram User_id is missing");

  try {
    const user = {
      name: name,
      phone: phone,
      telegramUserId: String(telegramUserId),
    };

    // Call your utility function
    const newUser = await createUser(user);

    if (newUser) {
      telegramBot.sendMessage(
        chatId,
        "✅ Registration successful! You can now use the store.",
        {
          reply_markup: { remove_keyboard: true }, // Removes the share button
        }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    telegramBot.sendMessage(
      chatId,
      "❌ Sorry, registration failed. Please try again later."
    );
  }
});

telegramBot.onText(/\/status/, (msg) => {
  const chatId = msg.chat.id;

  telegramBot.sendMessage(
    chatId,
    `Bot status: 
        * Server: Running
        * Mode: ${process.env.NODE_ENV}
        * Time: ${new Date().toLocaleString()}`
  );
});

telegramBot.on("polling_error", (error) => {
  console.log(`Telegram polling error: `, error);
});

telegramBot.onText(/\/clear/, async (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  try {
    await telegramBot.deleteMessage(chatId, messageId);
    const response = await telegramBot.sendMessage(chatId, "Cleaning up...");

    setTimeout(() => {
      telegramBot.deleteMessage(chatId, response.message_id);
    }, 3000);
  } catch (error) {
    console.error("Failed to delete message: ", error);
    telegramBot.sendMessage(
      chatId,
      " I don't have permission to delete message here."
    );
  }
});
export const setupBotCommands = () => {
  telegramBot.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "status", description: "Check bot status" },
    { command: "clear", description: "Clear history" },
  ]);
};

setupBotCommands();
