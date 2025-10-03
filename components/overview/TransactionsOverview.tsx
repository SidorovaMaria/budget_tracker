import { ITransactionDoc } from "@/database/models/transaction.model";
import React from "react";
import OverviewLink from "../navigation/OverviewLink";
import { ROUTES } from "@/constants/routes";
import TransactionCard from "../cards/TransactionCard";
type Props = {
  transactions: ITransactionDoc[];
};
const TransactionsOverview = ({ transactions }: Props) => {
  console.log(transactions);
  return (
    <section className="overview-content" aria-labelledby="Top 4 Pots">
      <OverviewLink title="Transactions" href={ROUTES.TRANSACTIONS} linkText="View All" />
      {transactions.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No recent transactions</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {transactions.slice(0, 5).map((transaction) => (
            <li key={String(transaction._id)}>
              <TransactionCard
                transaction={
                  transaction as ITransactionDoc & { categoryId: { name: string; themeId: string } }
                }
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default TransactionsOverview;
