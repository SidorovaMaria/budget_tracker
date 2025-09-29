import IconNavOverview from "@/components/icons/IconNavOverview";
import IconNavTransactions from "@/components/icons/IconNavTransactions";
import { ROUTES } from "./routes";
import IconNavBudget from "@/components/icons/IconNavBudget";
import IconNavPots from "@/components/icons/IconNavPots";
import IconRecurringBills from "@/components/icons/IconRecurringBills";
import { ITheme } from "@/database/models/theme.model";

export const NavLinks: NavLink[] = [
  {
    label: "Overview",
    Icon: IconNavOverview,
    href: ROUTES.HOME,
  },
  {
    label: "Transactions",
    Icon: IconNavTransactions,
    href: ROUTES.TRANSACTIONS,
  },
  {
    label: "Budgets",
    Icon: IconNavBudget,
    href: ROUTES.BUDGETS,
  },
  {
    label: "Pots",
    Icon: IconNavPots,
    href: ROUTES.POTS,
  },
  {
    label: "Recurring bills",
    Icon: IconRecurringBills,
    href: ROUTES.RECURRING,
  },
];
export const defaultThemes: ITheme[] = [
  { name: "Green", key: "#green", value: "#277C78" },
  { name: "Yellow", key: "#yellow", value: "#F2CDAC" },
  { name: "Cyan", key: "#cyan", value: "#82C9D7" },
  { name: "Navy", key: "#navy", value: "#626070" },
  { name: "Red", key: "#red", value: "#C94736" },
  { name: "Purple", key: "#purple", value: "#826CB0" },
  { name: "Turquoise", key: "#turquoise", value: "#597C7C" },
  { name: "Brown", key: "#brown", value: "#93674F" },
  { name: "Magenta", key: "#magenta", value: "#934F6F" },
  { name: "Blue", key: "#blue", value: "#3F82B2" },
  { name: "Grey", key: "#grey", value: "#97A0AC" },
  { name: "Army", key: "#army", value: "#7F9161" },
  { name: "Pink", key: "#pink", value: "#AF81BA" },
  { name: "Gold", key: "#gold", value: "#CAB361" },
  { name: "Orange", key: "#orange", value: "#BE6C49" },
];
export const defaultCategories = [
  { name: "Entertainment", key: "entertainment" },
  { name: "Bills", key: "bills" },
  { name: "Groceries", key: "groceries" },
  { name: "Dining Out", key: "dining-out" },
  { name: "Transportation", key: "transportation" },
  { name: "Personal Care", key: "personal-care" },
  { name: "Education", key: "education" },
  { name: "Lifestyle", key: "lifestyle" },
  { name: "Shopping", key: "shopping" },
  { name: "General", key: "general" },
];
