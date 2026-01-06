import type { OrderResponse } from "../schemas/orderSchema";
import { api } from "./api-client";

export const getOrders = async (): Promise<OrderResponse> => {
  const response = await api.get("/orders");
  return response.data;
};

export const verifyOrder = async (orderId: string) => {
  const response = await api.patch(`/orders/verify/${orderId}`);
  return response.data;
};
