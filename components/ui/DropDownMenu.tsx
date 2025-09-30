"use client";
import { DropdownMenu, DropdownMenu as DropDownRadix } from "radix-ui";
import React from "react";
type DropDownMenuProps = {
  context: React.ReactElement<{ onClose?: () => void }>;
  trigger: React.ReactNode;
};
const DropDownMenu = ({ trigger, context }: DropDownMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  const contentWithClose = React.cloneElement(context, {
    onClose: close,
  });

  return (
    <DropDownRadix.Root open={open} onOpenChange={setOpen}>
      <DropDownRadix.Trigger className="no-ring ">{trigger}</DropDownRadix.Trigger>
      <DropDownRadix.Portal>
        <DropDownRadix.Content
          className="z-50 min-w-[120px] bg-white rounded-md drop-shadow data-[state=open]:animate-dropdown-in data-[state=closed]:animate-dropdown-out flex flex-col "
          align="end"
          sideOffset={5}
        >
          {contentWithClose}
        </DropDownRadix.Content>
      </DropDownRadix.Portal>
    </DropDownRadix.Root>
  );
};

export default DropDownMenu;
