import type { DateConstraint } from "./types.js";
import { isWeekend, isSameDay } from "./date-utils.js";
import { filter, daysFromToday } from "./constraints.js";

/** Filter predicate: returns true for weekdays (Mon–Fri). */
export function weekdaysPredicate(date: Date): boolean {
  return !isWeekend(date);
}

/** Filter predicate: returns true for weekends (Sat–Sun). */
export function weekendsPredicate(date: Date): boolean {
  return isWeekend(date);
}

/** Remove weekend dates from a constraint. */
export function weekdaysOnly(base: DateConstraint): DateConstraint {
  return filter(base, weekdaysPredicate);
}

/** Keep only weekend dates from a constraint. */
export function weekendsOnly(base: DateConstraint): DateConstraint {
  return filter(base, weekendsPredicate);
}

/** Remove specific dates from a constraint. */
export function excludeDates(
  base: DateConstraint,
  excluded: Date[],
): DateConstraint {
  return filter(base, (d) => !excluded.some((ex) => isSameDay(d, ex)));
}

/** Keep only specific dates from a constraint. */
export function onlyDates(
  base: DateConstraint,
  allowed: Date[],
): DateConstraint {
  return filter(base, (d) => allowed.some((a) => isSameDay(d, a)));
}

/** Shorthand: next N calendar days, weekdays only. */
export function nextWeekdays(count: number): DateConstraint {
  return weekdaysOnly(daysFromToday(count));
}

/** Alias for monthsFromToday. */
export { monthsFromToday as nextMonths } from "./constraints.js";

/** Alias for yearsFromToday. */
export { yearsFromToday as nextYears } from "./constraints.js";
