import React from "react";
import type { DateConstraint, DateEntry, GroupingStrategy } from "../../core/types.js";
import { useDatePicker } from "../use-date-picker.js";
import { keyToNavAction } from "../../core/navigation.js";

export interface CompactPickerProps {
  /** The constraint defining available dates. */
  constraint: DateConstraint;
  /** Initial selected date (uncontrolled). */
  defaultValue?: Date;
  /** Selected date (controlled). */
  value?: Date;
  /** Callback when selection changes. */
  onValueChange?: (date: Date) => void;
  /** Grouping strategy. */
  groupBy?: GroupingStrategy;
  /** Whether the picker is disabled. */
  disabled?: boolean;
  /** CSS class for the outer container. */
  className?: string;
  /** Format a date into its display label. Defaults to full year for year constraints. */
  formatLabel?: (date: Date) => string;
  /** Custom renderer for each pill/chip. */
  renderItem?: (
    entry: DateEntry,
    state: { selected: boolean; disabled: boolean; label: string },
  ) => React.ReactNode;
}

function defaultFormat(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

/**
 * Compact pill/chip selector for sparse date sets (months, years).
 * Wrapping layout that works well with small numbers of options.
 */
export function CompactPicker({
  constraint,
  defaultValue,
  value,
  onValueChange,
  groupBy,
  disabled = false,
  className,
  formatLabel = defaultFormat,
  renderItem,
}: CompactPickerProps) {
  const picker = useDatePicker({
    constraint,
    defaultValue,
    value,
    onValueChange,
    groupBy,
    disabled,
  });

  const onKeyDown = (e: React.KeyboardEvent) => {
    const action = keyToNavAction(e.key);
    if (action) {
      e.preventDefault();
      picker.navigate(action);
    }
  };

  return (
    <div
      className={`cdp-compact ${className ?? ""}`}
      role="listbox"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={onKeyDown}
    >
      {picker.flatEntries.map((entry, idx) => {
        const isSelected = idx === picker.selectedIndex;
        const label = formatLabel(entry.date);

        if (renderItem) {
          return (
            <div
              key={entry.date.toISOString()}
              role="option"
              aria-selected={isSelected}
              aria-disabled={entry.disabled || !entry.selectable || undefined}
              className={`cdp-compact-item ${isSelected ? "cdp-compact-item--selected" : ""}`}
              onClick={entry.selectable && !disabled ? () => picker.selectIndex(idx) : undefined}
            >
              {renderItem(entry, { selected: isSelected, disabled: entry.disabled, label })}
            </div>
          );
        }

        return (
          <div
            key={entry.date.toISOString()}
            role="option"
            aria-selected={isSelected}
            aria-disabled={entry.disabled || !entry.selectable || undefined}
            className={[
              "cdp-compact-item",
              isSelected ? "cdp-compact-item--selected" : "",
              entry.disabled || !entry.selectable ? "cdp-compact-item--disabled" : "",
            ].filter(Boolean).join(" ")}
            onClick={entry.selectable && !disabled ? () => picker.selectIndex(idx) : undefined}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

CompactPicker.displayName = "CompactPicker";
