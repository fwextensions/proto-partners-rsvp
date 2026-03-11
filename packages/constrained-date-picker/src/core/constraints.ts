import type { DateConstraint } from "./types.js";
import { addDays, addMonths, addYears, isSameDay, startOfDay } from "./date-utils.js";

/**
 * Next `count` calendar days starting from today.
 * Today is included but marked as disabled (visible, not selectable).
 */
export function daysFromToday(count: number): DateConstraint {
  const today = startOfDay(new Date());
  return {
    dates() {
      const arr: Date[] = [];
      for (let i = 0; i <= count; i++) {
        arr.push(addDays(today, i));
      }
      return arr;
    },
    isSelectable(date: Date) {
      return !isSameDay(date, today);
    },
    isDisabled(date: Date) {
      return isSameDay(date, today);
    },
  };
}

/** All days between `start` and `end` (inclusive). */
export function dateRange(start: Date, end: Date): DateConstraint {
  const s = startOfDay(start);
  const e = startOfDay(end);
  return {
    dates() {
      const arr: Date[] = [];
      const current = new Date(s);
      while (current <= e) {
        arr.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return arr;
    },
    isSelectable() {
      return true;
    },
    isDisabled() {
      return false;
    },
  };
}

/** First of each month for the next `count` months. */
export function monthsFromToday(count: number): DateConstraint {
  const today = startOfDay(new Date());
  return {
    dates() {
      const arr: Date[] = [];
      for (let i = 0; i < count; i++) {
        const d = addMonths(today, i);
        arr.push(new Date(d.getFullYear(), d.getMonth(), 1));
      }
      return arr;
    },
    isSelectable() {
      return true;
    },
    isDisabled() {
      return false;
    },
  };
}

/** Jan 1 of each year for the next `count` years. */
export function yearsFromToday(count: number): DateConstraint {
  const today = startOfDay(new Date());
  return {
    dates() {
      const arr: Date[] = [];
      for (let i = 0; i < count; i++) {
        const d = addYears(today, i);
        arr.push(new Date(d.getFullYear(), 0, 1));
      }
      return arr;
    },
    isSelectable() {
      return true;
    },
    isDisabled() {
      return false;
    },
  };
}

/**
 * Filter dates from a base constraint using a predicate.
 * Dates that don't pass the predicate are removed entirely.
 */
export function filter(
  base: DateConstraint,
  predicate: (date: Date) => boolean,
): DateConstraint {
  return {
    dates() {
      return base.dates().filter(predicate);
    },
    isSelectable(date: Date) {
      return base.isSelectable(date) && predicate(date);
    },
    isDisabled(date: Date) {
      return base.isDisabled(date);
    },
  };
}

/**
 * Fully custom constraint from explicit date and selectable functions.
 */
export function custom(
  datesFn: () => Date[],
  isSelectableFn: (date: Date) => boolean,
  isDisabledFn?: (date: Date) => boolean,
): DateConstraint {
  return {
    dates: datesFn,
    isSelectable: isSelectableFn,
    isDisabled: isDisabledFn ?? (() => false),
  };
}
