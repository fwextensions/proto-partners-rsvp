import { describe, it, expect } from "vitest";
import { weekdaysOnly, weekendsOnly, excludeDates, onlyDates, nextWeekdays } from "../core/filters.js";
import { dateRange, daysFromToday } from "../core/constraints.js";
import { isSameDay } from "../core/date-utils.js";

describe("weekdaysOnly", () => {
  it("removes weekends", () => {
    // Jan 1 2026 is Thursday, Jan 7 is Wednesday — includes Sat Jan 3, Sun Jan 4
    const base = dateRange(new Date(2026, 0, 1), new Date(2026, 0, 7));
    const filtered = weekdaysOnly(base);
    const dates = filtered.dates();
    for (const d of dates) {
      expect(d.getDay()).not.toBe(0);
      expect(d.getDay()).not.toBe(6);
    }
    expect(dates.length).toBe(5); // 7 days - 2 weekend days
  });
});

describe("weekendsOnly", () => {
  it("keeps only weekends", () => {
    const base = dateRange(new Date(2026, 0, 1), new Date(2026, 0, 7));
    const filtered = weekendsOnly(base);
    const dates = filtered.dates();
    for (const d of dates) {
      expect([0, 6]).toContain(d.getDay());
    }
    expect(dates.length).toBe(2);
  });
});

describe("excludeDates", () => {
  it("removes specific dates", () => {
    const base = dateRange(new Date(2026, 0, 1), new Date(2026, 0, 5));
    const excluded = [new Date(2026, 0, 3)];
    const filtered = excludeDates(base, excluded);
    const dates = filtered.dates();
    expect(dates.length).toBe(4);
    expect(dates.every((d) => !isSameDay(d, excluded[0]))).toBe(true);
  });
});

describe("onlyDates", () => {
  it("keeps only specified dates", () => {
    const base = dateRange(new Date(2026, 0, 1), new Date(2026, 0, 10));
    const allowed = [new Date(2026, 0, 3), new Date(2026, 0, 7)];
    const filtered = onlyDates(base, allowed);
    expect(filtered.dates().length).toBe(2);
  });
});

describe("nextWeekdays", () => {
  it("returns only weekdays from daysFromToday", () => {
    const c = nextWeekdays(14);
    const dates = c.dates();
    for (const d of dates) {
      expect(d.getDay()).not.toBe(0);
      expect(d.getDay()).not.toBe(6);
    }
  });
});
