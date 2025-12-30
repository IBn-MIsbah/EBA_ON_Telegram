import { Cart } from "../../models/Cart.js";
import { Product } from "../../models/Product.js";

export class CartService {
  static async getOrCreateCart(telegramUserId: string) {
    let cart = await Cart.findOne({ telegramUserId });
    if (!cart) {
      cart = new Cart({ telegramUserId, items: [] });
      await cart.save();
    }
    return cart;
  }

  static async addToCart(telegramUserId: string, productId: string) {
    const cart = await this.getOrCreateCart(telegramUserId);

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ productId: productId as any, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  static async getCartWithProducts(telegramUserId: string) {
    return await Cart.findOne({ telegramUserId }).populate("items.productId");
  }

  static async clearCart(telegramUserId: string) {
    return await Cart.findOneAndUpdate(
      { telegramUserId },
      { items: [] },
      { new: true }
    );
  }

  static calculateCartTotal(cart: any) {
    let total = 0;
    cart.items.forEach((item: any) => {
      total += item.productId.price * item.quantity;
    });
    return total;
  }

  static formatCartSummary(cart: any) {
    let total = 0;
    let summary = "🛒 *Your Shopping Cart:*\n━━━━━━━━━━━━━━━\n";

    cart.items.forEach((item: any) => {
      const subtotal = item.productId.price * item.quantity;
      total += subtotal;
      summary += `🔹 *${item.productId.name}*\n   ${
        item.quantity
      } x $${item.productId.price.toFixed(2)} = *$${subtotal.toFixed(2)}*\n`;
    });

    summary += `━━━━━━━━━━━━━━━\n💰 *Total: $${total.toFixed(2)}*`;
    return summary;
  }
}
