import {
  type LoginInput,
  type Login,
  type Me,
  meSchema,
} from "../schemas/auth-schema";
import { api } from "./api-client";

export const postLogin = async (data: LoginInput): Promise<Login> => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Login failed");
  }
};

export const postLogout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout", error);
    throw new Error("smtg wrong");
  }
};

export const getMe = async (): Promise<Me> => {
  try {
    const response = await api.get("/auth/me");
    const parsedResponse = meSchema.parse(response.data);

    return parsedResponse;
  } catch (error) {
    console.error("Me: ", error);
    throw new Error("smtg wrong");
  }
};

export const postRefresh = async () => {
  await api.post("/auth/refresh-token");
};
