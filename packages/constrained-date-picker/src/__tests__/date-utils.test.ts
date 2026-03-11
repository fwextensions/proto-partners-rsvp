import { describe, it, expect } from "vitest";
import { isSameDay, isWeekend, isToday, addDays, addMonths, addYears, startOfDay } from "../core/date-utils.js";

describe("isSameDay", () => {
  it("returns true for same date different times", () => {
    const a = new Date(2026, 2, 15, 10, 30);
    const b = new Date(2026, 2, 15, 23, 59);
    expect(isSameDay(a, b)).toBe(true);
  });

  it("returns false for different dates", () => {
    const a = new Date(2026, 2, 15);
    const b = new Date(2026, 2, 16);
    expect(isSameDay(a, b)).toBe(false);
  });
});

describe("isWeekend", () => {
  it("returns true for Saturday", () => {
    // March 14, 2026 is Saturday
    expect(isWeekend(new Date(2026, 2, 14))).toBe(true);
  });

  it("returns true for Sunday", () => {
    // March 15, 2026 is Sunday
    expect(isWeekend(new Date(2026, 2, 15))).toBe(true);
  });

  it("returns false for Wednesday", () => {
    // March 11, 2026 is Wednesday
    expect(isWeekend(new Date(2026, 2, 11))).toBe(false);
  });
});

describe("isToday", () => {
  it("returns true for today", () => {
    expect(isToday(new Date())).toBe(true);
  });

  it("returns false for yesterday", () => {
    const yesterday = addDays(new Date(), -1);
    expect(isToday(yesterday)).toBe(false);
  });
});

describe("addDays", () => {
  it("adds positive days", () => {
    const base = new Date(2026, 0, 1);
    const result = addDays(base, 5);
    expect(result.getDate()).toBe(6);
  });

  it("adds negative days", () => {
    const base = new Date(2026, 0, 10);
    const result = addDays(base, -3);
    expect(result.getDate()).toBe(7);
  });

  it("crosses month boundary", () => {
    const base = new Date(2026, 0, 30);
    const result = addDays(base, 3);
    expect(result.getMonth()).toBe(1); // Feb
    expect(result.getDate()).toBe(2);
  });
});

describe("addMonths", () => {
  it("adds months correctly", () => {
    const result = addMonths(new Date(2026, 0, 15), 3);
    expect(result.getMonth()).toBe(3); // April
  });
});

describe("addYears", () => {
  it("adds years correctly", () => {
    const result = addYears(new Date(2026, 5, 1), 2);
    expect(result.getFullYear()).toBe(2028);
  });
});

describe("startOfDay", () => {
  it("sets time to midnight", () => {
    const d = startOfDay(new Date(2026, 3, 15, 14, 30, 45));
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
    expect(d.getSeconds()).toBe(0);
    expect(d.getMilliseconds()).toBe(0);
  });
});
