"use client";
import { ThemeOption } from "@/database/loaders/loadOptions";
import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
type Option = { id: string; label: string };

type MobileSelectMenuProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  title: string;
  options: Option[] | ThemeOption[];
  onClose?: () => void;
  className?: string;
};
const MobileSelectMenu = <TFieldValues extends FieldValues>({
  control,
  name,
  title,
  options,
  onClose,
  className,
}: MobileSelectMenuProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div
          className={
            className ??
            "flex flex-col overflow-hidden bg-white rounded-lg overflow-y-auto max-h-[300px]"
          }
        >
          <label className="px-5 py-3 text-preset-4 text-grey-500 border-b border-grey-100">
            {title}
          </label>

          {options.map((option) => {
            const active = field.value === option.id;
            return (
              <button
                type="button"
                key={option.id}
                className={`px-5 text-left text-preset-4 cursor-pointer w-full ${
                  active ? "bg-[#ccc] font-bold [&>p]:border-0" : "hover:bg-[#eee]"
                }`}
                onClick={() => {
                  field.onChange(option.id);
                  onClose?.();
                }}
              >
                <p className="py-3 border-b border-grey-100">{option.label}</p>
              </button>
            );
          })}
        </div>
      )}
    />
  );
};

export default MobileSelectMenu;
