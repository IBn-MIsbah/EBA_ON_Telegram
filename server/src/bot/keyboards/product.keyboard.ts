import { InlineKeyboardButton } from "node-telegram-bot-api";

export class ProductKeyboards {
  static getProductMethodKeyboard(): InlineKeyboardButton[][] {
    return [
      [
        { text: "📦 Send All Products", callback_data: "PRODUCT_METHOD|all" },
        {
          text: "➡️ Browse One by One",
          callback_data: "PRODUCT_METHOD|browse",
        },
      ],
    ];
  }

  static getProductBrowseKeyboard(
    currentIndex: number,
    totalProducts: number,
    productId: string
  ): InlineKeyboardButton[][] {
    const keyboard: InlineKeyboardButton[][] = [];

    if (totalProducts > 1) {
      keyboard.push([
        { text: "◀️ Previous", callback_data: `PRODUCT_PREV|${currentIndex}` },
        { text: "🔄 Refresh", callback_data: "PRODUCT_REFRESH" },
        { text: "Next ▶️", callback_data: `PRODUCT_NEXT|${currentIndex}` },
      ]);
    }

    keyboard.push([
      { text: "🔍 View Details", callback_data: `PRODUCT_DETAIL|${productId}` },
      { text: "Add to cart", callback_data: `ADD_CAR|${productId}` },
      { text: "📦 Send All", callback_data: "PRODUCT_METHOD|all" },
    ]);

    return keyboard;
  }

  static getProductDetailKeyboard(
    currentIndex?: number
  ): InlineKeyboardButton[][] {
    const backData =
      currentIndex !== undefined
        ? `PRODUCT_BROWSE|${currentIndex}`
        : "PRODUCT_METHOD|browse";

    return [
      [
        { text: "← Back to Browse", callback_data: backData },
        { text: "Add to cart", callback_data: `ADD_CAR` },
      ],
    ];
  }

  static getProductListKeyboard(productId: string): InlineKeyboardButton[][] {
    return [
      [
        {
          text: "🔍 View Details",
          callback_data: `PRODUCT_DETAIL|${productId}`,
        },
        { text: "Add to cart", callback_data: `ADD_CAR|${productId}` },
      ],
    ];
  }
}
