"use client";
import { createContext, useContext } from "react";

import { Option } from "@/database/loaders/loadOptions";
type OptionsValue = { themes: Option[]; categories: Option[] };
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
