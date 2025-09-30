"use client";
import { Dialog } from "radix-ui";
import React from "react";
import IconCloseModal from "../icons/IconCloseModal";
type ModalProps = {
  children: React.ReactNode;
  modalContent: React.ReactElement<{
    onSuccess?: () => void;
    isModalOpen?: boolean;
  }>;
  description: string;
  title: string;
};
const Modal = ({ children, modalContent, title, description }: ModalProps) => {
  const [open, setOpen] = React.useState(false);

  // Close helper we’ll pass down
  const close = React.useCallback(() => setOpen(false), []);

  // Inject onSuccess into the provided content
  const contentWithClose = React.cloneElement(modalContent, {
    onSuccess: close,
    isModalOpen: open,
  });
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-fade-in [state=closed]:animate-fade-out" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-50 flex flex-col gap-5  translate-x-[-50%] translate-y-[-50%] bg-white w-full max-w-xs sm:max-w-sm md:max-w-xl
        px-5 py-6 rounded-xl shadow-xl shadow-grey-500
        data-[state=open]:animate-modal-in data-[state=closed]:animate-modal-out"
        >
          <div className="flex-row-between">
            <Dialog.Title className="text-xl md:text-[32px] leading-120 font-bold  ">
              {title}
            </Dialog.Title>
            <Dialog.Close className="text-grey-500 hover:text-s-red cursor-pointer hover:scale-105 transition-300">
              <IconCloseModal className="size-6 " />
            </Dialog.Close>
          </div>

          <Dialog.Description className="four text-grey-500">{description}</Dialog.Description>
          {contentWithClose}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
