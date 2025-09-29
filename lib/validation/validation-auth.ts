import { z } from "zod";
export const SignInSchema = z.object({
  email: z.email({ error: "Invalid email address" }).min(1, { error: "Email is required" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long" })
    .max(50, { error: "Password cannot exceed 50 characters" }),
});
export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, {
      error: "Username must be at least 3 characters long",
    })
    .max(30, { error: "Username cannot exceed 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: "Username can only contain letters, numbers, and underscores",
    }),
  email: z.email({ error: "Invalid email address" }).min(1, { error: "Email is required" }),
  password: z
    .string()
    .min(8, {
      error: "Password must be at least 8 characters long",
    })
    .max(50, { error: "Password cannot exceed 50 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});
export const signInOAuthSchema = z.object({
  provider: z.enum(["google"]), // Extend this enum as you add more providers
  providerAccountId: z.string().min(1, { message: "Provider Account ID is required." }),
  user: z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long." }),
    email: z.string().email({ message: "Please provide a valid email address." }),
    image: z.string().url("Invalid image URL").optional(),
  }),
});
export const UserSchema = SignUpSchema.pick({
  username: true,
  email: true,
}).extend({
  image: z.url({ error: "Please provide a valid image URL" }).optional(),
  balance: z.object({
    current: z.number().default(0).optional(),
    income: z.number().default(0).optional(),
    expenses: z.number().default(0).optional(),
  }),
});

export const AccountSchema = z.object({
  userId: z.string({ error: "User ID is required" }).min(1, { error: "User ID is required" }),
  provider: z.string({ error: "Provider is required" }).min(1, { error: "Provider is required" }),
  providerAccountId: z
    .string({ error: "Provider Account ID is required" })
    .min(1, { error: "Provider Account ID is required" }),
  image: z.url({ error: "Please provide a valid image URL" }).optional(),
  password: z
    .string()
    .min(8, {
      error: "Password must be at least 8 characters long",
    })
    .max(50, { error: "Password cannot exceed 50 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
});
