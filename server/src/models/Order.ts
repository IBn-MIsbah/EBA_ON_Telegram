// models/Order.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  userGender: String;
  products: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  phone: string;
  totalAmount: number;
  status:
    | "pending" // User clicked checkout
    | "awaiting_payment" // User seen bank details
    | "payment_received" // User uploaded screenshot
    | "verified" // Admin confirmed
    | "shipped"
    | "delivered"
    | "cancelled";

  paymentProof?: string; // URL to uploaded screenshot
  adminNotes?: string;
  shippingAddress: string;
  transactionReference?: string;
  telegramMessageId?: number; // For updating status in chat
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, unique: true, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userGender: { type: String, enum: ["MALE", "FEMALE"], required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1, required: true },
        price: { type: Number, required: true }, // Captured at time of checkout
      },
    ],
    phone: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending", // User clicked checkout
        "awaiting_payment", // User seen bank details
        "payment_received", // User uploaded screenshot
        "verified", // Admin confirmed
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentProof: { type: String }, // Path: 'uploads/transactions/receipt_123.jpg'
    adminNotes: { type: String }, // Fixed typo: type
    shippingAddress: { type: String },
    telegramMessageId: { type: Number },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
