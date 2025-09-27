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
