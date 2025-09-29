"use client";

import React from "react";
import { toast as sonnerToast } from "sonner";
import { CheckCircledIcon, CrossCircledIcon, InfoCircledIcon } from "@radix-ui/react-icons";

type ToastType = "default" | "success" | "error" | "info";
/** I recommend abstracting the toast function
 *  so that you can call it without having to use toast.custom everytime. */
interface ToastProps {
  id: string | number;
  theme?: ToastType;
  title: string;
  description?: string;
  icon?: boolean;
}
export function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      title={toast.title}
      description={toast.description}
      theme={toast.theme || "default"}
      icon={toast.icon || true}
    />
  ));
}

/** A fully custom toast that still maintains the animations and interactions. */
function Toast(props: ToastProps) {
  const { title, description, theme, id, icon } = props;
  const Icon = theme ? ThemeIcon[theme] : null;
  console.log(Icon);
  return (
    <div
      className="flex rounded-xl sw-full md:min-w-xs items-center p-4 border-2  shadow-lg to-40% bg-gradient-to-br backdrop-blur-md  gap-2 group
    bg-grey-500/80
      data-[theme=success]:bg-s-green/90  data-[theme=success]:border-green-900
      data-[theme=error]:bg-s-red/90 data-[theme=error]:border-red-900
      data-[theme=info]:bg-o-blue/90 data-[theme=info]:border-blue-900"
      data-theme={theme}
      key={id}
    >
      {Icon && icon && <Icon className="w-6 h-6 text-white" />}
      <div className="flex flex-1 flex-col w-full items-start text-white font-bold ">
        <p className="text-base leading-150 font-bold">{title}</p>
        <p className="text-sm leading-150 font-normal">{description}</p>
      </div>
    </div>
  );
}

const ThemeIcon = {
  success: CheckCircledIcon,
  error: CrossCircledIcon,
  default: null,
  info: InfoCircledIcon,
};
