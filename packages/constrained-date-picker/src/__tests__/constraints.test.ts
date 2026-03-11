import { describe, it, expect } from "vitest";
import {
  daysFromToday,
  dateRange,
  monthsFromToday,
  yearsFromToday,
  filter,
  custom,
} from "../core/constraints.js";
import { isSameDay, startOfDay } from "../core/date-utils.js";

describe("daysFromToday", () => {
  it("generates count+1 dates (today through today+count)", () => {
    const c = daysFromToday(30);
    const dates = c.dates();
    expect(dates).toHaveLength(31);
  });

  it("first date is today", () => {
    const c = daysFromToday(5);
    const dates = c.dates();
    expect(isSameDay(dates[0], new Date())).toBe(true);
  });

  it("today is disabled but not selectable", () => {
    const c = daysFromToday(5);
    const today = startOfDay(new Date());
    expect(c.isDisabled(today)).toBe(true);
    expect(c.isSelectable(today)).toBe(false);
  });

  it("tomorrow is selectable and not disabled", () => {
    const c = daysFromToday(5);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(c.isSelectable(tomorrow)).toBe(true);
    expect(c.isDisabled(tomorrow)).toBe(false);
  });
});

describe("dateRange", () => {
  it("generates all days between start and end inclusive", () => {
    const start = new Date(2026, 0, 1);
    const end = new Date(2026, 0, 10);
    const c = dateRange(start, end);
    expect(c.dates()).toHaveLength(10);
  });

  it("all dates are selectable", () => {
    const start = new Date(2026, 0, 1);
    const end = new Date(2026, 0, 3);
    const c = dateRange(start, end);
    for (const d of c.dates()) {
      expect(c.isSelectable(d)).toBe(true);
    }
  });
});

describe("monthsFromToday", () => {
  it("generates correct number of months", () => {
    const c = monthsFromToday(6);
    expect(c.dates()).toHaveLength(6);
  });

  it("each date is the 1st of its month", () => {
    const c = monthsFromToday(3);
    for (const d of c.dates()) {
      expect(d.getDate()).toBe(1);
    }
  });
});

describe("yearsFromToday", () => {
  it("generates correct number of years", () => {
    const c = yearsFromToday(5);
    expect(c.dates()).toHaveLength(5);
  });

  it("each date is Jan 1", () => {
    const c = yearsFromToday(3);
    for (const d of c.dates()) {
      expect(d.getMonth()).toBe(0);
      expect(d.getDate()).toBe(1);
    }
  });
});

describe("filter", () => {
  it("removes dates not matching predicate", () => {
    const base = dateRange(new Date(2026, 0, 1), new Date(2026, 0, 7));
    const weekdaysOnly = filter(base, (d) => d.getDay() !== 0 && d.getDay() !== 6);
    const dates = weekdaysOnly.dates();
    for (const d of dates) {
      expect(d.getDay()).not.toBe(0);
      expect(d.getDay()).not.toBe(6);
    }
  });
});

describe("custom", () => {
  it("uses provided functions", () => {
    const dates = [new Date(2026, 5, 1), new Date(2026, 5, 15)];
    const c = custom(
      () => dates,
      (d) => d.getDate() === 15,
    );
    expect(c.dates()).toHaveLength(2);
    expect(c.isSelectable(dates[0])).toBe(false);
    expect(c.isSelectable(dates[1])).toBe(true);
  });
});
