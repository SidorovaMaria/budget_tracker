// GET user by email

import User from "@/database/models/user.model";
import connectDB from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation/validation-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();
  try {
    await connectDB();
    const validate = UserSchema.partial().safeParse({ email });
    if (!validate.success) {
      return NextResponse.json(
        {
          success: false,
          error: validate.error.flatten().fieldErrors,
        },
        {
          status: 400,
        }
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user",
      },
      {
        status: 500,
      }
    );
  }
}
