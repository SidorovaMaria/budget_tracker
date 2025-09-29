"use server";

import { validateAction } from "@/lib/handler/validate";
import { SignInSchema, SignUpSchema } from "@/lib/validation/validation-auth";
import mongoose from "mongoose";
import User from "../models/user.model";
import Account from "../models/account.model";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

export async function SignUpWithCredentials(params: AuthCredentials): Promise<ActionResponse> {
  const validated = await validateAction<AuthCredentials>({
    params,
    schema: SignUpSchema,
  });
  if (validated.success === false) return validated;

  const { username, email, password } = validated.params;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      return { success: false, status: 409, error: { message: "User already exists" } };
    }

    //Hash Password
    const hashedPasswword = await bcrypt.hash(password, 12);
    // 3) Create user
    const user = await User.create([{ username, email }], { session });
    const [newUser] = user;

    // 4) Create account mapping for credentials provider
    await Account.create(
      [
        {
          userId: newUser._id,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPasswword,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    // 5) Auto sign-in (server helper)

    await signIn("credentials", { email, password, redirect: false });

    return { success: true, status: 201 };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
}

export async function SignInWithCredentials(params: SignInParams): Promise<ActionResponse> {
  const validated = await validateAction<SignInParams>({
    params,
    schema: SignInSchema,
  });
  if (validated.success === false) return validated;
  const { email, password } = validated.params;
  try {
    const existingUser = await User.find({ email });
    if (!existingUser) {
      return {
        success: false,
        status: 401,
        error: { message: "No account found with given credentials" },
      };
    }
    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });
    if (!existingAccount) {
      return {
        success: false,
        status: 401,
        error: { message: "No account found with given credentials" },
      };
    }
    const passwordMatch = await bcrypt.compare(password, existingAccount.password);
    if (!passwordMatch) {
      return {
        success: false,
        status: 401,
        error: { message: "Invalid password" },
      };
    }
    await signIn("credentials", { email, password, redirect: false });
    return { success: true, status: 200 };
  } catch (error) {
    return { success: false, status: 500, error: { message: "Internal server error" + error } };
  }
}
