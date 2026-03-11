import type { DateEntry, NavAction } from "./types.js";
import { isSameDay, addDays } from "./date-utils.js";

/** Find the index of the first selectable entry. Returns -1 if none. */
export function findFirstSelectable(entries: DateEntry[]): number {
  return entries.findIndex((e) => e.selectable);
}

/** Find the index of the last selectable entry. Returns -1 if none. */
export function findLastSelectable(entries: DateEntry[]): number {
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].selectable) return i;
  }
  return -1;
}

/** Find the previous selectable entry before `from`. Returns -1 if none. */
function findPrevSelectable(entries: DateEntry[], from: number): number {
  for (let i = from - 1; i >= 0; i--) {
    if (entries[i].selectable) return i;
  }
  return -1;
}

/** Find the next selectable entry after `from`. Returns -1 if none. */
function findNextSelectable(entries: DateEntry[], from: number): number {
  for (let i = from + 1; i < entries.length; i++) {
    if (entries[i].selectable) return i;
  }
  return -1;
}

/**
 * Navigate within a flat entry list. Returns the new selected index.
 * Returns -1 if no selectable entry can be found.
 */
export function navigate(
  entries: DateEntry[],
  currentIndex: number,
  action: NavAction,
): number {
  if (entries.length === 0) return -1;

  const firstIdx = findFirstSelectable(entries);
  const lastIdx = findLastSelectable(entries);
  if (firstIdx === -1) return -1;

  // If nothing is selected, most actions start from the first selectable
  if (currentIndex === -1) {
    if (action.type === "SELECT") {
      const entry = entries[action.index];
      return entry?.selectable ? action.index : -1;
    }
    return firstIdx;
  }

  switch (action.type) {
    case "NEXT": {
      const next = findNextSelectable(entries, currentIndex);
      return next !== -1 ? next : currentIndex;
    }
    case "PREV": {
      const prev = findPrevSelectable(entries, currentIndex);
      return prev !== -1 ? prev : currentIndex;
    }
    case "FIRST":
      return firstIdx;
    case "LAST":
      return lastIdx;
    case "SELECT": {
      const entry = entries[action.index];
      return entry?.selectable ? action.index : currentIndex;
    }
    case "JUMP": {
      const current = entries[currentIndex];
      if (!current) return firstIdx;

      const targetDate = addDays(current.date, action.delta);

      // Clamp to bounds
      if (targetDate <= entries[firstIdx].date) return firstIdx;
      if (targetDate >= entries[lastIdx].date) return lastIdx;

      // Find the closest selectable entry to the target date
      let bestIdx = -1;
      let bestDiff = Infinity;
      for (let i = 0; i < entries.length; i++) {
        if (!entries[i].selectable) continue;
        const diff = Math.abs(entries[i].date.getTime() - targetDate.getTime());
        if (diff < bestDiff) {
          bestDiff = diff;
          bestIdx = i;
        }
      }
      return bestIdx !== -1 ? bestIdx : currentIndex;
    }
  }
}

/** Map a keyboard event key to a NavAction, or null if not a nav key. */
export function keyToNavAction(key: string): NavAction | null {
  switch (key) {
    case "ArrowLeft":
      return { type: "PREV" };
    case "ArrowRight":
      return { type: "NEXT" };
    case "PageUp":
      return { type: "JUMP", delta: -7 };
    case "PageDown":
      return { type: "JUMP", delta: 7 };
    case "Home":
      return { type: "FIRST" };
    case "End":
      return { type: "LAST" };
    default:
      return null;
  }
}
