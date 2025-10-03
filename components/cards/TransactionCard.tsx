"use client";
import { ITransactionDoc } from "@/database/models/transaction.model";
import { format } from "date-fns";
import Image from "next/image";
import ContextMenu from "../ui/ContextMenu";
import Modal from "../ui/Modal";
import AddNewTransaction from "../forms/AddEditTransaction";
import { toast } from "../ui/Toast";
import { deleteTransaction } from "@/database/actions/transaction.action";
import { AVATAR_PX } from "@/constants";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const TransactionCard = ({
  transaction,
}: {
  transaction: ITransactionDoc & { categoryId: { name: string; themeId: string } };
}) => {
  const isIncome = transaction.type === "income";
  const colorAccent = isIncome ? "#277c78" : "#c94736";
  const formattedDate = format(new Date(transaction.date!), "dd MMM yyyy");
  const handleDelete = async () => {
    const { success, error } = await deleteTransaction(String(transaction._id));
    if (success) {
      toast({
        theme: "success",
        title: "Success",
        description: `Transaction '${transaction.name}' deleted successfully`,
      });
    } else {
      toast({
        theme: "error",
        title: "Error",
        description: error?.message || "Something went wrong",
      });
    }
  };

  return (
    <ContextMenu context={<ContextContext transaction={transaction} handleDelete={handleDelete} />}>
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
        focus:border
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
    </ContextMenu>
  );
};
export default TransactionCard;
type ContextContextProps = {
  transaction: ITransactionDoc & { categoryId: { name: string; themeId: string } };
  handleDelete: () => void;
};

const ContextContext = ({ transaction, handleDelete }: ContextContextProps) => {
  return (
    <>
      <Modal
        title={`Edit '${transaction.name}'`}
        modalContent={<AddNewTransaction transactionData={transaction} action="edit" />}
        description=""
      >
        <button className="w-full text-preset-4 hover:bg-[#eee] text-left p-2 cursor-pointer">
          Edit
        </button>
      </Modal>
      <hr className="mx-5 border-grey-100" />
      <Modal
        title={`Delete '${transaction.name}'`}
        modalContent={<DeleteTransactionContext onDelete={handleDelete} onSuccess={() => {}} />}
        description="Are you sure you want to delete this transaction? This action cannot be reversed, and all the data inside it will be removed forever."
      >
        <button className="w-full text-preset-4 hover:bg-red-100  text-left p-2 cursor-pointer text-s-red">
          Delete Transaction
        </button>
      </Modal>
    </>
  );
};
const DeleteTransactionContext = ({
  onDelete,
  onSuccess,
}: {
  onDelete: () => void;
  onSuccess?: () => void;
}) => {
  const handleDelete = () => {
    if (onSuccess) onSuccess();
    setTimeout(() => {
      onDelete();
    }, 300);
  };
  return (
    <div>
      <button onClick={handleDelete} className="btn btn-destroy w-full">
        Yes, Confirm Deletion
      </button>
      <button onClick={onSuccess} className="btn btn-secondary w-full mt-3">
        Cancel
      </button>
    </div>
  );
};
