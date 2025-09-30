"use client";
import React from "react";
import IconElipsis from "../icons/IconElipsis";
import { toLocaleStringWithCommas } from "@/lib/utils";
import { motion } from "motion/react";
import Modal from "../ui/Modal";
import AddWithdrawFromPot from "../forms/AddWithdrawFromPot";
import DropDownMenu from "../ui/DropDownMenu";

import AddEditPot from "../forms/AddEditPot";
import { deletePot } from "@/database/actions/pot.action";
import { toast } from "../ui/Toast";
const PotCard = ({ pot }: { pot: PotJSON }) => {
  const handlePotDelete = async () => {
    const { success, error } = await deletePot(pot.id);
    if (!success) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete pot",
        theme: "error",
      });
    } else {
      const message =
        pot.total !== 0
          ? `${toLocaleStringWithCommas(
              pot.total,
              "USD",
              2
            )} has been refunded to your current account.`
          : "";

      toast({
        title: "Success",
        description: `Pot '${pot.name}' deleted successfully. ${message}`,
        theme: "success",
      });
    }
  };

  return (
    <article className="flex flex-col w-full gap-8 px-5 py-6 rounded-xl bg-white ">
      <div className="flex-row-between">
        <h3 className="text-preset-2  flex items-center gap-4 flex-1">
          <span
            className="size-4 inline-flex rounded-full"
            style={{ backgroundColor: pot.themeId.value }}
          />
          {pot.name}
        </h3>

        <DropDownMenu
          trigger={<IconElipsis className="size-5 cursor-pointer hover:scale-105 transition-300" />}
          context={<PotDropdownContent pot={pot} handlePotDelete={handlePotDelete} />}
        />
      </div>
      <section className="flex flex-col w-full gap-4 ">
        <div className="flex items-center justify-between w-full">
          <p className="text-preset-4 text-grey-500 capitalize">total saved</p>
          <p className="text-preset-1">{toLocaleStringWithCommas(pot.total, "USD", 2)}</p>
        </div>
        {/* Progress Bar */}
        <div className="flex flex-col w-full gap-3">
          <div className="relative w-full h-2 bg-grey-100 rounded-sm overflow-hidden">
            <motion.div
              className="h-full rounded-sm"
              initial={false}
              animate={{
                width: `${(pot.total / pot.target) * 100}%`,
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{ backgroundColor: pot.themeId.value }}
            />
          </div>
          <div className="flex-row-between w-full">
            <p className="text-preset-5-bold text-grey-500">
              {((pot.total / pot.target) * 100).toFixed(2)}%
            </p>
            <p className="text-preset-5 text-grey-500">
              Target of {toLocaleStringWithCommas(pot.target, "USD", 0)}
            </p>
          </div>
        </div>
      </section>
      <div className="flex-center w-full gap-4">
        <Modal
          title={`Add to '${pot.name}'`}
          modalContent={<AddWithdrawFromPot pot={pot} action="add" />}
          description="Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance."
        >
          <button className="btn btn-secondary w-full ">+Add Money</button>
        </Modal>
        <Modal
          title={`Withdraw from '${pot.name}'`}
          modalContent={<AddWithdrawFromPot pot={pot} action="withdraw" />}
          description="Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot."
        >
          <button className="btn btn-secondary w-full ">Withdraw</button>
        </Modal>
      </div>
    </article>
  );
};

export default PotCard;

const DeletePotContent = ({
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
const PotDropdownContent = ({
  pot,
  handlePotDelete,
  onClose,
}: {
  pot: PotJSON;
  handlePotDelete: () => void;
  onClose?: () => void;
}) => {
  return (
    <>
      <Modal
        title={`Edit Pot`}
        modalContent={<AddEditPot potData={pot} action="edit" closeDropDown={onClose} />}
        description="If your saving targets change, feel free to update your pots."
      >
        <button className="dropdown-btn">Edit Pot</button>
      </Modal>
      <hr className="mx-5 border-grey-100" />
      <Modal
        title={`Delete '${pot.name}' ?`}
        modalContent={
          <DeletePotContent
            onDelete={handlePotDelete}
            onSuccess={() => {}}
            closeDropDown={onClose}
          />
        }
        description="Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever."
      >
        <button className="dropdown-btn hover:bg-red-100 text-s-red">Delete Pot</button>
      </Modal>
    </>
  );
};
