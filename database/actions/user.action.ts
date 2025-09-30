"use server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongoose";
import User from "../models/user.model";

export async function getUser(): Promise<ActionResponse<UserJSON>> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      throw new Error("User not found");
    }
    return { success: true, status: 200, data: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    return { success: false, status: 500, error: { message: String(error) } };
  }
}
