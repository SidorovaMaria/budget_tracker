import RecuringTransactionCard from "@/components/cards/RecuringTransactionCard";
import RecurringCard from "@/components/cards/RecurringCard";
import DataRender from "@/components/DataRender";
import TransactionFilter from "@/components/navigation/TransactionFilter";
import { SortKey } from "@/constants";
import { ROUTES } from "@/constants/routes";
import { RECURRING_EMPTY_STATE } from "@/constants/states";
import { getRecurringTransactions } from "@/database/actions/recurring.action";

const RecurringTransactionsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { search, sort, page } = await searchParams;

  const { success, data, error } = await getRecurringTransactions(
    typeof sort === "string" ? (sort as SortKey) : "latest",
    (typeof search === "string" && search) || "",
    (typeof page === "string" && parseInt(page)) || 1,
    10
  );
  if (!success) {
    console.log(error?.message);
  }

  const { totalToPay, bucketSummary, totalCount, transactions } = data || {
    totalToPay: 0,
    bucketSummary: {
      paid: { count: 0, total: 0 },
      unpaid: { count: 0, total: 0 },
      upcoming: { count: 0, total: 0 },
      dueSoon: { count: 0, total: 0 },
    },
    totalCount: 0,
    transactions: [],
  };

  return (
    <>
      {/* Title */}
      <h1 id="recurring-bills" className="">
        Recurring Bills
      </h1>
      <section className="grid grid-cols-1 gap-6 w-full lg:grid-cols-[1fr_2fr] justify-start items-start">
        <RecurringCard
          totalToPay={totalToPay}
          bucketSummary={bucketSummary}
          totalCount={totalCount}
        />
        <section className="flex flex-col gap-6 px-5 py-6 bg-bg rounded-xl bg-white">
          <TransactionFilter route={ROUTES.RECURRING} recurring />
          <aside
            className="md:grid grid-cols-[3fr_2fr] hidden
            text-preset-5 text-grey-500 px-2"
          >
            <p>Bill Title</p>
            <div className="grid grid-cols-2 items-center [&>*:nth-child(2)]:text-right">
              <p>Due Date</p>
              <p>Amount</p>
            </div>
          </aside>
          <section className="flex flex-col w-full">
            <DataRender
              success={success}
              data={transactions}
              emptyState={RECURRING_EMPTY_STATE}
              render={(withType) =>
                withType.map((trans) => (
                  <RecuringTransactionCard key={String(trans._id)} transaction={trans} />
                ))
              }
            />
          </section>
        </section>
      </section>
    </>
  );
};

export default RecurringTransactionsPage;
