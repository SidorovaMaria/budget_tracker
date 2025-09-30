"use client";
import { PotSchema } from "@/lib/validation/validation";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import InputField from "./InputField";
import { zodResolver } from "@hookform/resolvers/zod";

import { createPot, updatePot } from "@/database/actions/pot.action";
import { toast } from "@/components/ui/Toast";
import FormOptionsSelect from "./FormOptionsSelect";
import { useThemeOptions } from "@/context/OptionsContext";

type FormInput = z.input<typeof PotSchema>;
type FormOutput = z.infer<typeof PotSchema>;
type AddEditPotProps = {
  action?: "add" | "edit";
  potData?: PotJSON;
  onSuccess?: () => void;
  isModalOpen?: boolean;
  closeDropDown?: () => void;
  notAvailableThemes?: string[];
};
const AddEditPot = ({
  potData,
  onSuccess,
  isModalOpen,
  action = "add",
  closeDropDown,
  notAvailableThemes,
}: AddEditPotProps) => {
  const form = useForm<FormInput, FormOutput>({
    resolver: zodResolver(PotSchema),
    defaultValues: {
      name: potData?.name || "",
      target: potData?.target || undefined,
      themeId: potData?.themeId._id || "",
    },
  });
  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: FormInput) => {
    if (action === "edit") {
      const { success, error } = await updatePot(
        potData?.id as string,
        data.name,
        data.target as number,
        data.themeId
      );
      if (!success) {
        toast({
          title: "Error",
          description: error?.message || "Failed to update pot",
          theme: "error",
        });
      } else {
        toast({
          title: "Success",
          description: `Pot '${data.name}' updated successfully`,
          theme: "success",
        });
        if (onSuccess) onSuccess();
        if (closeDropDown) closeDropDown();
      }

      form.reset();
    } else {
      const { success, error } = await createPot(data.name, data.target as number, data.themeId);
      if (!success) {
        toast({
          title: "Error",
          description: error?.message || "Failed to create pot",
          theme: "error",
        });
      } else {
        toast({
          title: "Success",
          description: `Pot '${data.name}' created successfully`,
          theme: "success",
        });
        if (onSuccess) onSuccess();
        form.reset();
      }
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
        <InputField
          name="name"
          label="Pot Name"
          type="text"
          inputMode="text"
          enterKeyHint="next"
          autoComplete="off"
          placeholder="E.g. Rainy Days"
          hint={30 - watch("name")?.length + " characters left"}
        />
        <InputField
          leftSlot={<span className="text-beige-500">$</span>}
          name="target"
          label="Target"
          type="number"
          inputMode="numeric"
          autoComplete="off"
          step="1"
          enterKeyHint="next"
          placeholder="E.g. 2000"
        />
        <FormOptionsSelect
          name="themeId"
          label="Color Tag"
          useOption={useThemeOptions}
          colorTag
          notAvailable={notAvailableThemes}
          emptyOptionMsg="No themes available. Please consider deleting an existing pot to free up themes."
        />
        <button type="submit" className="btn btn-primary mt-2" disabled={isSubmitting}>
          {action === "edit"
            ? isSubmitting
              ? "Saving..."
              : "Save Changes"
            : isSubmitting
            ? "Adding..."
            : "Add Pot"}
        </button>
      </form>
    </FormProvider>
  );
};

export default AddEditPot;
