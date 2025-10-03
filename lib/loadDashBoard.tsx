import { getUser } from "@/database/actions/user.action";
import { unwrap } from "./utils";
import { getPots } from "@/database/actions/pot.action";
import { getRecentTransactions } from "@/database/actions/transaction.action";
import { getBudgetSpendings } from "@/database/actions/budget.action";

export async function loadDashboard() {
  // Kick both requests at once
  const [userRes, potsRes, transactionRes, budgetRes] = await Promise.all([
    getUser(),
    getPots(),
    getRecentTransactions(),
    getBudgetSpendings(),
  ]);

  // Validate each independently (clear messages if one fails)
  const user = unwrap(userRes, "user data");
  const pots = unwrap(potsRes, "pots data");
  const recentTransactions = unwrap(transactionRes, "recent transactions");
  const budgets = unwrap(budgetRes, "budgets data");
  // Calculate total saved across all pots
  const totalSpentBudgets = budgets.reduce((acc, budget) => acc + (budget.totalSpent || 0), 0);
  const totalBudget = budgets.reduce((acc, budget) => acc + Number(budget.maximum), 0);
  const totalSavedPots = pots.reduce((acc, pot) => acc + Number(pot.total), 0);
  const pieChartData = budgets.map((budget) => ({
    label: budget.category.name,
    value: budget.totalSpent || 0,
    color: budget.theme.value,
    maximum: Number(budget.maximum),
  }));
  const topFourBudgets = budgets.slice(0, 4);
  return {
    user,
    pots: pots.slice(0, 4),
    totalSavedPots,
    recentTransactions,
    pieChartData,
    totalSpentBudgets,
    totalBudget,
    topFourBudgets,
  };
}
