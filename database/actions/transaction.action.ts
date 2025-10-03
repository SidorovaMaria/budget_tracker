"use server";

import { validateAction } from "@/lib/handler/validate";
import { AddTransactionSchema, SearchParamsSchema } from "@/lib/validation/validation";
import { z } from "zod";
import { SortOrder } from "mongoose";
import Transaction, { ITransactionDoc } from "../models/transaction.model";
import { SortKey } from "@/constants";
import { escapeRegex } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";
import mongoose from "mongoose";
import User from "../models/user.model";

/* =========================
   CREATE
========================= */

export async function createTransaction({
  name,
  amount,
  type,
  date,
  recurring,
  categoryId,
}: {
  name: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
  recurring?: boolean;
  categoryId: string;
}) {
  const validated = await validateAction({
    params: { name, amount, type, date, recurring, categoryId },
    schema: AddTransactionSchema,
    authorize: true,
  });
  if (!validated.success) return validated;
  const { params, session } = validated;
  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();
  try {
    const user = await User.findById(session.user.id).session(dbSession);
    if (!user) {
      throw new Error("User not found");
    }
    const currentBalance = Number(user.balance.current.toString());
    if (params.type === "expense" && params.amount > currentBalance) {
      throw new Error("Insufficient funds");
    }
    await User.updateOne(
      { _id: session.user.id },
      {
        $inc: {
          "balance.current": params.type === "income" ? params.amount : -params.amount,
          "balance.income": params.type === "income" ? params.amount : 0,
          "balance.expenses": params.type === "expense" ? params.amount : 0,
        },
      },
      { session: dbSession }
    );

    const newTransaction = await Transaction.create(
      [
        {
          ownerId: session.user.id,
          categoryId: params.categoryId,
          name: params.name,
          amount: params.amount,
          type: params.type,
          date: params.date,
          recurring: params.recurring || false,
        },
      ],
      { session: dbSession }
    );
    await dbSession.commitTransaction();
    await dbSession.endSession();
    revalidatePath(ROUTES.TRANSACTIONS);
    return { success: true, status: 201, data: JSON.parse(JSON.stringify(newTransaction)) };
  } catch (error) {
    await dbSession.abortTransaction();
    await dbSession.endSession();
    return { success: false, status: 500, error: { message: "Server error: " + error } };
  }
}

const sortMapping: Record<SortKey, Record<string, SortOrder>> = {
  latest: { date: -1, _id: -1 },
  newest: { createdAt: -1, _id: -1 },
  oldest: { date: 1, _id: 1 },
  az: { name: 1, date: -1, _id: -1 },
  za: { name: -1, date: -1, _id: -1 },
  highest: { amount: -1, date: -1, _id: -1 },
  lowest: { amount: 1, date: -1, _id: -1 },
};

export type GetTransactionsParams = {
  page?: number;
  pageSize?: number;
  sort?: SortKey;
  filter?: string; // categoryId or "all"
  search?: string;
};

/* =========================
   READ
========================= */
export async function getTransactions({
  page = 1,
  pageSize = 10,
  sort = "latest",
  filter = "all",
  search = "",
}: GetTransactionsParams): Promise<
  ActionResponse<{
    transactions: (ITransactionDoc & { categoryId: { name: string; themeId: string } })[];
    pagination: { page: number; pageSize: number; total: number; totalPages: number };
  }>
> {
  const validated = await validateAction({
    params: { page, pageSize, sort, filter, search },
    schema: SearchParamsSchema,
    authorize: true,
  });
  if (!validated.success) return validated;
  const { params, session } = validated;
  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const and: Array<{ ownerId?: string; categoryId?: string; name?: object }> = [
    { ownerId: session.user.id },
  ];

  if (params.filter && params.filter !== "all") {
    and.push({ categoryId: params.filter });
  }
  if (params.search?.trim()) {
    and.push({ name: { $regex: escapeRegex(params.search.trim()), $options: "i" } });
  }
  const match = and.length > 1 ? { $and: and } : { ...and[0] };
  const sorting = sortMapping[params.sort || "latest"] || sortMapping["latest"];

  try {
    const [transactions, total] = await Promise.all([
      Transaction.find(match).sort(sorting).skip(skip).limit(limit).populate("categoryId"),
      Transaction.countDocuments(match),
    ]);
    const totalPages = Math.ceil(total / pageSize);
    return {
      success: true,
      status: 200,
      data: {
        transactions: JSON.parse(JSON.stringify(transactions)),
        pagination: { page: params.page || 1, pageSize, total, totalPages },
      },
    };
  } catch (error) {
    return { success: false, status: 500, error: { message: "Server error: " + error } };
  }
}
export async function getRecentTransactions(): Promise<ActionResponse<ITransactionDoc[]>> {
  const validated = await validateAction({
    params: {},
    schema: z.object({}),
    authorize: true,
  });
  if (!validated.success) return validated;
  const { session } = validated;
  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  try {
    const transactions = await Transaction.find({ ownerId: session.user.id })
      .sort({ date: -1, _id: -1 })
      .limit(5);
    return {
      success: true,
      status: 200,
      data: JSON.parse(JSON.stringify(transactions)),
    };
  } catch (error) {
    return { success: false, status: 500, error: { message: "Server error: " + error } };
  }
}

