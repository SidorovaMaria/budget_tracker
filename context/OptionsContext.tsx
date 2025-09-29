"use client";
import { CategoryOption, ThemeOption } from "@/database/loaders/loadOptions";
import { createContext, useContext } from "react";

type OptionsValue = { themes: ThemeOption[]; categories: CategoryOption[] };
const OptionsContext = createContext<OptionsValue>({ themes: [], categories: [] });

export function OptionsProviderClient({
  value,
  children,
}: {
  value: OptionsValue;
  children: React.ReactNode;
}) {
  return <OptionsContext.Provider value={value}>{children}</OptionsContext.Provider>;
}
export const useThemeOptions = () => useContext(OptionsContext).themes;
export const useCategoryOptions = () => useContext(OptionsContext).categories;
