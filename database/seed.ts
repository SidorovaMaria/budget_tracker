import {
  DEFAULT_BUDGETS,
  DEFAULT_POTS,
  DEFAULT_TRANSACTIONS,
  defaultCategories,
  defaultThemes,
} from "@/constants";
import Category from "./models/category.model";
import Theme, { ITheme } from "./models/theme.model";
import Transaction from "./models/transaction.model";
import { Types } from "mongoose";
import { validateAction } from "@/lib/handler/validate";
import mongoose from "mongoose";
import User from "./models/user.model";
import Pot from "./models/pot.model";
import Budget from "./models/budget.model";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";

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

export async function seedDemoTransactions() {
  const validated = await validateAction({ params: {}, authorize: true });
  if (!validated.success) return validated;

  const userId = validated.session?.user?.id;
  if (!userId) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }

  // 1) Pre-checks (no session/transaction yet)
  const user = await User.findById(userId);
  if (!user) {
    return { success: false, status: 404, error: { message: "User not found" } };
  }
  if (user.seededDemo.transactions) {
    return { success: true, status: 200, data: { message: "Demo data already seeded" } };
  }

  const existingCount = await Transaction.countDocuments({ ownerId: userId });
  if (existingCount > 0) {
    // Choose policy: either block seeding or allow. Here, we block.
    return { success: true, status: 200, data: { message: "User already has transactions" } };
  }

  // 2) Open session + transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Re-load the user in-session for the update
    const userInTx = await User.findById(userId).session(session);
    if (!userInTx) {
      throw new Error("User disappeared during transaction");
    }

    // Categories in-session
    const categories = await Category.find({}).session(session);
    const categoryMap = categories.reduce((acc, c) => {
      acc[c.name] = c._id as Types.ObjectId;
      return acc;
    }, {} as Record<string, Types.ObjectId>);

    // Ensure we have a fallback "General" category
    const generalCat = categoryMap["General"];
    if (!generalCat) {
      throw new Error('Missing required "General" category in the database');
    }

    const docs = DEFAULT_TRANSACTIONS.map((tx) => ({
      ownerId: new Types.ObjectId(userId), // be explicit
      name: tx.name,
      amount: Math.abs(tx.amount), // magnitude-only
      type: tx.amount >= 0 ? "income" : "expense",
      date: new Date(tx.date),
      recurring: !!tx.recurring,
      categoryId: categoryMap[tx.category] ?? generalCat,
      avatar: tx.avatar || undefined,
    }));

    // Insert in-session
    const inserted = await Transaction.insertMany(docs, { session });

    // Mark seeded within same TX
    userInTx.seededDemo.transactions = true;
    await userInTx.save({ session });

    // Commit
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      status: 200,
      data: JSON.parse(JSON.stringify(inserted)),
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { success: false, status: 500, error: { message: "Server error: " + error } };
  }
}

export async function seedDemoPots() {
  const validated = await validateAction({ params: {}, authorize: true });
  if (!validated.success) return validated;

  const userId = validated.session?.user?.id;
  if (!userId) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  // 1) Pre-checks (no session/transaction yet)
  const user = await User.findById(userId);
  if (!user) {
    return { success: false, status: 404, error: { message: "User not found" } };
  }
  if (user.seededDemo.pots) {
    return { success: true, status: 200, data: { message: "Demo pots already seeded" } };
  }
  const existingCount = await Pot.countDocuments({ ownerId: userId });
  if (existingCount > 0) {
    // Choose policy: either block seeding or allow. Here, we block.
    return { success: true, status: 200, data: { message: "User already has pots" } };
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userInTx = await User.findById(userId).session(session);
    if (!userInTx) {
      throw new Error("User disappeared during transaction");
    }
    //Themes in-session
    const themes = await Theme.find({}).session(session);
    const themeMap = themes.reduce((acc, t) => {
      acc[t.value] = t._id as Types.ObjectId;
      return acc;
    }, {} as Record<string, Types.ObjectId>);
    const fallbackTheme = themeMap["#277C78"];
    if (!fallbackTheme) {
      throw new Error('Missing fallback theme "#277C78" in the database');
    }
    const docs = DEFAULT_POTS.map((pot) => ({
      ownerId: new Types.ObjectId(userId), // be explicit
      name: pot.name,
      target: pot.target,
      total: pot.total,
      themeId: themeMap[pot.theme] ?? fallbackTheme,
    }));
    const inserted = await Pot.insertMany(docs, { session });
    // Mark seeded within same TX
    userInTx.seededDemo.pots = true;
    await userInTx.save({ session });

    // Commit
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      status: 200,
      data: JSON.parse(JSON.stringify(inserted)),
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { success: false, status: 500, error: { message: "Server error: " + error } };
  }
}
export async function seedDemoBudgets() {
  const validated = await validateAction({ params: {}, authorize: true });
  if (!validated.success) return validated;

  const userId = validated.session?.user?.id;
  if (!userId) {
    return { success: false, status: 401, error: { message: "Unauthorized" } };
  }
  // 1) Pre-checks (no session/transaction yet)
  const user = await User.findById(userId);
  if (!user) {
    return { success: false, status: 404, error: { message: "User not found" } };
  }
  if (user.seededDemo.budgets) {
    return { success: true, status: 200, data: { message: "Demo budgets already seeded" } };
  }
  const existingCount = await Budget.countDocuments({ ownerId: userId });
  if (existingCount > 0) {
    // Choose policy: either block seeding or allow. Here, we block.
    return { success: true, status: 200, data: { message: "User already has budgets" } };
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userInTx = await User.findById(userId).session(session);
    if (!userInTx) {
      throw new Error("User disappeared during transaction");
    }
    //Categories in-session
    const categories = await Category.find({}).session(session);
    const categoryMap = categories.reduce((acc, c) => {
      acc[c.name] = c._id as Types.ObjectId;
      return acc;
    }, {} as Record<string, Types.ObjectId>);
    const themes = await Theme.find({}).session(session);
    const themeMap = themes.reduce((acc, t) => {
      acc[t.value] = t._id as Types.ObjectId;
      return acc;
    }, {} as Record<string, Types.ObjectId>);
    const fallbackTheme = themeMap["#277C78"];
    if (!fallbackTheme) {
      throw new Error('Missing fallback theme "#277C78" in the database');
    }
    const fallbackCategory = categoryMap["General"];
    if (!fallbackCategory) {
      throw new Error('Missing required "General" category in the database');
    }
    const docs = DEFAULT_BUDGETS.map((budget) => ({
      ownerId: new Types.ObjectId(userId), // be explicit
      categoryId: categoryMap[budget.category] ?? fallbackCategory,
      maximum: budget.maximum,
      themeId: themeMap[budget.theme] ?? fallbackTheme,
    }));
    const inserted = await Budget.insertMany(docs, { session });
    // Mark seeded within same TX
    userInTx.seededDemo.budgets = true;
    await userInTx.save({ session });
    // Commit
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      status: 200,
      data: JSON.parse(JSON.stringify(inserted)),
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { success: false, status: 500, error: { message: "Server error: " + error } };
  }
}
