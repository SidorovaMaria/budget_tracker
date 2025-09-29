"use server";

import { validateAction } from "@/lib/handler/validate";
import { BudgetSchema } from "@/lib/validation/validation";
import Budget, { IBudget, IBudgetDoc } from "../models/budget.model";
import { ICategoryDoc } from "../models/category.model";

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
