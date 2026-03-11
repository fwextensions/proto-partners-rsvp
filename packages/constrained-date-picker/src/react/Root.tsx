import React from "react";
import type { DateConstraint, GroupingStrategy } from "../core/types.js";
import { useDatePicker } from "./use-date-picker.js";
import { DatePickerContext } from "./context.js";
import { Slot } from "./Slot.js";

export interface RootProps {
  /** The constraint defining available dates. */
  constraint: DateConstraint;
  /** Initial selected date (uncontrolled). */
  defaultValue?: Date;
  /** Selected date (controlled). */
  value?: Date;
  /** Callback when selection changes. */
  onValueChange?: (date: Date) => void;
  /** Grouping strategy. Defaults to groupByMonth. */
  groupBy?: GroupingStrategy;
  /** Whether the entire picker is disabled. */
  disabled?: boolean;
  /** Render as child element instead of wrapping div. */
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function Root({
  constraint,
  defaultValue,
  value,
  onValueChange,
  groupBy,
  disabled = false,
  asChild = false,
  children,
  className,
}: RootProps) {
  const picker = useDatePicker({
    constraint,
    defaultValue,
    value,
    onValueChange,
    groupBy,
    disabled,
  });

  const containerProps = picker.getContainerProps();
  const Comp = asChild ? Slot : "div";

  return (
    <DatePickerContext.Provider value={picker}>
      <Comp {...containerProps} className={className}>
        {children}
      </Comp>
    </DatePickerContext.Provider>
  );
}

Root.displayName = "DatePicker.Root";
