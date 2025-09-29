import Category, { ICategoryDoc } from "../models/category.model";

export const getCategories = async (): Promise<ActionResponse<ICategoryDoc[]>> => {
  try {
    const categories = await Category.find();
    if (!categories) {
      return { success: false, status: 404, error: { message: "No categories found" } };
    }
    return { success: true, status: 200, data: categories };
  } catch (error) {
    console.log("Error fetching categories:", error);
    return { success: false, status: 500, error: { message: "Internal server error" } };
  }
};
