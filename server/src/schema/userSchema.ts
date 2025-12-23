import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  telegramUserId: z.string().optional(),
  role: z
    .enum(["USER", "AMIR", "AMIRA", "VICEAMIR", "VICEAMIRA", "ADMIN"])
    .default("USER"),
  gender: z.enum(["MALE", "FEMALE"]),
});

export const userCreateInputSchema = z.object({
  name: z.string(),
  phone: z.string().max(10).min(10),
  role: z
    .enum(["USER", "AMIR", "AMIRA", "VICEAMIR", "VICEAMIRA", "ADMIN"])
    .default("USER"),
  gender: z.enum(["MALE", "FEMALE"]),
  password: z.string().min(6),
  telegramUserId: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type UserCreateInput = z.infer<typeof userCreateInputSchema>;