/* =========================
    DELETE
  ========================= */

export async function deleteTransaction(transactionId: string) {
  const validated = await validateAction({
    params: { transactionId },
    schema: z.object({ transactionId: z.string().min(1) }),
    authorize: true,
  });

  if (!validated.success) return validated;

  const { params, session } = validated;
  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  const userId = session.user.id;
  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();
  try {
    const userDoc = await User.findById(userId).session(dbSession);
    if (!userDoc) {
      throw new Error("User not found");
    }
    const transactionDoc = await Transaction.findOne({
      _id: params.transactionId,
      ownerId: userId,
    }).session(dbSession);
    if (!transactionDoc) {
      throw new Error("Could not find that transaction");
    }

    // Adjust user's balance
    const amount = Number(transactionDoc.amount.toString());
    await User.updateOne(
      { _id: userId },
      {
        $inc: {
          "balance.current": transactionDoc.type === "income" ? -amount : amount,
          "balance.income": transactionDoc.type === "income" ? -amount : 0,
          "balance.expenses": transactionDoc.type === "expense" ? -amount : 0,
        },
      },
      { session: dbSession }
    );
    await Transaction.deleteOne({ _id: params.transactionId, ownerId: userId }).session(dbSession);

    await dbSession.commitTransaction();
    await dbSession.endSession();
    revalidatePath(ROUTES.TRANSACTIONS);
    return { success: true, status: 200, data: null };
  } catch (error) {
    await dbSession.abortTransaction();
    await dbSession.endSession();
    return { success: false, status: 500, error: { message: "Server error: " + error } };
  }
}

/* =========================
    UPDATE
  ========================= */
export async function updateTransaction({
  transactionId,
  params: { name, amount, type, date, recurring, categoryId },
}: {
  transactionId: string;
  params: {
    name: string;
    amount: number;
    type: "income" | "expense";
    date: Date;
    recurring?: boolean;
    categoryId: string;
  };
}) {
  const validated = await validateAction({
    params: { transactionId, name, amount, type, date, recurring, categoryId },
    schema: AddTransactionSchema.extend({ transactionId: z.string().min(1) }),
    authorize: true,
  });
  if (!validated.success) return validated;
  const { params, session } = validated;
  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  const userId = session.user.id;
  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();
  try {
    const originalTransaction = await Transaction.findOne({
      _id: params.transactionId,
      ownerId: userId,
    }).session(dbSession);
    if (!originalTransaction) {
      throw new Error("Could not find that transaction");
    }
    const userDoc = await User.findById(userId).session(dbSession);
    if (!userDoc) {
      throw new Error("User not found");
    }
    const originalType = originalTransaction.type;
    const originalAmount = Number(originalTransaction.amount.toString());
    const newType = params.type;
    const newAmount = params.amount;
    let balanceAdjustment = 0;
    let expenseAdjustment = 0;
    let incomeAdjustment = 0;
    if (originalType === "income" && newType === "income") {
      balanceAdjustment = newAmount - originalAmount;
      incomeAdjustment = newAmount - originalAmount;
    } else if (originalType === "income" && newType === "expense") {
      balanceAdjustment = -originalAmount - newAmount;
      incomeAdjustment = -originalAmount;
      expenseAdjustment = newAmount;
    } else if (originalType === "expense" && newType === "income") {
      balanceAdjustment = originalAmount + newAmount;
      incomeAdjustment = newAmount;
      expenseAdjustment = -originalAmount;
    } else if (originalType === "expense" && newType === "expense") {
      balanceAdjustment = originalAmount - newAmount;
      expenseAdjustment = newAmount - originalAmount;
    }
    await User.updateOne(
      { _id: userId },
      {
        $inc: {
          "balance.current": balanceAdjustment,
          "balance.income": incomeAdjustment,
          "balance.expenses": expenseAdjustment,
        },
      },
      { session: dbSession }
    );
    const updated = await Transaction.findOneAndUpdate(
      { _id: params.transactionId, ownerId: userId },
      {
        name: params.name,
        amount: params.amount,
        type: params.type,
        date: params.date,
        recurring: params.recurring || false,
        categoryId: params.categoryId,
      },
      { new: true, session: dbSession }
    ).populate("categoryId");
    if (!updated) {
      throw new Error("Could not update that transaction");
    }
    await dbSession.commitTransaction();
    await dbSession.endSession();
    revalidatePath(ROUTES.TRANSACTIONS);
    return { success: true, status: 200, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    await dbSession.abortTransaction();
    await dbSession.endSession();
    return { success: false, status: 500, error: { message: "Server error: " + error } };
  }
}
