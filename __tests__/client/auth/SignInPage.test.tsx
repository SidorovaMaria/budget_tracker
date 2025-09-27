import SignInPage from "@/app/(auth)/sign-in/page";
import { SignInSchema } from "@/lib/validation/validation-auth";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";
import { Sign } from "crypto";
function zodEmailError(email: string, password?: "StrongPassw0rd!") {
  const result = SignInSchema.safeParse({ email, password });
  if (result.success) return undefined;
  const tree = z.treeifyError(result.error);
  return tree.properties?.email?.errors[0];
}

describe("<SignInPage /> - functionality", () => {
  it("renders email field with correct attributes and no error initially", () => {
    render(<SignInPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const emailLabel = screen.getByText("Email");
    expect(emailLabel).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("id", "email");
    expect(emailInput).toHaveAttribute("inputmode", "email");
    expect(emailInput).toHaveAttribute("autocomplete", "email");
    expect(emailInput).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBe(emailInput);
  });
  it("invalid email shows schema error and a11y wiring on blur", async () => {
    const user = userEvent.setup();
    render(<SignInPage />);
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalid-email");
    await user.tab(); // mode: onBlur -> trigger validation

    const expected = zodEmailError("invalid-email") ?? /invalid/i;

    const error = await screen.findByRole("alert");
    expect(error).toHaveAttribute("id", "email-error");
    if (typeof expected === "string") {
      expect(error).toHaveTextContent(expected);
    } else {
      expect(error).toBeInTheDocument();
    }
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    expect(emailInput).toHaveAttribute("aria-describedby", "email-error");
  });
  it("fixing email clears error and aria flags", async () => {
    const user = userEvent.setup();
    render(<SignInPage />);
    const emailInput = screen.getByLabelText(/email/i);
    // make it invalid first
    await user.type(emailInput, "invalid");
    await user.tab();
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    // now fix it
    await user.clear(emailInput);
    await user.type(emailInput, "johnDoe@gmail.com");
    await user.tab();
    await waitFor(() => {
      expect(screen.queryByRole("alert", { name: /email/i })).not.toBeInTheDocument();
    });
    expect(emailInput).not.toHaveAttribute("aria-invalid", "true");
    expect(emailInput.getAttribute("aria-describedby")).toBeNull();
  });
  it('renders submit button "Login"', () => {
    render(<SignInPage />);
    const submitButton = screen.getByRole("button", { name: /login/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
    expect(submitButton).not.toBeDisabled();
  });
  it("does not submit when email is invalid", async () => {
    const user = userEvent.setup();
    render(<SignInPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    const expected = zodEmailError("invalid-email") ?? /invalid/i;
    const error = await screen.findByRole("alert");
    if (typeof expected === "string") {
      expect(error).toHaveTextContent(expected);
    } else {
      expect(error).toBeInTheDocument();
    }

    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    expect(submitButton).not.toBeDisabled(); // submit blocked by resolver
  });
  it("submits when email and password are valid, shows loading state", async () => {
    const user = userEvent.setup();
    render(<SignInPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await user.type(emailInput, "johnDoe@gmail.com");
    await user.type(passwordInput, "Password123!");
    await user.click(submitButton);
    await waitFor(() => expect(submitButton).toBeDisabled());
    expect(submitButton).toHaveTextContent(/logging in/i);
  });
});
