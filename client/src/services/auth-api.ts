import {
  type LoginInput,
  type Login,
  type Me,
  type UpdateUserBody,
} from "../schemas/auth-schema";
import { api } from "./api-client";

export const postLogin = async (data: LoginInput): Promise<Login> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const postLogout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getMe = async (): Promise<Me> => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const postRefresh = async () => {
  await api.post("/auth/refresh-token");
};

export const patchData = async (id: string, data: UpdateUserBody) => {
  const response = await api.patch(`/auth/update/${id}`, data);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};
