import DataRender from "@/components/DataRender";

import AddEditBudget from "@/components/forms/AddEditBudget";
import BudgetClientList from "@/components/lists/BudgetClientList";
import Modal from "@/components/ui/Modal";
import { EMPTY_BUDGETS } from "@/constants/states";
import { getBudgetSpendings } from "@/database/actions/budget.action";
import { format } from "date-fns";
import React from "react";

const BudgetsPage = async () => {
  const { success, error, data: budgets } = await getBudgetSpendings();
  if (!success && !budgets) {
    console.log("Failed to fetch pots" + error?.message);
    return null;
  }

  const notAvailableThemes = budgets ? budgets.map((budget) => budget.themeId.toString()) : [];
  const notAvailableCategories = budgets
    ? budgets.map((budget) => budget.categoryId.toString())
    : [];
  const date = new Date();

  return (
    <>
      {/* Title */}
      <header className="flex-row-between">
        <h1 id="budgets" className="">
          Budgets{" "}
          <span className="text-preset-4 text-grey-500  capitalize">
            ({format(date, "MMMM yyyy")})
          </span>
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
      <DataRender
        success={success}
        emptyState={EMPTY_BUDGETS}
        data={budgets}
        render={(budgets) => <BudgetClientList budgets={budgets} />}
      />
    </>
  );
};

export default BudgetsPage;
