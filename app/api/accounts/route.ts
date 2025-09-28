// Account API Routes

import Account from "@/database/models/account.model";
import connectDB from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation/validation";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const accounts = await Account.find();
    return NextResponse.json(
      {
        success: true,
        data: accounts,
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
        error: "Failed to fetch accounts",
      },
      {
        status: 500,
      }
    );
  }
}
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const validate = AccountSchema.parse(body);

    const existingAccount = await Account.findOne({
      provider: validate.provider,
      providerAccountId: validate.providerAccountId,
    });
    if (existingAccount) {
      throw new Error("Account with this provider and providerAccountId already exists");
    }
    const newAccount = await Account.create(validate);
    return NextResponse.json(
      {
        success: true,
        data: newAccount,
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
        error: "Failed to create account",
      },
      {
        status: 500,
      }
    );
  }
}
