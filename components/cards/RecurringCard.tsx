import { toLocaleStringWithCommas } from "@/lib/utils";
import React from "react";
import IconRecurringBills from "../icons/IconRecurringBills";
type RecurringCardProps = {
  totalToPay: number;
  bucketSummary: {
    paid: { count: number; total: number };
    unpaid: { count: number; total: number };
    upcoming: { count: number; total: number };
    dueSoon: { count: number; total: number };
  };
  totalCount: number;
};
const RecurringCard = ({ totalToPay, bucketSummary, totalCount }: RecurringCardProps) => {
  return (
    <aside className="grid grid-cols-1 w-full gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-1 lg:gap-6">
      <div
        className="flex justify-start gap-5 px-5 py-6 items-center w-full bg-grey-900 rounded-xl text-white
            md:flex-col md:gap-8 md:p-6 md:items-start lg:max-h-fit"
      >
        <IconRecurringBills className="size-10" />
        <div className="flex flex-col w-full gap-2.5 md:justify-end">
          <p className="text-preset-4 ">Total Bills ({totalCount})</p>
          <p className="text-preset-1 ">{toLocaleStringWithCommas(totalToPay, "USD", 2)}</p>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-5 rounded-xl bg-white max-h-fit ">
        <h5 className="text-preset-3 ">Summary</h5>
        <ul className="flex flex-col w-full gap-4 ">
          <SummaryItem
            theme="default"
            label="Paid Bills"
            length={bucketSummary.paid.count}
            total={toLocaleStringWithCommas(bucketSummary.paid.total, "USD", 2)}
          />
          <SummaryItem
            theme="attention"
            label="Unpaid Bills"
            length={bucketSummary.unpaid.count}
            total={toLocaleStringWithCommas(bucketSummary.unpaid.total, "USD", 2)}
          />
          <SummaryItem
            theme="default"
            label="Total Upcoming"
            length={bucketSummary.upcoming.count}
            total={toLocaleStringWithCommas(bucketSummary.upcoming.total, "USD", 2)}
          />
          <SummaryItem
            theme="attention"
            label="Due Soon (Next 5 days)"
            length={bucketSummary.dueSoon.count}
            total={toLocaleStringWithCommas(bucketSummary.dueSoon.total, "USD", 2)}
          />
        </ul>
      </div>
    </aside>
  );
};

export default RecurringCard;
type SummaryItemProps = {
  theme: "default" | "attention";
  label: string;
  length: number;
  total: string;
};

const SummaryItem = ({ theme, label, length, total }: SummaryItemProps) => (
  <li
    data-theme={theme}
    className="flex-row-between w-full text-preset-5
  data-[theme=attention]:text-s-red group not-last:lower-border"
  >
    <p className="text-grey-500 group-data-[theme=attention]:text-s-red ">{label}</p>
    <p className="font-bold">
      {length} ({total})
    </p>
  </li>
);
