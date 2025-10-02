"use client";
import { BudgetSchema } from "@/lib/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import InputField from "./InputField";

import { BudgetJSON, createBudget, updateBudget } from "@/database/actions/budget.action";
import { toast } from "../ui/Toast";
import FormOptionsSelect from "./FormOptionsSelect";
import { useCategoryOptions, useThemeOptions } from "@/context/OptionsContext";
type AddEditBudgetProps = {
  budgetData?: BudgetJSON;
  action?: "add" | "edit";
  onSuccess?: () => void;
  isModalOpen?: boolean;
  closeDropDown?: () => void;
  notAvailableCategories?: string[];
  notAvailableThemes?: string[];
};
type FormInput = z.input<typeof BudgetSchema>;
type FormOutput = z.output<typeof BudgetSchema>;
const AddEditBudget = ({
  action = "add",
  budgetData,
  onSuccess,
  isModalOpen,
  closeDropDown,
  notAvailableCategories,
  notAvailableThemes,
}: AddEditBudgetProps) => {
  const form = useForm<FormInput, FormOutput>({
    resolver: zodResolver(BudgetSchema),
    defaultValues: {
      categoryId: budgetData?.categoryId || "",
      maximum: budgetData?.maximum || undefined,
      themeId: budgetData?.themeId || "",
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;
  console.log(budgetData);
  const onSubmit = async (data: FormInput) => {
    if (action === "edit") {
      const { success, error } = await updateBudget(budgetData?._id as string, {
        categoryId: data.categoryId,
        maximum: data.maximum as number,
        themeId: data.themeId,
      });
      if (!success) {
        toast({
          title: "Error",
          description: error?.message || "Failed to update budget",
          theme: "error",
        });
      } else {
        toast({
          title: "Success",
          description: `Budget '${data.categoryId}' updated successfully`,
          theme: "success",
        });
        if (onSuccess) onSuccess();
        if (closeDropDown) closeDropDown();
        setTimeout(() => {
          form.reset();
        }, 300);
      }
    } else {
      const {
        success,
        error,
        data: budgetData,
      } = await createBudget({
        categoryId: data.categoryId,
        maximum: data.maximum as number,
        themeId: data.themeId,
      });

      if (!success || !budgetData) {
        toast({
          title: "Error",
          description: error?.message || "Failed to create budget",
          theme: "error",
        });
      } else {
        toast({
          title: "Success",
          description: `Budget '${budgetData.categoryId.name}' created successfully`,
          theme: "success",
        });
      }
      if (onSuccess) onSuccess();
      if (closeDropDown) closeDropDown();
      setTimeout(() => {
        form.reset();
      }, 300);
    }
  };
  useEffect(() => {
    if (isModalOpen === false) {
      setTimeout(() => {
        form.reset();
      }, 300); // Delay reset to allow modal close animation and not show erasing data
    }
  }, [isModalOpen, form]);
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormOptionsSelect
          name="categoryId"
          label="Category"
          useOption={useCategoryOptions}
          notAvailable={notAvailableCategories}
        />
        <InputField
          leftSlot={<span className="text-beige-500">$</span>}
          name="maximum"
          label="Maximum Spend"
          type="number"
          inputMode="numeric"
          autoComplete="off"
          step="1"
          enterKeyHint="next"
          placeholder="E.g. 2000"
        />

        <FormOptionsSelect
          name="themeId"
          label="Theme"
          useOption={useThemeOptions}
          colorTag
          notAvailable={notAvailableThemes}
        />

        <button type="submit" className="btn btn-primary mt-2" disabled={isSubmitting}>
          {action === "edit"
            ? isSubmitting
              ? "Saving..."
              : "Save Changes"
            : isSubmitting
            ? "Adding..."
            : "Add Budget"}
        </button>
      </form>
    </FormProvider>
  );
};

export default AddEditBudget;
