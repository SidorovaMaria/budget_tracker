"use client";
import { TYPE_OPTIONS } from "@/constants";
import { AddTransactionSchema } from "@/lib/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "./InputField";
import FormOptionsSelect from "./FormOptionsSelect";
import { useCategoryOptions } from "@/context/OptionsContext";
import { createTransaction } from "@/database/actions/transaction.action";
import { toast } from "../ui/Toast";
import { toDateInputValue } from "@/lib/utils";
import { ITransactionDoc } from "@/database/models/transaction.model";

export type TxType = z.infer<typeof AddTransactionSchema>["type"]; // "income" | "expense"

type AddEditBudgetProps = {
  transactionData?: ITransactionDoc & { categoryId: { name: string; themeId: string } };
  action?: "add" | "edit";
  onSuccess?: () => void;
  isModalOpen?: boolean;
};
type FormInput = z.input<typeof AddTransactionSchema>;
type FormOutput = z.output<typeof AddTransactionSchema>;
const AddNewTransaction = ({ transactionData, onSuccess, action = "add" }: AddEditBudgetProps) => {
  const form = useForm<FormInput, FormOutput>({
    resolver: zodResolver(AddTransactionSchema),
    defaultValues: {
      categoryId: String(transactionData?.categoryId._id) || "",
      name: transactionData?.name || "",
      amount: transactionData?.amount || 0,
      type: transactionData?.type || "expense",
      date: transactionData?.date
        ? toDateInputValue(new Date(transactionData.date))
        : toDateInputValue(new Date()),
      recurring: transactionData?.recurring || false,
    },
  });
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(data: FormInput) {
    if (action === "add") {
      const {
        success,
        error,
        data: newTransaction,
      } = await createTransaction({
        name: data.name,
        amount: data.amount as number,
        type: data.type,
        date: data.date as Date,
        recurring: data.recurring,
        categoryId: data.categoryId,
      });
      if (!success) {
        toast({
          title: "Error",
          description: error?.message || "Unknown error",
        });
      } else {
        toast({
          title: "Success",
          description: `Transaction '${data.name}' added successfully`,
          theme: "success",
        });
        form.reset();
        if (onSuccess) onSuccess();
      }
    }
  }
  const selected = watch("type");
  const charsLeft = 30 - (watch("name")?.length || 0);
  return (
    <FormProvider {...form}>
      <form className="flex flex-col w-full gap-5 -mt-5" onSubmit={handleSubmit(onSubmit)}>
        {/* TYPE SELECTOR */}
        <fieldset className="w-full">
          <legend className="sr-only">Transaction type</legend>
          <div className="flex gap-4" role="radiogroup" aria-label="Transaction type">
            {TYPE_OPTIONS.map(({ value, label, on, off }) => (
              <label key={value} className="w-full cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  {...register("type")}
                  className="peer sr-only"
                  aria-checked={selected === value}
                />
                <span
                  className={[
                    "btn btn-secondary py-2.5 text-preset-4-bold w-full capitalize transition-colors ",
                    "bg-surface text-grey-900", // base
                    selected === value ? on : off,
                  ].join(" ")}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <InputField
          label="Title"
          name="name"
          hint={charsLeft + " characters left"}
          placeholder="Yoga Class"
          inputMode="text"
          autoComplete="off"
          type="text"
          enterKeyHint="next"
        />
        <div className="grid grid-cols-[2fr_1fr] gap-4 -mt-2">
          <InputField
            label="Amount"
            leftSlot={<span className="text-beige-500">$</span>}
            name="amount"
            placeholder="0.00"
            inputMode="decimal"
            autoComplete="off"
            type="text"
            enterKeyHint="next"
          />
          {/* DATE */}
          <InputField label="Date" name="date" autoComplete="off" type="date" enterKeyHint="next" />
        </div>
        {/* Recuring ? */}
        <div className="flex items-center gap-2">
          <label htmlFor="reccuring" className="text-preset-4-bold text-grey-500">
            Recurring Transaction?
          </label>
          <input
            type="checkbox"
            id="recurring"
            {...register("recurring")}
            className="w-4 h-4 rounded-full"
          />
        </div>
        <FormOptionsSelect name="categoryId" label="Category" useOption={useCategoryOptions} />
        <button type="submit" className="btn btn-primary mt-2" disabled={isSubmitting}>
          {action === "edit"
            ? isSubmitting
              ? "Saving..."
              : "Save Changes"
            : isSubmitting
            ? "Adding..."
            : "Add Transaction"}
        </button>
      </form>
    </FormProvider>
  );
};

export default AddNewTransaction;
