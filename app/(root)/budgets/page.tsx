import AddEditBudget from "@/components/forms/AddEditBudget";
import Modal from "@/components/ui/Modal";
import React from "react";

const BudgetsPage = () => {
  return (
    <>
      {/* Title */}
      <header className="flex-row-between">
        <h1 id="budhets" className="">
          Budgets
        </h1>
        <Modal
          title="Add New Budget"
          modalContent={<AddEditBudget />}
          description="Choose a category to set a spending budget. These categories can help you monitor spending."
        >
          <button className="btn btn-primary">+ Add New Budget</button>
        </Modal>
      </header>
    </>
  );
};

export default BudgetsPage;
