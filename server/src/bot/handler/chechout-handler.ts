import path from "node:path";
import fs from "node:fs";
import http from "node:http";
import https from "node:https";

import { Order } from "../../models/Order.js";
import { User } from "../../models/User.js";
import { telegramBot } from "../bot.js";
import axios from "axios";

export const CheckoutHandler = async () => {
  telegramBot.on("photo", async (msg) => {
    // 1. Safety Guard
    if (!msg.photo || msg.photo.length === 0) return;

    const telegramUserId = msg.from?.id;
    if (!telegramUserId) return;

    try {
      const user = await User.findOne({
        telegramUserId: String(telegramUserId),
      });
      if (!user) return;

      const pendingOrder = await Order.findOne({
        userId: user._id,
        status: "awaiting_payment",
      }).sort({ createdAt: -1 });
      console.log(
        "📦 4. Pending Order found:",
        pendingOrder?.orderNumber || "NONE"
      );

      if (pendingOrder) {
        const fileId = msg.photo[msg.photo.length - 1].file_id;
        const fileLink = await telegramBot.getFileLink(fileId);

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
        const localFilePath = path.join(uploadDir, fileName);

        const response = await axios({
          url: fileLink,
          method: "GET",
          responseType: "stream",
          timeout: 3000,
          httpAgent: new http.Agent({ family: 4 }),
          httpsAgent: new https.Agent({ family: 4 }),
        });

        const writer = fs.createWriteStream(localFilePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        pendingOrder.paymentProof = `/public/uploads/transactions/${fileName}`;
        pendingOrder.status = "payment_received";
        await pendingOrder.save();

        await telegramBot.sendMessage(
          msg.chat.id,
          `✅ *Payment proof received* for Order \`${pendingOrder.orderNumber}\`.\n\nOur team will verify it shortly. Thank you!`,
          { parse_mode: "Markdown" }
        );
      }
    } catch (err) {
      console.error("Error processing payment proof:", err);
      // Optional: Notify user that upload failed
    }
  });
};
