import { toLocaleStringWithCommas } from "@/lib/utils";
import React from "react";
type BalanceCardProps = {
  label: string;
  value: number;
  card: "current" | "default";
};
const BalanceCard = ({ label, value, card }: BalanceCardProps) => {
  return (
    <div
      data-state={card}
      className={`rounded-xl w-full p-5 flex flex-col gap-3 md:p-6 text-grey-500 bg-white data-[state=current]:bg-grey-900 capitalize
        data-[state=current]:text-white`}
    >
      <span className="text-preset-4 ">{label}</span>
      <span className="text-preset-1">{toLocaleStringWithCommas(value, "USD", 2)}</span>
    </div>
  );
};

export default BalanceCard;
