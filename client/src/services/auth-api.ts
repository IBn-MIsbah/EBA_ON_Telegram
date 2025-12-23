import {
  type LoginInput,
  type Login,
  type Me,
  meSchema,
} from "../schemas/auth-schema";
import { api } from "./api-client";
import { errorHandler } from "../util/errorHandler";

export const postLogin = async (data: LoginInput): Promise<Login> => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    errorHandler("Auth", error);
    throw new Error("smtg wrong");
  }
};

export const postLogout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    errorHandler("Logout", error);
    throw new Error("smtg wrong");
  }
};

export const getMe = async (): Promise<Me> => {
  try {
    const response = await api.get("/auth/me");
    const parsedResponse = meSchema.parse(response.data);

    return parsedResponse;
  } catch (error) {
    errorHandler("Me: ", error);
    throw new Error("smtg wrong");
  }
};

export const postRefresh = async () => {
  await api.post("/auth/refresh");
};
