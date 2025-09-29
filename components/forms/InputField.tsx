"use client";

// TODO Add HINT AND SLOTS ELEMENTS
import React, { InputHTMLAttributes } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import { fadeInFadeOut, fadeInFadeOutReduced } from "@/lib/variants/variants";
type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  hint?: string;
  className?: string;
  leftSlot?: React.ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "id">;

const InputField = <T extends FieldValues>({
  name,
  label,
  hint,
  className,
  leftSlot,
  ...inputProps
}: FormInputProps<T>) => {
  const prefersReducedMotion = useReducedMotion();
  const {
    register,

    formState: { errors, isSubmitting },
  } = useFormContext<T>();
  const inputId = name.replace(/\./g, "-");
  const hasError = !!errors[name];
  const errMsg = errors[name]?.message;
  return (
    <div className={`flex flex-col gap-1 w-full ${className || ""}`}>
      <label htmlFor={inputId} className={`label-input ${hasError ? "text-s-red" : ""}`}>
        {label}
      </label>

      <div className={`input-basic flex items-center ${hasError ? "border-s-red" : ""}`}>
        {leftSlot && <div className="mr-3">{leftSlot}</div>}
        <input
          id={inputId}
          {...register(name)}
          {...inputProps}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          disabled={isSubmitting ? true : false}
        />
      </div>
      <AnimatePresence mode="wait">
        {hasError ? (
          <motion.p
            key={errors[name]?.message as string}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={prefersReducedMotion ? fadeInFadeOutReduced : fadeInFadeOut}
            id={`${inputId}-error`}
            role="alert"
            className="input-hint error"
          >
            {errMsg as string}
          </motion.p>
        ) : hint ? (
          <motion.p
            className="input-hint "
            key="hint"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={prefersReducedMotion ? fadeInFadeOutReduced : fadeInFadeOut}
          >
            {hint}
          </motion.p>
        ) : (
          <p className="input-hint error">&nbsp;</p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputField;
