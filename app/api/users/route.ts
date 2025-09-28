import User from "@/database/models/user.model";
import connectDB from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation/validation";
import { NextResponse } from "next/server";

//GET users from MONGODB

export async function GET() {
  try {
    await connectDB();
    const users = await User.find();
    return NextResponse.json(
      {
        success: true,
        data: users,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch users",
    });
  }
}

// Creat a new user
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const validate = UserSchema.safeParse(body);
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
    const { email } = validate.data;
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const newUser = await User.create(validate.data);
    return NextResponse.json(
      {
        success: true,
        data: newUser,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create user",
      },
      {
        status: 500,
      }
    );
  }
}
