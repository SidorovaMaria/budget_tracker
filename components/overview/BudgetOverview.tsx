import { BudgetJSON } from "@/database/actions/budget.action";
import React from "react";
import OverviewLink from "../navigation/OverviewLink";
import { ROUTES } from "@/constants/routes";
import DonutChart from "../DonutChart";
import { toLocaleStringWithCommas } from "@/lib/utils";
type Props = {
  totalSpent: number;
  totalBudget: number;
  pieChartData: {
    label: string;
    value: number;
    color: string;
    maximum: number;
  }[];
  topFourBudgets: BudgetJSON[];
};
const BudgetOverview = ({ totalSpent, totalBudget, pieChartData, topFourBudgets }: Props) => {
  return (
    <aside className="overview-content" aria-labelledby="budgets-overview">
      <OverviewLink title="Budgets" href={ROUTES.BUDGETS} linkText="See Details" />
      <section className="flex flex-col w-full gap-4 md:grid md:grid-cols-[2fr_1fr] items-start lg:grid-cols-[3fr_2fr] xl:[4fr_1fr]">
        <div className="flex-center w-full">
          <DonutChart totalBudget={totalBudget} totalSpent={totalSpent} data={pieChartData} />
        </div>
        <ul
          className="grid grid-cols-2 md:grid-cols-1 gap-4 w-full items-center"
          aria-labelledby="Top 4 Budget Categories"
        >
          {topFourBudgets.length === 0 ? (
            <div></div>
          ) : (
            topFourBudgets.map((budget) => (
              <li className="flex flex-col w-full gap-1 pl-4 relative" key={String(budget._id)}>
                <span
                  aria-hidden
                  className="absolute top-0 left-0 w-1 h-full rounded-lg"
                  style={{ backgroundColor: budget.theme.value }}
                />
                <p className="text-ppreset-5 text-grey-500 capitalize">{budget.category.name}</p>
                <p className="text-preset-4-bold">
                  {toLocaleStringWithCommas(budget.totalSpent, "USD", 2)}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>
    </aside>
  );
};

export default BudgetOverview;
