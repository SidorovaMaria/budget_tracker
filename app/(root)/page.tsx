import BalanceCard from "@/components/cards/BalanceCard";
import BudgetOverview from "@/components/overview/BudgetOverview";
import PotsOverview from "@/components/overview/PotsOverview";
import TransactionsOverview from "@/components/overview/TransactionsOverview";

import { loadDashboard } from "@/lib/loadDashBoard";

export default async function Home() {
  const {
    user,
    pots,
    totalSavedPots,
    recentTransactions,
    totalSpentBudgets,
    totalBudget,
    pieChartData,
    topFourBudgets,
  } = await loadDashboard();
  return (
    <>
      {/* Title */}
      <h1 id="overview" className="">
        Overview
      </h1>
      <section className="flex flex-col w-full gap-3  items-start justify-start md:flex-row md:gap-6">
        {(Object.keys(user.balance) as Array<keyof typeof user.balance>).map((key) => (
          <BalanceCard
            key={key}
            label={key === "current" ? "Current Balance" : key}
            value={user.balance[key]}
            card={key === "current" ? "current" : "default"}
          />
        ))}
      </section>
      <div className="w-full grid grid-cols-1 gap-4 lg:grid-cols-2 lg:grid-rows-6">
        <div className="lg:[grid-area:1/1/3/2]">
          <PotsOverview pots={pots} total={totalSavedPots} />
        </div>
        <div className="lg:[grid-area:3/1/7/2]">
          <TransactionsOverview transactions={recentTransactions} />
        </div>
        <div className="lg:[grid-area:1/2/5/3]">
          <BudgetOverview
            totalSpent={totalSpentBudgets}
            totalBudget={totalBudget}
            pieChartData={pieChartData}
            topFourBudgets={topFourBudgets}
          />
        </div>
      </div>
    </>
  );
}
