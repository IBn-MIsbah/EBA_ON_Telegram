import { z } from "zod";

// 1. Schema for the populated Product details
const ProductDetailsSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  stock: z.number(),
  isAvailable: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  __v: z.number(),
});

// 2. Schema for the item inside the products array
const OrderProductSchema = z.object({
  productId: ProductDetailsSchema, // Matches the populated object
  quantity: z.number().int().positive(),
  price: z.number(),
  _id: z.string(),
});

// 3. Main Order Schema
const OrderSchema = z.object({
  _id: z.string(),
  orderNumber: z.string(),
  userId: z.string(),
  userGender: z.enum(["MALE", "FEMALE"]),
  products: z.array(OrderProductSchema),
  phone: z.string(),
  totalAmount: z.number(),
  status: z.enum([
    "pending",
    "awaiting_payment",
    "payment_received",
    "verified",
    "shipped",
    "delivered",
    "cancelled",
  ]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  telegramMessageId: z.number().optional(),
  paymentProof: z.string().optional(),
  adminNotes: z.string().optional(),
  __v: z.number().optional(),
});

export const OrderResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(OrderSchema),
});

export type Order = z.infer<typeof OrderSchema>;
export type OrderResponse = z.infer<typeof OrderResponseSchema>;
