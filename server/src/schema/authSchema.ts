import z from "zod";

export const loginInputSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LonginInput = z.infer<typeof loginInputSchema>;
