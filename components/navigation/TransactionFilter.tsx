"use client";
import { SORT_OPTIONS } from "@/constants";
import { searchParamsSchema } from "@/lib/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { startTransition, useEffect } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import InputField from "../forms/InputField";
import IconSearch from "../icons/IconSearch";
import DropDownMenu from "../ui/DropDownMenu";
import IconSortMobile from "../icons/IconSortMobile";
import IconFilterMobile from "../icons/IconFilterMobile";
import Select from "../ui/Select";
import FormOptionsSelect from "../forms/FormOptionsSelect";
import { useCategoryOptions } from "@/context/OptionsContext";

import MobileSelectMenu from "../forms/MobileSelectMenu";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import useDebounce from "@/hooks/useDebounce";

const allCategoryOption = { id: "all", label: "All", value: "all" };
type FormInput = z.input<typeof searchParamsSchema>;
type FormOutput = z.output<typeof searchParamsSchema>;

const TransactionFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<FormInput, FormOutput>({
    resolver: zodResolver(searchParamsSchema),
    defaultValues: {
      search: searchParams.get("search") ?? "",
      sort: searchParams.get("sort") ?? "latest",
      filter: (searchParams.get("filter") as string) ?? "all",
    },
  });
  const { control } = form;

  const sort = useWatch({ control, name: "sort" });
  const filter = useWatch({ control, name: "filter" });
  const search = useWatch({ control, name: "search" });

  const debouncedSearch = useDebounce(search, 500);

  const rawOptions = useCategoryOptions();
  const CATEGORY_OPTIONS = React.useMemo(() => [allCategoryOption, ...rawOptions], [rawOptions]);

  useEffect(() => {
    const parsed = searchParamsSchema.safeParse({ sort, filter, search: "" });
    if (!parsed.success) return;
    const query = new URLSearchParams(window.location.search);
    if (parsed.data.sort && parsed.data.sort !== "latest") {
      query.set("sort", parsed.data.sort);
      query.set("page", "1"); // Reset to first page on sort change
    } else query.delete("sort");
    if (parsed.data.filter && parsed.data.filter !== "all") {
      query.set("filter", parsed.data.filter);
      query.set("page", "1"); // Reset to first page on filter change
    } else query.delete("filter");
    const qs = query.toString();

    startTransition(() => {
      router.replace(ROUTES.TRANSACTIONS + (qs ? `?${qs}` : ""));
    });
  }, [sort, filter, router]);
  // Effect 2: update URL when the (debounced) search value changes
  useEffect(() => {
    const trimmed = (debouncedSearch ?? "").trim();
    const query = new URLSearchParams(window.location.search);
    if (trimmed) {
      query.set("search", trimmed);
      query.set("page", "1"); // Reset to first page on search change
    } else query.delete("search");
    const qs = query.toString();
    startTransition(() => {
      router.replace(ROUTES.TRANSACTIONS + (qs ? `?${qs}` : ""));
    });
  }, [debouncedSearch, router]);
  //Reset form values if URL params are cleared
  useEffect(() => {
    if (!searchParams.get("search") && search) form.setValue("search", "");
    if (!searchParams.get("sort") && sort !== "latest") form.setValue("sort", "latest");
    if (!searchParams.get("filter") && filter !== "all") form.setValue("filter", "all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <FormProvider {...form}>
      <form className="flex flex-row items-center gap-6 lg:justify-between">
        <InputField
          rightSlot={<IconSearch />}
          name="search"
          label=""
          type="text"
          autoComplete="off"
          placeholder="Search transactions..."
          className="w-full max-w-[320px]"
        />
        {/* Tablet & Desktop */}
        <div className="gap-6 items-center hidden md:flex w-full ml-auto">
          <div className="flex items-center gap-2 w-full">
            <label className="whitespace-nowrap text-preset-4 text-grey-500" htmlFor="sort">
              Sort by:
            </label>
            <Controller
              control={control}
              name="sort"
              render={({ field }) => (
                <Select
                  value={field.value as string}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  options={SORT_OPTIONS as any} // already {id,label}
                  placeholder="Sort by"
                  onValueChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="flex items-center gap-2 w-full">
            <label className="whitespace-nowrap text-preset-4 text-grey-500" htmlFor="filter">
              Filter:
            </label>
            <FormOptionsSelect
              name="filter"
              label=""
              useOption={useCategoryOptions}
              extraOption={allCategoryOption}
            />
          </div>
        </div>
        {/* Mobile */}
        <div className="gap-6 items-center flex md:hidden ml-auto">
          <DropDownMenu
            trigger={
              <IconSortMobile className="text-grey-900 cursor-pointer hover:scale-110 transition-300" />
            }
            context={
              <MobileSelectMenu
                control={control}
                name="sort"
                title="Sort by"
                options={SORT_OPTIONS}
              />
            }
          />
          <DropDownMenu
            trigger={
              <IconFilterMobile className="text-grey-900 cursor-pointer hover:scale-110 transition-300" />
            }
            context={
              <MobileSelectMenu
                control={control}
                name="filter"
                title="Category"
                options={CATEGORY_OPTIONS}
              />
            }
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default TransactionFilter;
