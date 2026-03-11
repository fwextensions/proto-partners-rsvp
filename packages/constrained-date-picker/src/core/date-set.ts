import type { DateConstraint, DateEntry, DateGroup, GroupingStrategy } from "./types.js";

/** Generate a flat list of DateEntry objects from a constraint. */
export function generateEntries(constraint: DateConstraint): DateEntry[] {
  return constraint.dates().map((date) => ({
    date,
    selectable: constraint.isSelectable(date),
    disabled: constraint.isDisabled(date),
  }));
}

/** Group entries by month (e.g., "Mar 2026"). */
export function groupByMonth(entries: DateEntry[]): DateGroup[] {
  const groups: DateGroup[] = [];
  let current: DateGroup | null = null;

  for (const entry of entries) {
    const key = `${entry.date.getFullYear()}-${String(entry.date.getMonth() + 1).padStart(2, "0")}`;
    if (!current || current.key !== key) {
      const label = entry.date.toLocaleString(undefined, {
        month: "short",
        year: "numeric",
      });
      current = { key, label, dates: [] };
      groups.push(current);
    }
    current.dates.push(entry);
  }

  return groups;
}

/** Group entries by year (e.g., "2026"). */
export function groupByYear(entries: DateEntry[]): DateGroup[] {
  const groups: DateGroup[] = [];
  let current: DateGroup | null = null;

  for (const entry of entries) {
    const key = String(entry.date.getFullYear());
    if (!current || current.key !== key) {
      current = { key, label: key, dates: [] };
      groups.push(current);
    }
    current.dates.push(entry);
  }

  return groups;
}

/** No grouping — put all entries in a single group. */
export function noGrouping(entries: DateEntry[]): DateGroup[] {
  if (entries.length === 0) return [];
  return [{ key: "all", label: "", dates: entries }];
}

/** Generate grouped date entries from a constraint and grouping strategy. */
export function generateGroups(
  constraint: DateConstraint,
  groupBy: GroupingStrategy = groupByMonth,
): DateGroup[] {
  return groupBy(generateEntries(constraint));
}
