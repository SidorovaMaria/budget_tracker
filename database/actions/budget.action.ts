"use server";

import { validateAction } from "@/lib/handler/validate";
import { BudgetSchema } from "@/lib/validation/validation";
import Budget, { IBudgetDoc } from "../models/budget.model";
import { ICategoryDoc } from "../models/category.model";
import mongoose from "mongoose";
import { z } from "zod";
import { ITransactionDoc } from "../models/transaction.model";
import { IThemeDoc } from "../models/theme.model";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";
/* =========================
   CREATE
========================= */
export async function createBudget({
  categoryId,
  maximum,
  themeId,
}: {
  categoryId: string;
  maximum: number;
  themeId: string;
}): Promise<ActionResponse<IBudgetDoc & { categoryId: ICategoryDoc }>> {
  const validated = await validateAction({
    params: { categoryId, maximum, themeId },
    schema: BudgetSchema,
    authorize: true,
  });
  if (validated.success === false) return validated;
  const { params, session } = validated;
  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  try {
    const existingBudget = await Budget.exists({
      ownerId: session.user.id,
      categoryId: params.categoryId,
    });
    const existingTheme = await Budget.exists({
      ownerId: session.user.id,
      themeId: params.themeId,
    });
    // Will Let the UI handle this, just a checker
    if (existingBudget) {
      return {
        success: false,
        status: 400,
        error: { message: "Budget for this category already exists" },
      };
    }
    // Will Let the UI handle this, just a checker
    if (existingTheme) {
      return {
        success: false,
        status: 400,
        error: { message: "Budget with this theme already exists" },
      };
    }
    const newBudget = await Budget.create({
      ownerId: session.user.id,
      categoryId: params.categoryId,
      maximum: params.maximum,
      themeId: params.themeId,
    });
    await newBudget.populate("categoryId");
    revalidatePath(ROUTES.BUDGETS);
    return { success: true, status: 201, data: JSON.parse(JSON.stringify(newBudget)) };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: { message: "Failed to create budget" + error },
    };
  }

  // Implementation for creating a budget
}
/* =========================
   READ
========================= */
export async function getBudgets(): Promise<ActionResponse<BudgetJSON[]>> {
  const validated = await validateAction({ authorize: true });
  if (!validated.success) return validated;

  const { session } = validated;

  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }

  try {
    const budgets = await Budget.find({ ownerId: session.user.id }).populate("categoryId themeId");
    return {
      success: true,
      status: 200,
      data: JSON.parse(JSON.stringify(budgets)),
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: { message: String(error) },
    };
  }
}

export type BudgetJSON = {
  _id: string;
  ownerId: string;
  categoryId: string;
  maximum: number;
  themeId: string;
  category: ICategoryDoc;
  theme: IThemeDoc;
  transactions: ITransactionDoc[];
  totalSpent: number;
};
export async function getBudgetSpendings(): Promise<ActionResponse<BudgetJSON[]>> {
  const validated = await validateAction({ authorize: true });
  if (!validated.success) return validated;
  const { session } = validated;
  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();
  try {
    const budgets = await Budget.aggregate([
      { $match: { ownerId: new mongoose.Types.ObjectId(session.user.id) } },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "themes",
          localField: "themeId",
          foreignField: "_id",
          as: "theme",
        },
      },
      { $unwind: "$theme" },
      {
        $lookup: {
          from: "transactions",
          let: { budgetCategoryId: "$categoryId", ownerId: "$ownerId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$categoryId", "$$budgetCategoryId"] },
                    { $eq: ["$ownerId", "$$ownerId"] },
                    { $eq: ["$type", "expense"] },
                    // Remove unnecessary $expr for amount conversion
                    {
                      $gte: [
                        "$date",
                        {
                          $dateFromParts: {
                            year: { $year: "$$NOW" },
                            month: { $month: "$$NOW" },
                            day: 1,
                          },
                        },
                      ],
                    },
                    {
                      $lte: [
                        "$date",
                        {
                          $dateFromParts: {
                            year: { $year: "$$NOW" },
                            month: { $month: "$$NOW" },
                            day: 31,
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            },
            // Convert amount to double for each transaction
            {
              $addFields: {
                amount: { $toDouble: "$amount" },
              },
            },
          ],
          as: "transactions",
        },
      },
      {
        $addFields: {
          totalSpent: {
            $sum: "$transactions.amount",
          },
        },
      },
    ]).session(dbSession);
    await dbSession.commitTransaction();
    dbSession.endSession();
    return {
      success: true,
      status: 200,
      data: JSON.parse(JSON.stringify(budgets)),
    };
  } catch (error) {
    await dbSession.abortTransaction();
    dbSession.endSession();
    return {
      success: false,
      status: 500,
      error: { message: String(error) },
    };
  }
}

export async function deleteBudget({
  budgetId,
}: {
  budgetId: string;
}): Promise<ActionResponse<null>> {
  const validated = await validateAction({
    params: { budgetId },
    schema: z.object({ budgetId: z.string().min(1, { error: "Budget ID is required" }) }),
    authorize: true,
  });

  if (!validated.success) return validated;
  const { params, session } = validated;
  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  try {
    const budget = await Budget.findOne({ _id: params.budgetId, ownerId: session.user.id });
    if (!budget) {
      return { success: false, status: 404, error: { message: "Budget not found" } };
    }
    await Budget.deleteOne({ _id: params.budgetId });
    revalidatePath(ROUTES.BUDGETS);
    return { success: true, status: 200, data: null };
  } catch (error) {
    return { success: false, status: 500, error: { message: String(error) } };
  }
}

export async function updateBudget(
  budgetId: string,
  updates: {
    categoryId?: string;
    maximum?: number;
    themeId?: string;
  }
): Promise<ActionResponse<IBudgetDoc & { categoryId: ICategoryDoc }>> {
  const validated = await validateAction({
    params: { budgetId, ...updates },
    schema: BudgetSchema.partial().extend({
      budgetId: z.string().min(1, { message: "Budget ID is required" }),
    }),
    authorize: true,
  });
  if (!validated.success) return validated;
  const { params, session } = validated;
  if (!session?.user?.id) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  try {
    const budget = await Budget.findOne({ _id: params.budgetId, ownerId: session.user.id });
    if (!budget) {
      return { success: false, status: 404, error: { message: "Budget not found" } };
    }
    if (params.categoryId) budget.categoryId = params.categoryId;
    if (params.maximum !== undefined) budget.maximum = params.maximum;
    if (params.themeId) budget.themeId = params.themeId;
    await budget.save();
    await budget.populate("categoryId");
    revalidatePath(ROUTES.BUDGETS);
    return { success: true, status: 200, data: JSON.parse(JSON.stringify(budget)) };
  } catch (error) {
    return { success: false, status: 500, error: { message: "Failed to update budget" + error } };
  }
}
