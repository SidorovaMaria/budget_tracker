"use client";
import { SignInSchema } from "@/lib/validation/validation-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { z } from "zod";
import { reducedMotionTransition } from "@/lib/variants/variants";
import { blockEnter, blockEnterTransition } from "@/lib/variants/layout-variants";

import PasswordField from "@/components/auth/PasswordField";
import InputField from "@/components/forms/InputField";
import Link from "next/link";
import GoogleProvider from "@/components/forms/GoogleProvider";

// import GoogleOAuthForm from "@/components/forms/GoogleOAuthForm";
type FormInput = z.input<typeof SignInSchema>;
type FormOutput = z.infer<typeof SignInSchema>;

const SignInPage = () => {
  const prefersReducedMotion = useReducedMotion();
  const methods = useForm<FormInput, FormOutput>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // TODO: Implement login logic here logic here
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
      aria-busy={isSubmitting}
    >
      <h1>Login</h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-8" noValidate>
          {/* Email */}
          <InputField
            name="email"
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="next"
            placeholder="Enter your email"
            disabled={isSubmitting}
          />
          {/* Password */}
          <PasswordField
            label="Password"
            name="password"
            placeholder="Enter your password"
            disabled={isSubmitting}
          />
          <button
            data-testid="submit-button-login"
            type="submit"
            className="btn btn-primary mt-4"
            disabled={isSubmitting}
            aria-label="submit login form"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </FormProvider>
      <GoogleProvider />
      <p className="four w-full text-center mt-8  text-grey-500">
        Need to create an account?{" "}
        <Link
          href="./sign-up"
          className="font-bold hover:underline hover:text-grey-900  underline-offset-2 transition duration-200 ease-in"
        >
          Sign up
        </Link>
      </p>
    </motion.section>
  );
};

export default SignInPage;
