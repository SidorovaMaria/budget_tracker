import { OptionsProviderClient } from "@/context/OptionsContext";
import { loadCategoryOptions, loadThemeOptions } from "@/database/loaders/loadOptions";

export default async function OptionsProvider({ children }: { children: React.ReactNode }) {
  const [themes, categories] = await Promise.all([loadThemeOptions(), loadCategoryOptions()]);

  return <OptionsProviderClient value={{ themes, categories }}>{children}</OptionsProviderClient>;
}
