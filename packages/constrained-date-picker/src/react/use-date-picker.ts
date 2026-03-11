import { useState, useMemo, useCallback } from "react";
import type { DateConstraint, DateEntry, DateGroup, GroupingStrategy, NavAction } from "../core/types.js";
import { generateEntries, groupByMonth } from "../core/date-set.js";
import { navigate as coreNavigate, keyToNavAction } from "../core/navigation.js";
import { isSameDay } from "../core/date-utils.js";

export interface UseDatePickerOptions {
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
}

export interface UseDatePickerReturn {
  groups: DateGroup[];
  flatEntries: DateEntry[];
  selectedDate: Date | null;
  selectedIndex: number;
  select: (date: Date) => void;
  selectIndex: (index: number) => void;
  navigate: (action: NavAction) => void;
  disabled: boolean;
  getContainerProps: () => Record<string, unknown>;
  getItemProps: (entry: DateEntry, index: number) => Record<string, unknown>;
  getGroupProps: (group: DateGroup) => Record<string, unknown>;
  getGroupLabelProps: (group: DateGroup) => Record<string, unknown>;
}

export function useDatePicker(options: UseDatePickerOptions): UseDatePickerReturn {
  const {
    constraint,
    defaultValue,
    value,
    onValueChange,
    groupBy = groupByMonth,
    disabled = false,
  } = options;

  const flatEntries = useMemo(() => generateEntries(constraint), [constraint]);
  const groups = useMemo(() => groupBy(flatEntries), [flatEntries, groupBy]);

  // Find initial index from defaultValue
  const initialIndex = useMemo(() => {
    const target = value ?? defaultValue;
    if (!target) return -1;
    return flatEntries.findIndex((e) => e.selectable && isSameDay(e.date, target));
  }, []); // Only compute once

  const [internalIndex, setInternalIndex] = useState(initialIndex);

  // For controlled mode, derive index from value prop
  const selectedIndex = useMemo(() => {
    if (value !== undefined) {
      return flatEntries.findIndex((e) => e.selectable && isSameDay(e.date, value));
    }
    return internalIndex;
  }, [value, flatEntries, internalIndex]);

  const selectedDate = selectedIndex >= 0 ? flatEntries[selectedIndex]?.date ?? null : null;

  const select = useCallback(
    (date: Date) => {
      if (disabled) return;
      const idx = flatEntries.findIndex((e) => e.selectable && isSameDay(e.date, date));
      if (idx === -1) return;
      setInternalIndex(idx);
      onValueChange?.(flatEntries[idx].date);
    },
    [flatEntries, disabled, onValueChange],
  );

  const selectIndex = useCallback(
    (index: number) => {
      if (disabled) return;
      const entry = flatEntries[index];
      if (!entry?.selectable) return;
      setInternalIndex(index);
      onValueChange?.(entry.date);
    },
    [flatEntries, disabled, onValueChange],
  );

  const navigate = useCallback(
    (action: NavAction) => {
      if (disabled) return;
      const newIndex = coreNavigate(flatEntries, selectedIndex, action);
      if (newIndex !== -1 && newIndex !== selectedIndex) {
        setInternalIndex(newIndex);
        onValueChange?.(flatEntries[newIndex].date);
      }
    },
    [flatEntries, selectedIndex, disabled, onValueChange],
  );

  const getContainerProps = useCallback(
    (): Record<string, unknown> => ({
      role: "listbox",
      tabIndex: disabled ? -1 : 0,
      "aria-disabled": disabled || undefined,
      onKeyDown: (e: KeyboardEvent) => {
        const action = keyToNavAction(e.key);
        if (action) {
          e.preventDefault();
          navigate(action);
        }
      },
    }),
    [disabled, navigate],
  );

  const getItemProps = useCallback(
    (entry: DateEntry, index: number): Record<string, unknown> => {
      const isSelected = index === selectedIndex;
      return {
        role: "option",
        "aria-selected": isSelected,
        "aria-disabled": entry.disabled || !entry.selectable || undefined,
        tabIndex: -1,
        onClick: entry.selectable && !disabled
          ? () => selectIndex(index)
          : undefined,
      };
    },
    [selectedIndex, disabled, selectIndex],
  );

  const getGroupProps = useCallback(
    (group: DateGroup): Record<string, unknown> => ({
      role: "group",
      "aria-labelledby": `cdp-group-${group.key}`,
    }),
    [],
  );

  const getGroupLabelProps = useCallback(
    (group: DateGroup): Record<string, unknown> => ({
      role: "separator",
      id: `cdp-group-${group.key}`,
      "aria-hidden": true,
    }),
    [],
  );

  return {
    groups,
    flatEntries,
    selectedDate,
    selectedIndex,
    select,
    selectIndex,
    navigate,
    disabled,
    getContainerProps,
    getItemProps,
    getGroupProps,
    getGroupLabelProps,
  };
}
