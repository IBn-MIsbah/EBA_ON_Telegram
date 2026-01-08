import path from "node:path";
import fs from "node:fs";
import http from "node:http";
import https from "node:https";

import { Order } from "../../models/Order.js";
import { User } from "../../models/User.js";
import { telegramBot } from "../bot.js";
import axios from "axios";
import { Cart } from "../../models/Cart.js";

export const CheckoutHandler = async () => {
  telegramBot.on("photo", async (msg) => {
    const chatId = msg.chat.id;
    if (!msg.photo || msg.photo.length === 0) return;

    const telegramUserId = msg.from?.id;
    let localFilePath = "";

    try {
      const user = await User.findOne({
        telegramUserId: String(telegramUserId),
      });
      if (!user) return;

      const pendingOrder = await Order.findOne({
        userId: user._id,
        status: "awaiting_payment",
      }).sort({ createdAt: -1 });

      if (!pendingOrder) return;

      if (pendingOrder) {
        const fileId = msg.photo[msg.photo.length - 1].file_id;
        const fileLink = await telegramBot.getFileLink(fileId);

        pendingOrder.telegramFileId = fileId;

        const uploadDir = path.join(
          process.cwd(),
          "public",
          "uploads",
          "transactions"
        );
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `receipt-${
          pendingOrder.orderNumber
        }-${Date.now()}.jpg`;
        localFilePath = path.join(uploadDir, fileName);

        const response = await axios({
          url: fileLink,
          method: "GET",
          responseType: "stream",
          timeout: 30000,
          httpAgent: new http.Agent({ family: 4 }),
          httpsAgent: new https.Agent({ family: 4 }),
        });

        const writer = fs.createWriteStream(localFilePath);

        await new Promise((resolve, reject) => {
          response.data.pipe(writer);
          writer.on("finish", resolve);
          writer.on("error", (err) => {
            writer.close();
            reject(err);
          });
        });

        await Cart.findOneAndUpdate(
          { telegramUserId: String(telegramUserId) },
          { items: [] }
        );

        pendingOrder.paymentProof = `/public/uploads/transactions/${fileName}`;
        pendingOrder.status = "payment_received";
        await pendingOrder.save();

        await telegramBot.sendMessage(
          chatId,
          `✅ *Payment proof received* for Order \`${pendingOrder.orderNumber}\`.`,
          { parse_mode: "Markdown" }
        );
      }
    } catch (err) {
      console.error("Error processing payment proof:", err);

      // 🧹 CLEANUP: Delete the file if it was partially created
      if (localFilePath && fs.existsSync(localFilePath)) {
        try {
          fs.unlinkSync(localFilePath);
        } catch (e) {
          console.error("Unlink error:", e);
        }
      }

      // 📢 USER FEEDBACK: Be more descriptive
      await telegramBot
        .sendMessage(
          chatId,
          "❌ *Upload Failed.*\nWe couldn't process your receipt. This is usually due to a temporary network issue. Please try sending the photo again.",
          { parse_mode: "Markdown" }
        )
        .catch((e) =>
          console.error("Error sending failure message:", e.message)
        );
    }
  });
};
