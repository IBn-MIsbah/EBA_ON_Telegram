import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  telegramUserId: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

export const userCreateInputSchema = z.object({
  name: z.string(),
  phone: z.string().max(10).min(10),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
  password: z.string().min(6),
  telegramUserId: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type UserCreateInput = z.infer<typeof userCreateInputSchema>;
