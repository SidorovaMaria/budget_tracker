import React from "react";
import OverviewLink from "../navigation/OverviewLink";
import { ROUTES } from "@/constants/routes";
import IconPot from "../icons/IconPot";
import { toLocaleStringWithCommas } from "@/lib/utils";
import Modal from "../ui/Modal";
import AddEditPot from "../forms/AddEditPot";
type PotsOverviewProps = {
  total: number;
  pots: PotJSON[];
};

const PotsOverview = ({ total, pots }: PotsOverviewProps) => {
  return (
    <section className="overview-content" aria-labelledby="Top 4 Pots">
      <OverviewLink title="Pots" href={ROUTES.POTS} linkText="See Details" />
      <div className="flex flex-col w-full justify-start gap-5 md:grid md:grid-cols-[2fr_3fr] lg:grid-cols-2 items-start">
        <div
          className="flex w-full h-full items-center justify-start gap-4 bg-beige-100 p-4 rounded-xl"
          aria-label="Total Saved across all pots"
        >
          <IconPot className="size-10 text-s-green" aria-hidden="true" />
          <div className="flex flex-col gap-2 justify-center h-full w-full">
            <p className="text-preset04 text-grey-500 ">Total Saved</p>
            <h5 className="text-preset-1">{toLocaleStringWithCommas(total, "USD", 0)}</h5>
          </div>
        </div>
        {pots.length === 0 ? (
          <div className="flex flex-col w-full h-full gap-4">
            <p className="text-grey-500 text-preset-4 text-center">
              You have no pots yet. Start by creating one!
            </p>
            <Modal
              title="Add New Pot"
              modalContent={<AddEditPot />}
              description="Create a pot to set savings targets. These can help keep you on track as you save for special purchases."
            >
              <button className="btn btn-primary py-2 px-3 w-fit mx-auto">+ Add New Pot</button>
            </Modal>
          </div>
        ) : (
          <ul
            className={`grid gap-4 w-full ${pots.length <= 2 ? "grid-cols-1" : "grid-cols-2"}`}
            role="list"
            aria-label="List of savings pots"
          >
            {pots.slice(0, 4).map((pot) => (
              <li
                key={pot.id}
                className="flex flex-col w-full gap-1 pl-5 min-h-10 relative justify-center"
              >
                <span
                  className="absolute h-full w-1 left-0 top-0 rounded-md"
                  aria-hidden="true"
                  style={{
                    backgroundColor: pot.themeId.value,
                  }}
                ></span>
                <p className="text-preset-5 text-grey-500">{pot.name}</p>
                <p className="text-preset-4-bold">
                  {toLocaleStringWithCommas(pot.total, "USD", 0)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default PotsOverview;
