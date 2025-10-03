import DataRender from "@/components/DataRender";
import AddNewTransaction from "@/components/forms/AddEditTransaction";
import Pagination from "@/components/navigation/Pagination";
import TransactionFilter from "@/components/navigation/TransactionFilter";
import TransactionsList from "@/components/TransactionsList";
import Modal from "@/components/ui/Modal";
import { EMPTY_TRANSACTIONS, NO_TRANSACTIONS_FOUND } from "@/constants/states";
import { getTransactions } from "@/database/actions/transaction.action";
import React from "react";

const TransactionsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { sort, filter, search, page } = await searchParams;
  const { success, data, error } = await getTransactions({
    page: (typeof page === "string" && parseInt(page)) || 1,
    pageSize: 10,
    sort: (typeof sort === "string" && sort) || "latest",
    filter: (typeof filter === "string" && filter) || "all",
    search: (typeof search === "string" && search) || "",
  });
  if (!success || !data || !data.transactions || !data.pagination) {
    console.log("Error fetching transactions:", error);
  }

  // Determine if there are no transactions at all or just due to filter
  const isEmpty = Array.isArray(data?.transactions) && data.transactions.length === 0;
  const isFilterApplied =
    (typeof filter === "string" && filter !== "all") ||
    (typeof search === "string" && search !== "");

  let emptyState = EMPTY_TRANSACTIONS;
  if (isEmpty && isFilterApplied) {
    emptyState = NO_TRANSACTIONS_FOUND;
  }

  return (
    <>
      {/* Title */}
      <section id="transactions" className="flex-row-between">
        <h1 className="">Transactions</h1>
        <Modal title="Add New Transaction" modalContent={<AddNewTransaction />} description="">
          <button className="btn btn-primary">+ Add New</button>
        </Modal>
      </section>
      <section
        aria-label="Transctions Data"
        className="flex flex-col w-full rounded-xl px-5 py-6 gap-6 bg-white h-full md:p-8"
      >
        {/* Search Filter and Sort Block */}
        <TransactionFilter />
        {/* Transactions List */}
        <DataRender
          success={success}
          data={data?.transactions}
          emptyState={emptyState}
          render={(transactions) => <TransactionsList transactions={transactions} />}
        />
        <Pagination pagination={data!.pagination!} />
      </section>
    </>
  );
};

export default TransactionsPage;
