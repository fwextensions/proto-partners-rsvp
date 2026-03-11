/** A constraint defines what dates are available for selection. */
export interface DateConstraint {
  /** Generate the ordered set of candidate dates. */
  dates(): Date[];
  /** Return true if a specific date is selectable. */
  isSelectable(date: Date): boolean;
  /** Return true if a date should appear but be disabled (visible, not clickable). */
  isDisabled(date: Date): boolean;
}

/** A single date entry produced by the date-set generator. */
export interface DateEntry {
  date: Date;
  /** Whether this date can be selected by the user. */
  selectable: boolean;
  /** Whether this date is visible but not interactive (e.g., today). */
  disabled: boolean;
}

/** A logical group of date entries (e.g., a month). */
export interface DateGroup {
  /** Unique key for the group (e.g., "2026-03"). */
  key: string;
  /** Human-readable label (e.g., "Mar 2026"). */
  label: string;
  /** The date entries in this group. */
  dates: DateEntry[];
}

/** Strategy for grouping date entries. */
export type GroupingStrategy = (entries: DateEntry[]) => DateGroup[];

/** Actions for keyboard navigation. */
export type NavAction =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "JUMP"; delta: number }
  | { type: "FIRST" }
  | { type: "LAST" }
  | { type: "SELECT"; index: number };
