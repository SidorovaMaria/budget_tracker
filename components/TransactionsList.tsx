import { ITransactionDoc } from "@/database/models/transaction.model";
import { PersonIcon } from "@radix-ui/react-icons";
import Modal from "./ui/Modal";
import { format } from "date-fns";
import AddNewTransaction from "./forms/AddEditTransaction";
import Image from "next/image";

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
const AVATAR_PX = 40;
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const TransactionCard = ({
  transaction,
}: {
  transaction: ITransactionDoc & { categoryId: { name: string; themeId: string } };
}) => {
  const isIncome = transaction.type === "income";
  const colorAccent = isIncome ? "#277c78" : "#c94736";
  const formattedDate = format(new Date(transaction.date!), "dd MMM yyyy");

  return (
    <div
      className="
        grid items-center
        grid-cols-[minmax(0,1fr)_auto] 
        md:grid-cols-[3fr_1fr_1fr_1fr]
        gap-0 md:gap-8
        not-last:lower-border
        rounded-lg px-2 md:px-4 py-2
        hover:scale-[1.01] hover:drop-shadow-xs transition-300
        cursor-pointer
      "
    >
      {/* Profile + Name (min-w-0 enables truncation within grids) */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Avatar: reserve space to avoid CLS, force square crop */}
        {transaction.avatar ? (
          <div className="relative" style={{ width: AVATAR_PX, height: AVATAR_PX }}>
            <Image
              src={transaction.avatar}
              alt={transaction.name}
              width={AVATAR_PX}
              height={AVATAR_PX}
              sizes={`${AVATAR_PX}px`}
              className="rounded-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div
            className="rounded-full"
            style={{
              width: AVATAR_PX,
              height: AVATAR_PX,
              background: `linear-gradient(to bottom right, transparent, ${colorAccent})`,
            }}
            aria-hidden
          />
        )}

        <div className="flex flex-col min-w-0">
          <p className="text-preset-4-bold truncate">{transaction.name}</p>

          {/* On mobile, show category under name */}
          <p className="text-preset-5 text-grey-500 md:hidden truncate">
            {transaction.categoryId.name}
          </p>
        </div>
      </div>

      {/* Category (hidden on mobile) */}
      <p className="text-preset-5 text-grey-500 hidden md:block truncate">
        {transaction.categoryId.name}
      </p>

      {/* Date (hidden on mobile) */}
      <p className="text-preset-5 text-grey-500 hidden md:block whitespace-nowrap">
        {formattedDate}
      </p>

      {/* Amount */}
      <p
        className={`
          text-preset-4-bold text-right hidden md:block 
          ${isIncome ? "text-s-green" : "text-s-red"}
        `}
      >
        {`${isIncome ? "+" : "-"}${currency.format(Number(transaction.amount))}`}
      </p>

      {/* Mobile right column: amount + date */}
      <div className="md:hidden flex flex-col items-end gap-1">
        <p className={`text-preset-4-bold ${isIncome ? "text-s-green" : "text-s-red"}`}>
          {`${isIncome ? "+" : "-"}${currency.format(Number(transaction.amount))}`}
        </p>
        <p className="text-preset-5 text-grey-500">{formattedDate}</p>
      </div>
    </div>
  );
};
