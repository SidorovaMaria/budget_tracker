import BudgetCard from "@/components/cards/BudgetCard";
import DonutChart from "@/components/DonutChart";
import AddEditBudget from "@/components/forms/AddEditBudget";
import Modal from "@/components/ui/Modal";
import { getBudgets, getBudgetSpendings } from "@/database/actions/budget.action";
import { toLocaleStringWithCommas } from "@/lib/utils";
import { pie } from "d3";
import React from "react";
import { maximum } from "zod/v4-mini";

const BudgetsPage = async () => {
  const { success, error, data: budgets } = await getBudgetSpendings();
  if (!success && !budgets) {
    console.log("Failed to fetch pots" + error?.message);
    return null;
  }

  const totalBudget = budgets!.reduce((acc, budget) => acc + Number(budget.maximum), 0);
  const totalSpent = budgets!.reduce((acc, budget) => acc + (budget.totalSpent || 0), 0);
  const pieChartData = budgets!.map((budget) => ({
    label: budget!.category.name,
    value: budget!.totalSpent || 0,
    color: budget!.theme.value,
    maximum: Number(budget.maximum),
  }));
  const notAvailableThemes = budgets ? budgets.map((budget) => budget.themeId.toString()) : [];
  const notAvailableCategories = budgets
    ? budgets.map((budget) => budget.categoryId.toString())
    : [];

  return (
    <>
      {/* Title */}
      <header className="flex-row-between">
        <h1 id="budgets" className="">
          Budgets
        </h1>
        <Modal
          title="Add New Budget"
          modalContent={
            <AddEditBudget
              notAvailableCategories={notAvailableCategories}
              notAvailableThemes={notAvailableThemes}
            />
          }
          description="Choose a category to set a spending budget. These categories can help you monitor spending."
        >
          <button className="btn btn-primary">+ Add New Budget</button>
        </Modal>
      </header>
      <section className=" gap-6 w-full ovefllow-y-auto grid grid-cols-1 lg:grid-cols-2 ">
        <aside className="flex flex-col w-full gap-8 px-5 py-6 md:flex-row md:items-center lg:flex-col">
          <div className="flex-center w-full">
            <DonutChart totalBudget={totalBudget} totalSpent={totalSpent} data={pieChartData} />
          </div>
          {/* Summary */}
          <div className="flex flex-col w-full gap-6">
            <h4 className="text-preset-2 ">Spending Summary</h4>
            <div className="flex flex-col w-full gap-4 ">
              {pieChartData.length === 0 ? (
                <div>
                  <p className="text-preset-4 text-grey-500  capitalize">No budgets set yet.</p>
                  <p className="text-preset-4 text-grey-500  capitalize">
                    Click &quot;Add New Budget&quot; to get started!
                  </p>
                </div>
              ) : (
                pieChartData.map((budget) => (
                  <div className="flex-row-between relative pl-4" key={budget.color}>
                    <span
                      className="absolute left-0 top-0 w-1 h-full rounded-lg "
                      style={{ backgroundColor: budget.color }}
                    />
                    <p className="text-preset-4 text-grey-500  capitalize">{budget.label} </p>
                    <p className="text-preset-3 align-middle">
                      {toLocaleStringWithCommas(budget.value, "USD", 2)}{" "}
                      <span className="text-preset-5 text-grey-500 inline-flex align-middle">
                        of {toLocaleStringWithCommas(budget.maximum, "USD", 2)}
                      </span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
        <section className="flex flex-col gap-6 w-full overflow-auto lg:max-h-[calc(100vh-15vh)] lg:px-4">
          {budgets && budgets.length > 0 ? (
            budgets.map((budget) => (
              <BudgetCard
                key={budget._id}
                budget={budget}
                notAvailableThemes={notAvailableThemes}
                notAvailableCategories={notAvailableCategories}
              />
            ))
          ) : (
            <p className="text-preset-4 text-grey-500  capitalize">No budgets set yet.</p>
          )}
        </section>
      </section>
    </>
  );
};

export default BudgetsPage;
