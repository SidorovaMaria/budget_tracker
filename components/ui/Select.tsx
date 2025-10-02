"use client";
import * as React from "react";
import * as RadixSelect from "@radix-ui/react-select";
import IconCaretDown from "../icons/IconCaretDown";
import type { ThemeOption, CategoryOption } from "@/database/loaders/loadOptions";
import { CheckIcon } from "@radix-ui/react-icons";

type Option = ThemeOption | CategoryOption;

type SelectProps = {
  value: string; // selected option id
  options: Option[]; // keep this ref stable via a memoized provider
  colorTag?: boolean;
  placeholder?: string;
  emptyOptionMsg?: string;
  onValueChange: (id: string) => void; // this ref may change: we’ll ignore it in memo compare
};

function SelectImpl({
  value,
  options,
  colorTag,
  onValueChange,
  placeholder,
  emptyOptionMsg,
}: SelectProps) {
  const optionMap = React.useMemo(() => {
    const m = new Map<string, Option>();
    for (const o of options) m.set(o.id, o);
    return m;
  }, [options]);

  const selected = optionMap.get(value);
  if (!options || options.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">{emptyOptionMsg ?? "No options available"}</div>
    );
  }

  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange}>
      <RadixSelect.Trigger className="flex flex-col gap-1 w-full group">
        <div className="input-basic flex items-center mr-3 whitespace-nowrap">
          {colorTag && selected && "value" in selected && selected.value && (
            <span
              className="size-4 rounded-full mr-3"
              style={{ backgroundColor: selected.value }}
            />
          )}

          {selected ? selected.label : placeholder ?? "Select..."}

          <RadixSelect.Icon className="ml-auto  group-data-[state=open]:rotate-180 transition-300">
            <IconCaretDown />
          </RadixSelect.Icon>
        </div>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          side="bottom"
          avoidCollisions={false}
          className="relative z-50 overflow-y-auto overflow-x-hidden rounded-lg bg-popover text-popover-foreground data-[state=open]:animate-dropdown-in data-[state=closed]:animate-dropdown-out origin-[var(--radix-select-content-transform-origin)] max-h-[300px] translate-y-1 drop-shadow"
        >
          <RadixSelect.Viewport className="max-h-[200px] w-full min-w-[var(--radix-select-trigger-width)] rounded-lg bg-white">
            {options.map((option) => {
              const isSelected = selected?.id === option.id;
              return (
                <RadixSelect.Item
                  key={option.id}
                  value={option.id}
                  className="px-5 py-3 flex items-center border-b  last:border-b-0 cursor-pointer hover:bg-grey-100 outline-none border-grey-100"
                  style={{
                    // subtle tint for selected row
                    backgroundColor:
                      colorTag && "value" in option && option.value
                        ? isSelected
                          ? `${option.value}66` // ~40% alpha
                          : "transparent"
                        : isSelected
                        ? "#ccc"
                        : "transparent",
                  }}
                >
                  {colorTag && "value" in option && option.value && (
                    <span
                      className="size-4 rounded-full mr-3 shrink-0"
                      style={{ backgroundColor: option.value }}
                    />
                  )}
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="ml-auto">
                    <CheckIcon className="size-6" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              );
            })}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

// Custom comparator: ignore function identity, compare cheap, referentially
const areEqual = (prev: SelectProps, next: SelectProps) =>
  prev.value === next.value &&
  prev.options === next.options && // relies on stable ref from provider
  prev.colorTag === next.colorTag &&
  prev.placeholder === next.placeholder;
// NOTE: intentionally not comparing onValueChange

const Select = React.memo(SelectImpl, areEqual);
export default Select;
