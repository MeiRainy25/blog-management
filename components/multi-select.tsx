"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

export interface MultiSelectOption<T> extends Omit<
  React.ComponentProps<"button">,
  "value"
> {
  label: string;
  value: T;
}

export interface MultiSelectProps<T = any> extends Omit<
  React.ComponentProps<"div">,
  "onChange"
> {
  id?: string;
  value: T[];
  onChange: (nextValue: T[]) => void;
  options: MultiSelectOption<T>[];

  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export default function MultiSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "请选择",
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selected = React.useMemo(() => new Set(value), [value]);

  const selectedLabels = React.useMemo(
    () => options.filter((o) => selected.has(o.value)).map((o) => o.label),
    [options, selected],
  );

  const toggle = React.useCallback(
    (optValue: string, checked: boolean) => {
      if (checked) {
        if (selected.has(optValue)) return;
        onChange([...value, optValue]);
        return;
      }

      onChange(value.filter((v) => v !== optValue));
    },
    [onChange, selected, value],
  );

  return (
    <div className={cn("w-full", className)} id={id} {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-between hover:bg-white dark:hover:bg-[#111]",
              disabled && "opacity-50",
              triggerClassName,
            )}
          >
            <span
              className={cn("truncate text-muted-foreground")}
              hidden={selectedLabels.length > 0}
            >
              {placeholder}
            </span>
            <div className="flex items-center gap-1">
              {selectedLabels.map((label) => (
                <span
                  key={label}
                  className={
                    "border p-0.5 rounded-xs bg-accent text-accent-foreground"
                  }
                >
                  {label}
                </span>
              ))}
            </div>
            <ChevronDownIcon className="text-muted-foreground size-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className={cn(
            "w-(--radix-popover-trigger-width) max-w-(--radix-popover-content-available-width) p-1 gap-0.5",
            contentClassName,
          )}
          // 允许连续点击多项，不因为把焦点挪回 Trigger 而关闭
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {options.map((o) => {
            const { value, label, onClick, ...rest } = o;
            const checked = selected.has(value);

            return (
              <button
                key={value}
                type="button"
                className={cn(
                  "hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between gap-2 rounded-xs px-1.5 py-1 text-sm outline-hidden select-none",
                  (disabled || o.disabled) && "pointer-events-none opacity-50",
                  {
                    "bg-accent": checked,
                  },
                )}
                onClick={(e) => {
                  // 允许外部 option 自定义点击逻辑，但不应阻断表单事件链
                  onClick?.(e);

                  if (e.defaultPrevented) return;

                  toggle(value, !checked);
                  // 保持弹层打开以便一次勾选多个
                  setOpen(true);
                }}
                {...rest}
              >
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
    </div>
  );
}
