"use client";
import { BudgetSchema } from "@/lib/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import InputField from "./InputField";
import ThemeSelect from "./ThemeSelect";
import Category from "@/database/models/category.model";
import CategorySelect from "./CategorySelect";
import { createBudget } from "@/database/actions/budget.action";
import { toast } from "../ui/Toast";
import FormOptionsSelect from "./FormOptionsSelect";
import { useCategoryOptions, useThemeOptions } from "@/context/OptionsContext";
type AddEditBudgetProps = {
  budgetData?: {
    categoryId: string;
    maximum: number;
    themeId: string;
  };
  onSuccess?: () => void;
  isModalOpen?: boolean;
};
type FormInput = z.input<typeof BudgetSchema>;
type FormOutput = z.infer<typeof BudgetSchema>;
const AddEditBudget = ({ budgetData, onSuccess, isModalOpen }: AddEditBudgetProps) => {
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
  const onSubmit = async (data: FormInput) => {
    console.log("Submitting budget data:", data);
    const { success, error } = await createBudget({
      categoryId: data.categoryId,
      maximum: data.maximum as number,
      themeId: data.themeId,
    });
    if (!success) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create budget",
        theme: "error",
      });
    } else {
      toast({
        title: "Success",
        description: `Budget for '${data.categoryId}' created successfully`,
        theme: "success",
      });
      if (onSuccess) onSuccess();
      form.reset();
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
        <FormOptionsSelect name="categoryId" label="Category" useOption={useCategoryOptions} />
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

        <FormOptionsSelect name="themeId" label="Theme" useOption={useThemeOptions} colorTag />
        <button type="submit" className="btn btn-primary mt-2" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Budget"}
        </button>
      </form>
    </FormProvider>
  );
};

export default AddEditBudget;
