// src/server/loaders/options.ts
import { cache } from "react";
import { getCategories } from "@/database/actions/category.action";
import { getThemes } from "@/database/actions/theme.action";
import connectDB from "@/lib/mongoose";

export type ThemeOption = {
  label: string;
  key: string;
  id: string;
  value: string;
};
export type CategoryOption = { label: string; value: string; id: string };

export const loadThemeOptions = cache(async (): Promise<ThemeOption[]> => {
  try {
    await connectDB();
    const { success, data } = await getThemes();

    if (!success || !data) return [];
    return data.map((t) => ({
      label: t.name, // "Navy"
      key: t.key, // "navy"
      id: String(t._id), // 'Database generated ID'
      value: t.value, // "#626070"
    }));
  } catch (error) {
    console.error("Error loading theme options:", error);
    return [];
  }
});

export const loadCategoryOptions = cache(async (): Promise<CategoryOption[]> => {
  try {
    connectDB();
    const { success, data } = await getCategories();
    if (!success || !data) return [];
    return data.map((c) => ({
      label: c.name, // "Food & Dining"
      value: c.key, // "food-dining"
      id: String(c._id), // 'Database generated ID'
    }));
  } catch (error) {
    console.error("Error loading category options:", error);
    return [];
  }
});
