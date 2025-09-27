"use client";

import { fadeInFadeOut, fadeInFadeOutReduced } from "@/lib/variants/variants";
import { AnimatePresence, useReducedMotion, motion } from "motion/react";
import React from "react";
import { useFormContext } from "react-hook-form";
import IconHidePassword from "../icons/IconHidePassword";
import IconShowPassword from "../icons/IconShowPassword";
type Props = {
  label: string;
  name: "password";
  placeholder?: string;
  disabled?: boolean;
};
const PasswordField: React.FC<Props> = ({ label, name, placeholder, disabled }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const prefersReducedMotion = useReducedMotion();
  const [show, setShow] = React.useState(false);
  const toggle = React.useCallback(() => {
    setShow((prev) => !prev);
  }, []);
  const hasError = Boolean(errors[name]);
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor="password" className={`label-auth ${hasError ? "text-s-red" : ""}`}>
        {label}
      </label>
      <div className={`input-basic flex items-center ${errors.password ? "border-s-red" : ""}`}>
        <input
          data-testid="password-input"
          id="password"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          enterKeyHint="done"
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? "password-error" : undefined}
          placeholder={placeholder || "Enter your password"}
          disabled={disabled}
          {...register(name)}
        />
        <AnimatePresence mode="wait" initial={false}>
          {show ? (
            <motion.button
              key="hide"
              type="button"
              onClick={toggle}
              aria-label="Hide password"
              initial="hidden"
              animate="visible"
              exit="exit"
              className="cursor-pointer group"
              variants={prefersReducedMotion ? fadeInFadeOutReduced : fadeInFadeOut}
            >
              <IconHidePassword className="text-[#252633] group-hover:text-grey-900" />
            </motion.button>
          ) : (
            <motion.button
              key="show"
              type="button"
              onClick={toggle}
              className="cursor-pointer group"
              aria-label="Show password"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={prefersReducedMotion ? fadeInFadeOutReduced : fadeInFadeOut}
            >
              {/* When hidden, we show the 'show' icon */}
              <IconShowPassword className="text-[#252633] group-hover:text-grey-900" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {hasError ? (
          <motion.p
            key={errors[name]?.message as string}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={prefersReducedMotion ? fadeInFadeOutReduced : fadeInFadeOut}
            id="password-error"
            role="alert"
            className="input-hint error"
          >
            {(errors[name]?.message as string) ?? "Invalid value"}
          </motion.p>
        ) : (
          <motion.p
            role="complementary"
            key="hint"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={prefersReducedMotion ? fadeInFadeOutReduced : fadeInFadeOut}
            id="password-error"
            className="input-hint"
          >
            Passwords must be at least 8 characters
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PasswordField;
