"use client";
import { toLocaleStringWithCommas } from "@/lib/utils";
import { AddWithdrawFromPotSchema } from "@/lib/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { motion } from "motion/react";
import InputField from "./InputField";
import { addToPot, withdrawFromPot } from "@/database/actions/pot.action";
import { toast } from "../ui/Toast";

type FormInput = z.input<typeof AddWithdrawFromPotSchema>;
type FormOutput = z.output<typeof AddWithdrawFromPotSchema>;
type AddWithdrawFromPotProps = {
  pot: PotJSON;
  action: "add" | "withdraw";
  onSuccess?: () => void;
};
const AddWithdrawFromPot = ({ pot, action, onSuccess }: AddWithdrawFromPotProps) => {
  const form = useForm<FormInput, FormOutput>({
    resolver: zodResolver(AddWithdrawFromPotSchema),
    defaultValues: {
      amount: undefined,
    },
    mode: "onBlur",
  });
  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = form;
  const newTotal =
    action === "add"
      ? pot.total + Number(watch("amount") || 0)
      : pot.total - Number(watch("amount") || 0);

  const percentage = ((newTotal / pot.target) * 100).toFixed(2);

  const onSubmit = async (data: FormInput) => {
    if (action === "add") {
      const result = await addToPot(pot.id, data.amount as number);
      if (!result.success) {
        toast({
          title: "Can not add to pot",
          description: result.error?.message || "Something went wrong",
          theme: "error",
        });
      } else {
        toast({
          title: "Successfully added to pot",
          description: `Added ${toLocaleStringWithCommas(data.amount as number, "USD", 2)} to ${
            pot.name
          }`,
          theme: "success",
        });
        reset();
        if (onSuccess) onSuccess();
      }
    } else {
      const result = await withdrawFromPot(pot.id, data.amount as number);
      if (!result.success) {
        toast({
          title: "Can not withdraw from pot",
          description: result.error?.message || "Something went wrong",
          theme: "error",
        });
      } else {
        toast({
          title: "Successfully withdrew from pot",
          description: `Withdrew ${toLocaleStringWithCommas(
            data.amount as number,
            "USD",
            2
          )} from ${pot.name}`,
          theme: "success",
        });
        reset();
        if (onSuccess) onSuccess();
      }
    }
  };
  return (
    <section className="flex flex-col w-full gap-5">
      {/* New Amount */}
      <div className="flex-row-between ">
        <p className="text-preset-4 text-grey-500 capitalize">New Amount</p>
        <p className="text-preset-1">{toLocaleStringWithCommas(newTotal ?? 0, "USD", 2)}</p>
      </div>
      {/* Progress Bar and Percentage */}
      <div className="flex flex-col gap-3">
        <div className="relative w-full h-2 bg-beige-100 rounded-sm overflow-hidden">
          <motion.div
            className={`h-full rounded-sm absolute bg-grey-900 z-40
                                ${
                                  newTotal !== pot.total &&
                                  " rounded-r-none border-r-2 border-white"
                                }`}
            initial={false}
            animate={{
              width:
                action === "add"
                  ? `${(pot.total / pot.target) * 100}%`
                  : `${(newTotal / pot.target) * 100}%`,
            }}
            transition={{ duration: 0.3, ease: "linear" }}
          />

          <motion.div
            className={`h-full rounded-sm absolute  bg-red-400 z-30`}
            initial={false}
            animate={{
              width:
                action !== "add"
                  ? `${(pot.total / pot.target) * 100}%`
                  : `${(newTotal / pot.target) * 100}%`,
            }}
            transition={{ duration: 0.3, ease: "linear" }}
            style={{
              backgroundColor: action === "add" ? "#277c78" : "#c94736",
            }}
          />
        </div>
        <div className="flex-row-between w-full">
          <p className={`text-preset-5  ${action === "add" ? "text-s-green" : "text-s-red"}`}>
            {percentage}%
          </p>
          <p className="text-preset-5 text-grey-500">
            Target of {toLocaleStringWithCommas(pot.target, "USD", 0)}
          </p>
        </div>
      </div>
      {/* Form */}
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            leftSlot={<span className="text-beige-500">$</span>}
            name="amount"
            label={`Amount to ${action === "add" ? "Add" : "Withdraw"}`}
            type="number"
            inputMode="numeric"
            autoComplete="off"
            step="1"
            enterKeyHint="done"
            placeholder="E.g. 20"
          />
          <button type="submit" className="btn btn-primary w-full mt-5" disabled={isSubmitting}>
            {action === "add"
              ? isSubmitting
                ? "Adding..."
                : "Confirm Addition"
              : isSubmitting
              ? "Withdrawing..."
              : "Confirm Withdrawal"}
          </button>
        </form>
      </FormProvider>
    </section>
  );
};

export default AddWithdrawFromPot;
