"use server";

import { validateAction } from "@/lib/handler/validate";
import { BudgetSchema } from "@/lib/validation/validation";
import Budget from "../models/budget.model";

export async function createBudget({
  categoryId,
  maximum,
  themeId,
}: {
  categoryId: string;
  maximum: number;
  themeId: string;
}) {
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
    const newBudget = await Budget.create({
      ownerId: session.user.id,
      categoryId: params.categoryId,
      maximum: params.maximum,
      themeId: params.themeId,
    });
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
