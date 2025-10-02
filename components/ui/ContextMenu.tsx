import React from "react";
import { ContextMenu as ContextR } from "radix-ui";
type ContextMenuProps = {
  children: React.ReactNode;
  context: React.ReactNode;
};
const ContextMenu = ({ children, context }: ContextMenuProps) => {
  return (
    <ContextR.Root>
      <ContextR.Trigger
        asChild
        className="  data-[state=open]:scale-[1.01] data-[state=open]:drop-shadow-xs"
      >
        {children}
      </ContextR.Trigger>
      <ContextR.Portal>
        <ContextR.Content className="min-w-[180px] overflow-hidden rounded-md bg-white  drop-shadow-xs z-50 cursor-pointer">
          {context}
        </ContextR.Content>
      </ContextR.Portal>
    </ContextR.Root>
  );
};

export default ContextMenu;
