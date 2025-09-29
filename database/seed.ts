import { defaultCategories, defaultThemes } from "@/constants";
import Category from "./models/category.model";
import Theme, { ITheme } from "./models/theme.model";

async function seedDefaultThemes() {
  const themeCount = await Theme.countDocuments();
  if (themeCount === 0) {
    await Theme.insertMany(defaultThemes);
    console.log("Default themes seeded successfully.");
  }
}

async function seedDefaultCategories() {
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    await Category.insertMany(defaultCategories);
    console.log("Default categories seeded successfully.");
  }
}

// Run the seed functions
export async function runSeeds() {
  await seedDefaultThemes();
  await seedDefaultCategories();
}
