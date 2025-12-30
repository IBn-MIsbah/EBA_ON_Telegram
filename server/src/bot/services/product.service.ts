import { Product } from "../../models/Product.js";
import { formatImageUrl } from "./image.service.js";

export class ProductService {
  static async getAvailableProducts() {
    return await Product.find({ isAvailable: true }).exec();
  }

  static async getProductById(id: string) {
    return await Product.findById(id).exec();
  }

  static async getProductCount() {
    return await Product.countDocuments({ isAvailable: true });
  }

  static formatProductMessage(
    product: any,
    currentIndex?: number,
    total?: number
  ) {
    const indexInfo =
      currentIndex !== undefined && total !== undefined
        ? ` (${currentIndex + 1}/${total})`
        : "";

    return `
🏷️ *${product.name}*${indexInfo}
━━━━━━━━━━━━━━━━
📝 ${product.description || "No description available"}
━━━━━━━━━━━━━━━━
💰 *Price:* $${product.price.toFixed(2)}
📦 *Stock:* ${product.stock > 0 ? `${product.stock} available` : "Out of stock"}
🏷️ *Category:* ${product.category || "Uncategorized"}
    `.trim();
  }

  static formatProductDetail(product: any) {
    return `
📋 *Product Details*
━━━━━━━━━━━━━━━━
🏷️ *Name:* ${product.name}
━━━━━━━━━━━━━━━━
📝 *Description:*
${product.description || "No description available"}
━━━━━━━━━━━━━━━━
💰 *Price:* $${product.price.toFixed(2)}
📦 *Stock:* ${product.stock} units
✅ *Status:* ${product.isAvailable ? "Available" : "Out of Stock"}
🏷️ *Category:* ${product.category || "Uncategorized"}
    `.trim();
  }

  static getProductImageUrl(product: any) {
    return formatImageUrl(product.imageUrl);
  }
}
