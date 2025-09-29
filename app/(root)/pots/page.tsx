import AddEditPot from "@/components/forms/AddEditPot";
import Modal from "@/components/ui/Modal";
import React from "react";

const PotsPage = () => {
  return (
    <>
      {/* Title */}
      <header className="flex-row-between">
        <h1 id="pots" className="">
          Pots
        </h1>
        <Modal
          title="Add New Pot"
          modalContent={<AddEditPot />}
          description="Create a pot to set savings targets. These can help keep you on track as you save for special purchases."
        >
          <button className="btn btn-primary">+ Add New Pot</button>
        </Modal>
      </header>
    </>
  );
};

export default PotsPage;
