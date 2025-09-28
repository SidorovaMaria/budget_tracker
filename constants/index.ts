import IconNavOverview from "@/components/icons/IconNavOverview";
import IconNavTransactions from "@/components/icons/IconNavTransactions";
import { ROUTES } from "./routes";
import IconNavBudget from "@/components/icons/IconNavBudget";
import IconNavPots from "@/components/icons/IconNavPots";
import IconRecurringBills from "@/components/icons/IconRecurringBills";

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
