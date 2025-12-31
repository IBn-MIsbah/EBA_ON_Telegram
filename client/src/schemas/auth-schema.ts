import z from "zod";

export const loginSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  role: z.enum(["ADMIN", "USER"]),
  isActive: z.boolean(),
});

export const loginInputSchema = z.object({
  email: z.email({error: 'Invalid Email!'}).min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const meSchema = z.object({
  success: z.boolean(),
  data: z.object({
    _id: z.string(),
    name: z.string(),
    phone: z.string().optional(),
    email: z.email(),
    role: z.enum(["ADMIN", "USER", "AMIR", "VICEAMIR", "AMIRA", "VICEAMIRA"]),
  }),
});

export type Login = z.infer<typeof loginSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type Me = z.infer<typeof meSchema>;
