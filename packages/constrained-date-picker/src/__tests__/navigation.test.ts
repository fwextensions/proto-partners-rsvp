import { describe, it, expect } from "vitest";
import { navigate, findFirstSelectable, findLastSelectable, keyToNavAction } from "../core/navigation.js";
import type { DateEntry } from "../core/types.js";

function makeEntries(count: number, opts?: { disabledIndices?: number[] }): DateEntry[] {
  const entries: DateEntry[] = [];
  const base = new Date(2026, 0, 1);
  for (let i = 0; i < count; i++) {
    const date = new Date(base);
    date.setDate(base.getDate() + i);
    const disabled = opts?.disabledIndices?.includes(i) ?? false;
    entries.push({ date, selectable: !disabled, disabled });
  }
  return entries;
}

describe("findFirstSelectable / findLastSelectable", () => {
  it("finds first and last selectable entries", () => {
    const entries = makeEntries(5, { disabledIndices: [0] });
    expect(findFirstSelectable(entries)).toBe(1);
    expect(findLastSelectable(entries)).toBe(4);
  });

  it("returns -1 for empty arrays", () => {
    expect(findFirstSelectable([])).toBe(-1);
    expect(findLastSelectable([])).toBe(-1);
  });
});

describe("navigate", () => {
  it("NEXT moves to next selectable", () => {
    const entries = makeEntries(5);
    expect(navigate(entries, 0, { type: "NEXT" })).toBe(1);
  });

  it("PREV moves to previous selectable", () => {
    const entries = makeEntries(5);
    expect(navigate(entries, 2, { type: "PREV" })).toBe(1);
  });

  it("NEXT stays at end when already at last", () => {
    const entries = makeEntries(3);
    expect(navigate(entries, 2, { type: "NEXT" })).toBe(2);
  });

  it("PREV stays at start when already at first", () => {
    const entries = makeEntries(3);
    expect(navigate(entries, 0, { type: "PREV" })).toBe(0);
  });

  it("FIRST jumps to first selectable", () => {
    const entries = makeEntries(5, { disabledIndices: [0] });
    expect(navigate(entries, 3, { type: "FIRST" })).toBe(1);
  });

  it("LAST jumps to last selectable", () => {
    const entries = makeEntries(5);
    expect(navigate(entries, 1, { type: "LAST" })).toBe(4);
  });

  it("SELECT selects specific index if selectable", () => {
    const entries = makeEntries(5);
    expect(navigate(entries, 0, { type: "SELECT", index: 3 })).toBe(3);
  });

  it("SELECT does not select disabled index", () => {
    const entries = makeEntries(5, { disabledIndices: [3] });
    expect(navigate(entries, 0, { type: "SELECT", index: 3 })).toBe(0);
  });

  it("JUMP moves by day delta", () => {
    const entries = makeEntries(30);
    const result = navigate(entries, 5, { type: "JUMP", delta: 7 });
    expect(result).toBe(12);
  });

  it("JUMP clamps to first when jumping before start", () => {
    const entries = makeEntries(10);
    expect(navigate(entries, 2, { type: "JUMP", delta: -10 })).toBe(0);
  });

  it("JUMP clamps to last when jumping past end", () => {
    const entries = makeEntries(10);
    expect(navigate(entries, 8, { type: "JUMP", delta: 10 })).toBe(9);
  });

  it("returns firstSelectable when currentIndex is -1", () => {
    const entries = makeEntries(5, { disabledIndices: [0] });
    expect(navigate(entries, -1, { type: "NEXT" })).toBe(1);
  });

  it("JUMP skips disabled entries to find closest selectable", () => {
    const entries = makeEntries(10, { disabledIndices: [5] });
    // Jump from index 2 by +3 → target index 5 is disabled, should find 4 or 6
    const result = navigate(entries, 2, { type: "JUMP", delta: 3 });
    expect(entries[result].selectable).toBe(true);
  });
});

describe("keyToNavAction", () => {
  it("maps arrow keys", () => {
    expect(keyToNavAction("ArrowLeft")).toEqual({ type: "PREV" });
    expect(keyToNavAction("ArrowRight")).toEqual({ type: "NEXT" });
  });

  it("maps page keys", () => {
    expect(keyToNavAction("PageUp")).toEqual({ type: "JUMP", delta: -7 });
    expect(keyToNavAction("PageDown")).toEqual({ type: "JUMP", delta: 7 });
  });

  it("maps Home/End", () => {
    expect(keyToNavAction("Home")).toEqual({ type: "FIRST" });
    expect(keyToNavAction("End")).toEqual({ type: "LAST" });
  });

  it("returns null for unrecognized keys", () => {
    expect(keyToNavAction("a")).toBeNull();
    expect(keyToNavAction("Enter")).toBeNull();
  });
});
