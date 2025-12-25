import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN, isProduction } from "../common/index.js";
import { User } from "../models/User.js";

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

telegramBot.on("contact", async (msg) => {
  const chatId = msg.chat.id;
  if (!chatId) return;
  const phone = msg.contact?.phone_number;
  const name = msg.contact?.first_name || msg.from?.first_name || "Unkwown";
  const telegramUserId = String(msg.contact?.user_id || msg.from?.id);

  if (!phone) return;
  if (!telegramUserId || telegramUserId === "undifiend")
    throw new Error("Telegram User_id is missing");

  try {
    await User.findOneAndUpdate(
      { telegramUserId: telegramUserId },
      { name, phone, telegramUserId, role: "USER" },
      { upsert: true, new: true }
    );
    const genderOptions = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Male 👨", callback_data: `GEN_M|${telegramUserId}` },
            { text: "Female 👩", callback_data: `GEN_F|${telegramUserId}` },
          ],
        ],
      },
    };

    await telegramBot.sendMessage(
      chatId,
      `Thanks ${name}! One last step.\nPlease select your gender:`,
      {
        ...genderOptions,
        reply_markup: {
          ...genderOptions.reply_markup,
        },
      }
    );
  } catch (error) {
    console.error("Contact handler error:", error);
    telegramBot.sendMessage(
      chatId,
      "❌ Something went wrong. Please try /stat again."
    );
  }
});

telegramBot.on("callback_query", async (query) => {
  const chatId = query.message?.chat.id;
  const messageId = query.message?.message_id;
  const data = query.data;

  if (!chatId || !messageId || !data) {
    return telegramBot.answerCallbackQuery(query.id, {
      text: "Error: Message expired or invalid data.",
    });
  }

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
          `✅ Registration successful!\n\nWelcome to EBA Store ${updateUser.name}!`,
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
  telegramBot.answerCallbackQuery(query.id);
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
  ]);
};

setupBotCommands();
