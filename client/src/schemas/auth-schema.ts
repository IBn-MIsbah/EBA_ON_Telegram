import z from "zod";

export const loginSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  role: z.enum(["ADMIN", "USER"]),
  isActive: z.boolean(),
});

export const loginInputSchema = z.object({
  email: z.email({ error: "Invalid Email!" }).min(1, "Email is required"),
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
    gender: z.enum(["MALE", "FEMALE"]),
    accNO: z.string(),
    accHolderName: z.string(),
    bank: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
});

export const updateUserSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z
      .string()
      .min(10, "Phone number too short")
      .max(13, "Phone number too long")
      .optional(),
    email: z.email("Invalid email format").lowercase().optional(),
    role: z
      .enum(["USER", "AMIR", "AMIRA", "VICEAMIR", "VICEAMIRA", "ADMIN"])
      .optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional()
      .or(z.literal("")),
    bank: z.string().optional(),
    accNO: z.union([z.string(), z.number()]).optional(),
    accHolderName: z.string().optional(),
    isActive: z.boolean().optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
  })
  .partial();

export type User = Me["data"];
export type UpdateUserBody = z.infer<typeof updateUserSchema>;
export type Login = z.infer<typeof loginSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type Me = z.infer<typeof meSchema>;
