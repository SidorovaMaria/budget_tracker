import { ITransactionDoc } from "@/database/models/transaction.model";
import { PersonIcon } from "@radix-ui/react-icons";
import Modal from "./ui/Modal";
import { format } from "date-fns";
import AddNewTransaction from "./forms/AddEditTransaction";
import Image from "next/image";
import TransactionCard from "./cards/TransactionCard";

type TransactionsListProps = {
  transactions: (ITransactionDoc & { categoryId: { name: string; themeId: string } })[];
};
const TransactionsList = ({ transactions }: TransactionsListProps) => {
  return (
    <section className="flex flex-col  w-full gap-6">
      <aside className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr] gap-8 py-3  text-preset-5 text-grey-500 [&>p]:last:text-right border-b border-grey-100">
        <p>Recipient/Sender</p>
        <p>Category</p>
        <p>Transaction Date</p>
        <p>Amount</p>
      </aside>
      <section className="flex flex-col w-full gap-4">
        {transactions.map((transaction) => (
          <TransactionCard key={String(transaction._id)} transaction={transaction} />
        ))}
      </section>
    </section>
  );
};

export default TransactionsList;
