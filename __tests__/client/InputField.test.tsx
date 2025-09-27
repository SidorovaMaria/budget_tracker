import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import InputField from "@/components/forms/InputField";

import userEvent from "@testing-library/user-event";
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((res) => (resolve = res));
  return { promise, resolve };
}
// Helper to wrap component with react-hook-form context
function renderWithForm<T extends Record<string, unknown>>(
  ui: React.ReactElement,
  defaultValues?: T
) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const methods = useForm<T>({
      defaultValues: defaultValues as import("react-hook-form").DefaultValues<T>,
    });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };
  return render(ui, { wrapper: Wrapper });
}

describe("InputField", () => {
  it("renders label and input", () => {
    renderWithForm(<InputField name="test" label="Test Label" />);
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  it("applies className prop", () => {
    renderWithForm(<InputField name="test" label="Test Label" className="custom-class" />);
    expect(screen.getByText("Test Label").parentElement).toHaveClass("custom-class");
  });

  it("shows error message when error exists", async () => {
    const TestForm = () => {
      const methods = useForm({ defaultValues: { test: "" }, mode: "onSubmit" });

      React.useEffect(() => {
        methods.setError("test", { type: "manual", message: "Required field" });
      }, [methods]);

      return (
        <FormProvider {...methods}>
          <InputField name="test" label="Test Label" />
        </FormProvider>
      );
    };

    render(<TestForm />);

    // Wait for the error message to appear
    expect(await screen.findByText("Required field")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("input-hint", "error");
  });

  it("disables input when isSubmitting is true", async () => {
    const TestForm = () => {
      const methods = useForm({ defaultValues: { test: "" }, mode: "onSubmit" });
      const def = React.useRef(deferred()).current;

      const onSubmit = async () => {
        // keep submitting until test resolves it
        await def.promise;
      };

      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <InputField name="test" label="Test Label" />
            <button type="submit">Submit</button>
          </form>
        </FormProvider>
      );
    };

    render(<TestForm />);
    const user = userEvent.setup();

    // trigger submit -> RHF sets isSubmitting=true
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // the input should be disabled while submitting
    await waitFor(() => expect(screen.getByLabelText("Test Label")).toBeDisabled());
  });
});
