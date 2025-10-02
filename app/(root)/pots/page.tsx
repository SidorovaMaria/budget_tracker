import PotCard from "@/components/cards/PotCard";
import DataRender from "@/components/DataRender";
import AddEditPot from "@/components/forms/AddEditPot";
import PotsClientList from "@/components/lists/PotsClientList";
import Modal from "@/components/ui/Modal";
import { EMPTY_POTS } from "@/constants/states";
import { getPots } from "@/database/actions/pot.action";
import { IPotDoc } from "@/database/models/pot.model";
import { IThemeDoc } from "@/database/models/theme.model";

import React from "react";

const PotsPage = async () => {
  const { success, data: potsData, error } = await getPots();
  if (!success) {
    console.log("Failed to fetch pots" + error?.message);
    return null;
  }
  const notAvailableThemes = potsData ? potsData.map((pot) => pot.themeId._id.toString()) : [];

  return (
    <>
      {/* Title */}
      <section id="pots" className="flex-row-between">
        <h1 className="">Pots</h1>
        <Modal
          title="Add New Pot"
          modalContent={<AddEditPot notAvailableThemes={notAvailableThemes} />}
          description="Create a pot to set savings targets. These can help keep you on track as you save for special purchases."
        >
          <button className="btn btn-primary">+ Add New Pot</button>
        </Modal>
      </section>
      <section id="pots-list" className="mt-8">
        <DataRender
          success={success}
          emptyState={EMPTY_POTS}
          data={potsData}
          render={(potsData) => <PotsClientList potsData={potsData as PotJSON[]} />}
        />
      </section>
    </>
  );
};

export default PotsPage;
