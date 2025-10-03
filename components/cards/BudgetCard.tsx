"use client";
import { motion } from "motion/react";
import { BudgetJSON, deleteBudget } from "@/database/actions/budget.action";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import React from "react";
import IconElipsis from "../icons/IconElipsis";
import DropDownMenu from "../ui/DropDownMenu";
import { toLocaleStringWithCommas } from "@/lib/utils";

import Link from "next/link";
import { ROUTES } from "@/constants/routes";

import IconCaretRight from "../icons/IconCaretRight";
import { format } from "date-fns";
import Image from "next/image";
import Modal from "../ui/Modal";
import AddEditBudget from "../forms/AddEditBudget";
import { toast } from "../ui/Toast";
const AVATAR_PX = 40;
type BudgetCardProps = {
  budget: BudgetJSON;
  notAvailableThemes?: string[];
  notAvailableCategories?: string[];
};
const BudgetCard = ({ budget, notAvailableThemes, notAvailableCategories }: BudgetCardProps) => {
  const isOverBudget = budget.totalSpent && budget.totalSpent > Number(budget.maximum);
  const handleBudgetDelete = async () => {
    const { success, error } = await deleteBudget({ budgetId: budget._id });
    if (!success) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete budget",
        theme: "error",
      });
    } else {
      toast({
        title: "Success",
        description: `Budget '${budget.category.name}' deleted successfully.`,
        theme: "success",
      });
    }
  };

  return (
    <div className="flex flex-col w-full gap-5 rounded-xl px-5 py-6 md:p-8 bg-white ">
      <div className="flex-row-between">
        <span
          className="size-4 rounded-full mr-4"
          style={{
            backgroundColor: budget.theme.value,
          }}
        />
        <h3 className="text-preset-2 w-full flex-1 flex items-center gap-3">
          {budget.category.name}
          {isOverBudget ? (
            <span className="text-red-500/80  text-preset-4-bold inline-flex items-center gap-1">
              <InfoCircledIcon className="size-5 text-red-500" /> Over Budget
            </span>
          ) : null}
        </h3>
        <DropDownMenu
          trigger={
            <IconElipsis className="size-4 text-grey-300 hover:text-grey-900  cursor-pointer hover:scale-105 transition-300" />
          }
          context={
            <BudgetDropDownContext
              budget={budget}
              handleBudgetDelete={handleBudgetDelete}
              notAvailableThemes={notAvailableThemes}
              notAvailableCategories={notAvailableCategories}
            />
          }
        />
      </div>
      <div className="flex flex-col w-full gap-4 ">
        <p className="text-preset-4 text-grey-500">
          Maximum of {toLocaleStringWithCommas(budget.maximum, "USD", 2)}
        </p>
        {/* Porgress Bar */}
        <div className="flex flex-col w-full gap-3 ">
          <div
            className={`relative w-full h-6 p-1 rounded-sm overflow-hidden bg-beige-100
            ${isOverBudget ? "bg-red-400" : ""}`}
          >
            <motion.div
              className="h-full rounded-sm"
              initial={false}
              animate={{
                // If the budget is over, set width to 100%
                width: isOverBudget ? "100%" : `${(budget.totalSpent / budget.maximum) * 100}%`,
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{ backgroundColor: budget.theme.value }}
            />
          </div>
        </div>
        <div
          className="flex-row-between gap-4 w-full border-l-4 px-4"
          style={{
            borderColor: budget.theme.value,
          }}
        >
          <div className="flex flex-col w-full gap-1 ">
            <p className="text-preset-5 text-grey-500">Spent</p>
            <p className="text-preset-4-bold">
              {toLocaleStringWithCommas(budget.totalSpent, "USD", 2)}
            </p>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <p className="text-preset-5 text-grey-500">Remaining</p>
            <p className="text-preset-4-bold">
              {toLocaleStringWithCommas(budget.maximum - budget.totalSpent, "USD", 2)}
            </p>
          </div>
        </div>
      </div>
      {/* Latest Spendings */}
      {budget.transactions && budget.transactions.length > 0 && (
        <aside className="flex flex-col w-full gap-5 rounded-xl bg-beige-100/50 p-4 md:p-5">
          <div className="flex flex-col w-full gap-4 ">
            <div className="flex-row-between w-full">
              <h3 className="text-preset-3">Latest Spending</h3>
              <Link
                href={{
                  pathname: ROUTES.TRANSACTIONS,
                  query: { filter: budget.categoryId },
                }}
                className="text-preset-4 text-grey-500 cursor-pointer group hover:text-grey-900 transition-300 flex-center gap-3"
              >
                See All
                <IconCaretRight />
              </Link>
            </div>
          </div>
          {budget.transactions.slice(0, 4).map((transaction) => {
            const formattedDate = transaction.date
              ? format(new Date(transaction.date), "MMM dd, yyyy")
              : "";
            const isIncome = transaction.type === "income";
            const colorAccent = isIncome ? "#277c78" : "#c94736";

            return (
              <div
                key={String(transaction._id)}
                className="flex-row-between w-full gap-4 pb-3 border-b border-grey-500/15 last:border-b-0 pt-3 first:pt-0"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="hidden md:block">
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
                  </div>
                  <p className="text-preset-5-bold">{transaction.name} </p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <p className="text-preset-5-bold">
                    -{toLocaleStringWithCommas(Number(transaction.amount), "USD", 2)}
                  </p>
                  <p className="text-preset-5 text-grey-500">{formattedDate}</p>
                </div>
              </div>
            );
          })}
        </aside>
      )}
    </div>
  );
};

export default BudgetCard;

const BudgetDropDownContext = ({
  budget,
  handleBudgetDelete,
  onClose,
  notAvailableThemes,
  notAvailableCategories,
}: {
  budget: BudgetJSON;
  handleBudgetDelete: () => void;
  onClose?: () => void;
  notAvailableThemes?: string[];
  notAvailableCategories?: string[];
}) => {
  const withCurrentAvailableTheme = notAvailableThemes?.filter(
    (theme) => theme !== budget.themeId.toString()
  );
  const withCurrentAvailableCategory = notAvailableCategories?.filter(
    (category) => category !== budget.categoryId.toString()
  );
  return (
    <>
      <Modal
        title={`Edit Budget`}
        modalContent={
          <AddEditBudget
            budgetData={budget}
            closeDropDown={onClose}
            action="edit"
            notAvailableThemes={withCurrentAvailableTheme}
            notAvailableCategories={withCurrentAvailableCategory}
          />
        }
        description="As your budgets change, feel free to update your spending limits."
      >
        <button className="dropdown-btn">Edit Budget</button>
      </Modal>
      <hr className="mx-5 border-grey-100" />
      <Modal
        title={`Delete '${budget.category.name}' ?`}
        modalContent={
          <DeleteBudgetContext
            onDelete={handleBudgetDelete}
            onSuccess={() => {}}
            closeDropDown={onClose}
          />
        }
        description="Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever."
      >
        <button className="dropdown-btn hover:bg-red-100 text-s-red">Delete Budget</button>
      </Modal>
    </>
  );
};

const DeleteBudgetContext = ({
  onDelete,
  onSuccess,
  closeDropDown,
}: {
  onDelete: () => void;
  onSuccess: () => void;
  closeDropDown?: () => void;
}) => {
  const handleDelete = () => {
    onSuccess();
    if (closeDropDown) closeDropDown();
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
