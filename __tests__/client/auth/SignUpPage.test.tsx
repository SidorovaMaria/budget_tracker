import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUpPage from "@/app/(auth)/sign-up/page";

describe("SignUpPage", () => {
  it("renders the sign up form", () => {
    render(<SignUpPage />);
    expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button-register")).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /login/i })).toHaveAttribute("href", "./sign-in");
  });

  it("disables submit button while submitting", async () => {
    render(<SignUpPage />);
    const submitButton = screen.getByTestId("submit-button-register");
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/creating account/i);
    });
  });

  it("submits the form with valid data", async () => {
    render(<SignUpPage />);
    fireEvent.change(screen.getByTestId("username-input"), { target: { value: "testuser" } });
    fireEvent.change(screen.getByTestId("email-input"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: "Password123!" } });

    const submitButton = screen.getByTestId("submit-button-register");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/creating account/i);
    });
  });
});
