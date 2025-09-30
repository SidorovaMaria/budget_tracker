import z from "zod";

export const PotSchema = z.object({
  name: z
    .string()
    .min(1, { error: "Pot name is required" })
    .max(30, { error: "Pot name is too long" }),
  target: z.coerce
    .number()
    .positive({ error: "Target must be a positive number" })
    .min(1, { error: "Target must be at least 1" }),
  themeId: z.string().min(1, { error: "Theme is required" }),
});
export const DeletePotSchema = z.object({
  potId: z.string().min(1, { error: "Pot ID is required" }),
});

export const BudgetSchema = z.object({
  categoryId: z.string().min(1, { error: "Category is required" }),
  maximum: z.coerce
    .number()
    .positive({ error: "Maximum must be a positive number" })
    .min(1, { error: "Maximum must be at least 1" }),
  themeId: z.string().min(1, { error: "Theme  is required" }),
});
