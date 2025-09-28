"use server";

import { validateAction } from "@/lib/handler/validate";
import { SignUpSchema } from "@/lib/validation/validation-auth";
import mongoose from "mongoose";
import User from "../models/user.model";
import Account from "../models/account.model";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

// export async function SignInWithCredentials(params: AuthCredentials) {
//   const validate = await validateAction({
//     params,
//     schema: SignInSchema,
//   });
// }

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
