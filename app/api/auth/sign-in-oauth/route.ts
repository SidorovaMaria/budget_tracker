import Account from "@/database/models/account.model";
import User from "@/database/models/user.model";
import connectDB from "@/lib/mongoose";

import { NextResponse } from "next/server";
import slugify from "slugify";
import mongoose from "mongoose";
import { signInOAuthSchema } from "@/lib/validation/validation-auth";
export async function POST(request: Request) {
  const { provider, providerAccountId, user } = await request.json();
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validatedData = signInOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });
    if (!validatedData.success) {
      return new Error("Invalid data");
    }
    const { username, email, image } = validatedData.data.user;
    const slug_username = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
      replacement: "_",
    });
    let existingUser = await User.findOne({ email }).session(session);
    if (!existingUser) {
      [existingUser] = await User.create(
        [
          {
            username: slug_username,
            email,
            image,
            balance: {
              current: 4836,
              income: 3814.25,
              expenses: 1700.5,
            },
          },
        ],
        { session }
      );
    } else {
      const updatedData: { username?: string; image?: string } = {};
      if (existingUser.username !== slug_username) updatedData.username = slug_username;
      if (existingUser.image !== image) updatedData.image = image;
      if (Object.keys(updatedData).length > 0) {
        await User.updateOne({ _id: existingUser._id }, { $set: updatedData }).session(session);
      }
    }
    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }
    await session.commitTransaction();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error in signInOAuth:", error);
    await session.abortTransaction();
    return NextResponse.json({ success: false, error: "Error in signInOAuth" });
  } finally {
    session.endSession();
  }
}
