import { InlineKeyboardButton } from "node-telegram-bot-api";

export class CommonKeyboards {
  static getGenderKeyboard(telegramUserId: string): InlineKeyboardButton[][] {
    return [
      [
        { text: "Male 👨", callback_data: `GEN_M|${telegramUserId}` },
        { text: "Female 👩", callback_data: `GEN_F|${telegramUserId}` },
      ],
    ];
  }

  static getCartKeyboard(): InlineKeyboardButton[][] {
    return [
      [{ text: "💳 Checkout", callback_data: "CHECKOUT" }],
      [{ text: "🗑 Clear Cart", callback_data: "CLEAR_CART" }],
    ];
  }
}
