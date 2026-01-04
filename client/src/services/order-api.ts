import type { OrderResponse } from "../schemas/orderSchema";
import { api } from "./api-client";

export const getOrders = async (): Promise<OrderResponse> => {
  const response = await api.get("/orders");
  return response.data;
};
