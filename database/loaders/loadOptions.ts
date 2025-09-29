// src/server/loaders/options.ts
import { cache } from "react";
import { getCategories } from "@/database/actions/category.action";
import { getThemes } from "@/database/actions/theme.action";
import connectDB from "@/lib/mongoose";

export type Option = { label: string; value: string; swatch?: string };

export const loadThemeOptions = cache(async (): Promise<Option[]> => {
  try {
    connectDB();
    const { success, data } = await getThemes();
    if (!success || !data) return [];
    return data.map((t) => ({
      label: t.name, // "Navy"
      value: t.id, // "navy"
      swatch: t.value, // "#626070"
    }));
  } catch (error) {
    console.error("Error loading theme options:", error);
    return [];
  }
});

export const loadCategoryOptions = cache(async (): Promise<Option[]> => {
  try {
    connectDB();
    const { success, data } = await getCategories();
    if (!success || !data) return [];
    return data.map((c) => ({
      label: c.name, // "Food & Dining"
      value: c.key, // "food-dining"
    }));
  } catch (error) {
    console.error("Error loading category options:", error);
    return [];
  }
});
