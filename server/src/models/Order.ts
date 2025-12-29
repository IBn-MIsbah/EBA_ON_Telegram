// models/Order.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  products: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: "pending" | "paid" | "confirmed" | "shipped" | "cancelled";
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
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1, required: true },
        price: { type: Number },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "awaiting_payment",
        "payment_received",
        "verified",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentProof: { type: String },
    adminNotes: { trype: String },
    shippingAddress: { type: String },
    telegramMessageId: { type: Number },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
