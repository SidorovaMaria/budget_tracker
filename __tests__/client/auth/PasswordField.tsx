import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import PasswordField from "@/components/auth/PasswordField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, SignUpSchema } from "@/lib/validation/validation-auth";

// Sign In and General Testing
const SignInPasswordSchema = SignInSchema.pick({ password: true });
// Sign Up Testing
const SignUpPasswordSchema = SignUpSchema.pick({ password: true });

// ----- TEST WRAPPERS ----
const SignInFormWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  type FormInput = z.input<typeof SignInPasswordSchema>;
  type FormOutput = z.infer<typeof SignInPasswordSchema>;
  const methods = useForm<FormInput, FormOutput>({
    resolver: zodResolver(SignInPasswordSchema),
    defaultValues: {
      password: "",
    },
    mode: "onBlur",
  });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(() => {})}>{children}</form>
    </FormProvider>
  );
};
const SignUpFormWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  type FormInput = z.input<typeof SignUpPasswordSchema>;
  type FormOutput = z.infer<typeof SignUpPasswordSchema>;
  const methods = useForm<FormInput, FormOutput>({
    resolver: zodResolver(SignUpPasswordSchema),
    defaultValues: {
      password: "",
    },
    mode: "onBlur",
  });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(() => {})}>{children}</form>
    </FormProvider>
  );
};

/** =================================================================== */
/**                              TESTS: PASSWORD FIELD                  */
/** =================================================================== */

describe("<PasswordField /> – Sign In/General", () => {
  let user: ReturnType<typeof userEvent.setup>;
  const setup = () => {
    user = userEvent.setup();
    render(
      <SignInFormWrapper>
        <PasswordField name="password" label="Password" />
      </SignInFormWrapper>
    );
    const input = screen.getByTestId("password-input");
    return { user, input };
  };
  it("renders with label and password type", () => {
    const { input } = setup();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
    expect(screen.getByText("Password")).toBeInTheDocument(); //Label
  });
  it("toggles visibility via the button", async () => {
    const { user, input } = setup();
    // Initially hidden
    expect(input).toHaveAttribute("type", "password");

    const showBtn = screen.getByRole("button", { name: /show password/i });
    await user.click(showBtn);

    // Now visible
    expect(input).toHaveAttribute("type", "text");

    expect(await screen.findByRole("button", { name: /hide password/i })).toBeInTheDocument();
    const hideBtn = screen.getByRole("button", { name: /hide password/i });
    await user.click(hideBtn);

    // Back to hidden
    expect(input).toHaveAttribute("type", "password");
  });
  it("valid password → no error (and no aria-invalid)", async () => {
    const { user, input } = setup();
    await user.type(input, "longenough");
    await user.tab(); // Trigger blur

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Passwords must be at least 8 characters")).toBeInTheDocument(); // Hint
  });
  it("invalid password - Login", async () => {
    const { user, input } = setup();
    await user.type(input, "short");
    await user.tab(); // Trigger blur
    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent("Password must be at least 8 characters");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});

describe("<PasswordField /> – Sign Up Password Rules", () => {
  let user: ReturnType<typeof userEvent.setup>;
  const setup = () => {
    user = userEvent.setup();
    render(
      <SignUpFormWrapper>
        <PasswordField name="password" label="Password" />
      </SignUpFormWrapper>
    );
    const input = screen.getByTestId("password-input");
    return { user, input };
  };
  it("too-short -> min-length error", async () => {
    const { user, input } = setup();
    await user.type(input, "short");
    await user.tab(); // Trigger blur
    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent("Password must be at least 8 characters long");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
  it("no-uppercase -> uppercase error", async () => {
    const { user, input } = setup();
    await user.type(input, "lowercase1!");
    await user.tab(); // Trigger blur
    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent("Password must contain at least one uppercase letter");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
  it("no-lowercase -> lowercase error", async () => {
    const { user, input } = setup();
    await user.type(input, "UPPERCASE1!");
    await user.tab(); // Trigger blur
    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent("Password must contain at least one lowercase letter");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
  it("no-number -> number error", async () => {
    const { user, input } = setup();
    await user.type(input, "NoNumber!");
    await user.tab();
    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent("Password must contain at least one number");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
  it("no-special-char -> special char error", async () => {
    const { user, input } = setup();
    await user.type(input, "NoSpecial1");
    await user.tab();
    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent("Password must contain at least one special character");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
  it("valid password -> no error (and no aria-invalid)", async () => {
    const { user, input } = setup();
    await user.type(input, "ValidPassword1!");
    await user.tab(); // Trigger blur

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Passwords must be at least 8 characters")).toBeInTheDocument(); // Hint
  });
});

/** =================================================================== */
/**                              TESTS: EMAIL FIELD                  */
/** =================================================================== */
