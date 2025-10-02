import { CategoryOption, ThemeOption } from "@/database/loaders/loadOptions";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { fadeInFadeOutReduced } from "@/lib/variants/variants";
import React from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import Select from "../ui/Select";
type UseOptions<T> = () => T[];
type Options = ThemeOption | CategoryOption;
type FormOptionsSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  useOption: UseOptions<Options>;
  colorTag?: boolean;
  notAvailable?: string[];
  emptyOptionMsg?: string;
  extraOption?: Options;
};
const FormOptionsSelect = <T extends FieldValues>({
  name,
  label,
  useOption,
  colorTag,
  notAvailable,
  emptyOptionMsg,
  extraOption,
}: FormOptionsSelectProps<T>) => {
  const prefersReducedMotion = useReducedMotion();
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  let options = useOption(); // ThemeOption[]
  if (notAvailable && notAvailable.length > 0) {
    options = options.filter((option) => !notAvailable.includes(option.id));
  }
  if (extraOption) {
    options = [extraOption, ...options];
  }

  const hasError = !!errors[name];
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className={`label-input ${hasError ? "text-s-red" : ""}`}>{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={(field.value as string) ?? ""} // <-- value is a string id
            options={options}
            colorTag={colorTag ? true : false}
            emptyOptionMsg={emptyOptionMsg}
            onValueChange={field.onChange} // <-- emits id string
          />
        )}
      />
      <AnimatePresence mode="wait">
        {hasError && (
          <motion.p
            key={errors[name]?.message as string}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={prefersReducedMotion ? fadeInFadeOutReduced : fadeInFadeOutReduced}
            role="alert"
            className="input-hint error"
          >
            {errors[name]?.message as string}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormOptionsSelect;
