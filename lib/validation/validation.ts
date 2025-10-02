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

export const AddTransactionSchema = z.object({
  categoryId: z.string().min(1, { error: "Pick a category for this transaction" }),
  name: z
    .string()
    .min(1, { error: "Give your transaction a name (e.g. Grocery shopping)" })
    .max(30, { error: "Transaction name must be 30 characters or fewer" }),
  amount: z.coerce
    .number()
    .positive({ error: "Transaction amount must be greater than zero" })
    .min(0.01, { error: "Set an amount of at least 0.01" }),
  type: z.enum(["income", "expense"], { message: "Select a transaction type" }),
  date: z.preprocess((arg) => {
    if (typeof arg === "string" && /^\d{4}-\d{2}-\d{2}$/.test(arg)) {
      return new Date(arg + "T00:00:00"); // parsed as local day-start safely
    }
    if (arg instanceof Date) return arg;
    return arg;
  }, z.date({ message: "Enter a valid date" })),
  recurring: z.boolean().optional(),
});

export const searchParamsSchema = z
  .object({
    search: z.string().optional(),
    sort: z.string().optional(),
    filter: z.string().optional(),
  })
  .partial();

export const SearchParamsSchema = z.object({
  page: z.number().min(1, "Page must be at least 1").default(1),
  pageSize: z.number().min(1, "Page size must be at least 1").default(10),
  search: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});
