import z from "zod";

export const productSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  imageUrl: z.url(),
  stock: z.number(),
  isAvailable: z.boolean(),
  price: z.number(),
});

export const productCreateInputSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  stock: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "string" && val.trim() !== "") {
        return Number(val);
      }
      return val;
    })
    .pipe(z.number({ error: "Quantity is required" })),
  isAvailable: z
    .union([z.string(), z.boolean()])
    .transform((val) => {
      if (typeof val === "string" && val.trim() !== "") {
        return Boolean(val);
      }
      return val;
    })
    .pipe(z.boolean({ error: "Mark as available" })),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "string" && val.trim() !== "") {
        return Number(val);
      }
      return val;
    })
    .pipe(z.number({ error: "Price is required" })),
});

export const productUpdateInputSchema = z
  .object({
    name: z.string().optional(),
    describtion: z.string().optional(),
    imageUrl: z.url().optional(),
    stock: z
      .union([z.string(), z.number()])
      .transform((val) => {
        if (typeof val === "string" && val.trim() !== "") {
          return Number(val);
        }
        return val;
      })
      .pipe(z.number({ error: "Quantity is required" }))
      .optional(),
    isAvailable: z
      .union([z.string(), z.boolean()])
      .transform((val) => {
        if (typeof val === "string" && val.trim() !== "") {
          return Boolean(val);
        }
        return val;
      })
      .pipe(z.boolean({ error: "Mark as available" }))
      .optional(),
    price: z
      .union([z.string(), z.number()])
      .transform((val) => {
        if (typeof val === "string" && val.trim() !== "") {
          return Number(val);
        }
        return val;
      })
      .pipe(z.number({ error: "Price is required" }))
      .optional(),
  })
  .partial();

export const productWhereUniqueInput = z.object({
  _id: z.string(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductCreateInput = z.infer<typeof productCreateInputSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateInputSchema>;
export type ProductWhereUnique = z.infer<typeof productWhereUniqueInput>;
