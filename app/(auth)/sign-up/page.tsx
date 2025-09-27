"use client";
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { reducedMotionTransition } from "@/lib/variants/variants";
import { blockEnter, blockEnterTransition } from "@/lib/variants/layout-variants";
import { SignUpSchema } from "@/lib/validation/validation-auth";
import PasswordField from "@/components/auth/PasswordField";
import InputField from "@/components/forms/InputField";
import Link from "next/link";
type FormInput = z.input<typeof SignUpSchema>;
type FormOutput = z.infer<typeof SignUpSchema>;
const SignUpPage = () => {
  const prefersReducedMotion = useReducedMotion();
  const methods = useForm<FormInput, FormOutput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<FormOutput> = async (data) => {
    try {
      // TODO: Implement sign-up logic here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={blockEnter}
      transition={prefersReducedMotion ? reducedMotionTransition : blockEnterTransition}
      className="w-full px-5 py-6 md:p-8 rounded-xl bg-white"
      // aria-busy={isSubmitting}
    >
      <h1>Sign Up</h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-8" noValidate>
          {/* Username */}
          <InputField
            name="username"
            label="Username"
            type="text"
            inputMode="text"
            autoComplete="name"
            enterKeyHint="next"
            placeholder="Enter your username"
            data-testid="username-input"
          />
          {/* Email */}
          <InputField
            name="email"
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="next"
            placeholder="Enter your email"
            data-testid="email-input"
          />
          <PasswordField
            label="Password"
            name="password"
            placeholder="Create a password"
            data-testid="input-password"
            disabled={isSubmitting}
          />
          <button
            data-testid="submit-button-register"
            type="submit"
            className="btn btn-primary mt-4"
            disabled={isSubmitting}
            aria-label="submit registration form"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </FormProvider>
      <p className="four w-full text-center mt-8  text-grey-500">
        Already have an account?{" "}
        <Link
          href="./sign-in"
          className="font-bold hover:underline hover:text-grey-900  underline-offset-2 transition duration-200 ease-in"
        >
          Login
        </Link>
      </p>
    </motion.section>
  );
};

export default SignUpPage;
