import { api } from "./api-client";

export const postProduct = async (data: FormData) => {
  const response = api.post("/product", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return (await response).data;
};

export const getProducts = async () => {
  const response = api.get("/product");
  return (await response).data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/product/${id}`);
  return response.data;
};
