import z from "zod";

export const PotSchema = z.object({
  name: z
    .string()
    .min(1, { error: "Give your pot a name (e.g. Rainy Day Fund)" })
    .max(30, { error: "Pot name must be 30 characters or fewer" }),
  target: z.coerce
    .number()
    .positive({ error: "Your target amount has to be greater than zero" })
    .min(1, { error: "Set a target of at least 1" }),
  themeId: z.string().min(1, { error: "Choose a color tag for this pot" }),
});
export const DeletePotSchema = z.object({
  potId: z.string().min(1, { error: "Missing pot ID — cannot delete" }),
});

export const BudgetSchema = z.object({
  categoryId: z.string().min(1, { error: "Pick a category for this budget" }),
  maximum: z.coerce
    .number()
    .positive({ error: "Maximum budget must be larger than zero" })
    .min(1, { error: "Set a budget of at least 1" }),
  themeId: z.string().min(1, { error: "Choose a theme for this budget" }),
});

export const AddWithdrawFromPotSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, { error: "Enter at least 1 to add or withdraw" })
    .positive({ error: "Amount must be greater than zero" }),
});
