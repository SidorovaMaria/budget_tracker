import { defaultCategories, defaultThemes } from "@/constants";
import Category from "./models/category.model";
import Theme, { ITheme } from "./models/theme.model";

async function seedDefaultThemes() {
  const themeCount = await Theme.countDocuments();
  if (themeCount === 0) {
    await Theme.insertMany(defaultThemes);
  }
}

async function seedDefaultCategories() {
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    await Category.insertMany(defaultCategories);
  }
}

// Run the seed functions
export async function runSeeds() {
  await seedDefaultThemes();
  await seedDefaultCategories();
}
