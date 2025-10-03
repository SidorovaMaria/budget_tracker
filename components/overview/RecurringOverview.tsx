import React from "react";
import OverviewLink from "../navigation/OverviewLink";
import { ROUTES } from "@/constants/routes";
import { toLocaleStringWithCommas } from "@/lib/utils";
type Props = {
  summary: {
    dueSoon: { count: number; total: number };
    paid: { count: number; total: number };
    unpaid: { count: number; total: number };
    upcoming: { count: number; total: number };
  };
};

const RecurringOverview = ({ summary }: Props) => {
  console.log("recurringSummary:", summary);
  return (
    <aside className="overview-content" aria-labelledby="budgets-overview">
      <OverviewLink title="Recurring Bills" href={ROUTES.RECURRING} linkText="See Details" />
      <ul
        className="flex flex-col w-full gap-3 max-h-[180px] py-2 overflow-y-auto"
        aria-labelledby="recurring-bills-summary"
      >
        <RecurringCard text="Paid Bills" value={summary.paid.total} className="border-s-green" />
        <RecurringCard text="Unpaid" value={summary.unpaid.total} className="border-s-red" />

        <RecurringCard
          text="Total Upcoming"
          value={summary.upcoming.total}
          className="border-s-yellow"
        />
        <RecurringCard text="Due Soon" value={summary.dueSoon.total} className="border-s-cyan" />
      </ul>
    </aside>
  );
};

export default RecurringOverview;
interface RecurringCardProps {
  text: string;
  className?: string;
  value: number;
}

const RecurringCard = ({ text, className = "", value }: RecurringCardProps) => (
  <li
    className={`flex items-center justify-between w-full px-4 py-5 rounded-lg border-l-4 bg-beige-100/50 text-preset-4 text-grey-500  ${className}`}
    aria-label={`${text}: ${value}`}
  >
    <p id={`${text}-label`}>{text}</p>
    <p className="font-bold text-grey-900">{toLocaleStringWithCommas(value, "USD", 2)}</p>
  </li>
);
