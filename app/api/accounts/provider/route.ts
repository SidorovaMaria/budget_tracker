import Account from "@/database/models/account.model";
import connectDB from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation/validation-auth";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();

  try {
    await connectDB();
    const validatedData = AccountSchema.partial().safeParse({
      providerAccountId,
    });

    if (!validatedData.success) throw new Error("Validation error in the account schema");

    const account = await Account.findOne({ providerAccountId });
    if (!account) throw new Error("Account not found");

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch account",
      },
      { status: 500 }
    );
  }
}
