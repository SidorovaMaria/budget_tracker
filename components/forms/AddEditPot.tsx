"use client";
import { PotSchema } from "@/lib/validation/validation";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import InputField from "./InputField";
import { zodResolver } from "@hookform/resolvers/zod";

import { createPot } from "@/database/actions/pot.action";
import { toast } from "@/components/ui/Toast";
import FormOptionsSelect from "./FormOptionsSelect";
import { useThemeOptions } from "@/context/OptionsContext";

type FormInput = z.input<typeof PotSchema>;
type FormOutput = z.infer<typeof PotSchema>;
type AddEditPotProps = {
  potData?: {
    name: string;
    target: number;
    themeId: string;
  };
  onSuccess?: () => void;
  isModalOpen?: boolean;
};
const AddEditPot = ({ potData, onSuccess, isModalOpen }: AddEditPotProps) => {
  const form = useForm<FormInput, FormOutput>({
    resolver: zodResolver(PotSchema),
    defaultValues: {
      name: potData?.name || "",
      target: potData?.target || undefined,
      themeId: potData?.themeId || "",
    },
  });
  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: FormInput) => {
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
        <FormOptionsSelect name="themeId" label="Color Tag" useOption={useThemeOptions} colorTag />
        <button type="submit" className="btn btn-primary mt-2" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Pot"}
        </button>
      </form>
    </FormProvider>
  );
};

export default AddEditPot;
