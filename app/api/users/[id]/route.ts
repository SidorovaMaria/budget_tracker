//USER BY ID

//GET / api/users/:id - get user by id
//PUT / api/users/:id - update user by id
//DELETE / api/users/:id - delete user by id

import User from "@/database/models/user.model";
import connectDB from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation/validation";
import { NextResponse } from "next/server";

// Get a user by ID
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new Error("User not found");
  try {
    await connectDB();
    const user = await User.findById(id);
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

//DELETE User
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new Error("User not found");
  try {
    await connectDB();
    const user = await User.findByIdAndDelete(id);
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
        data: "User deleted successfully",
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
        error: "Failed to delete user",
      },
      {
        status: 500,
      }
    );
  }
}

// Update a user by ID
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new Error("User not found");
  try {
    await connectDB();
    const body = await request.json();
    const validate = UserSchema.partial().parse(body);
    if (!validate) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid user data",
        },
        {
          status: 400,
        }
      );
    }
    const updatedUser = await User.findByIdAndUpdate(id, validate, { new: true });
    if (!updatedUser) {
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
        data: updatedUser,
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
        error: "Failed to update user",
      },
      {
        status: 500,
      }
    );
  }
}
