import Account from "@/database/models/account.model";
import connectDB from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation/validation";
import { NextResponse } from "next/server";

// GET /api/users/[id]
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new Error("Account not found");

  try {
    await connectDB();

    const account = await Account.findById(id);
    if (!account) throw new Error("Account not found");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Error in GET account" }, { status: 500 });
  }
}

// DELETE /api/users/[id]
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new Error("Account not found");
  try {
    await connectDB();

    const account = await Account.findByIdAndDelete(id);
    if (!account) throw new Error("Account not found");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Error in DELETE account" }, { status: 500 });
  }
}

// PUT /api/users/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new Error("Account not found");

  try {
    await connectDB();

    const body = await request.json();
    const validatedData = AccountSchema.partial().safeParse(body);

    if (!validatedData.success) throw new Error("Validation error in the account schema");

    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedAccount) throw new Error("Account not found");

    return NextResponse.json({ success: true, data: updatedAccount }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Error in PUT account" }, { status: 500 });
  }
}
