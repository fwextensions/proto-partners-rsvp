import { describe, it, expect } from "vitest";
import { generateEntries, generateGroups, groupByMonth, groupByYear, noGrouping } from "../core/date-set.js";
import { dateRange, daysFromToday, yearsFromToday } from "../core/constraints.js";

describe("generateEntries", () => {
  it("creates entries from a constraint", () => {
    const c = dateRange(new Date(2026, 0, 1), new Date(2026, 0, 5));
    const entries = generateEntries(c);
    expect(entries).toHaveLength(5);
    expect(entries[0].date.getDate()).toBe(1);
    expect(entries[4].date.getDate()).toBe(5);
  });

  it("marks disabled/selectable correctly from daysFromToday", () => {
    const c = daysFromToday(3);
    const entries = generateEntries(c);
    // First entry is today — disabled
    expect(entries[0].disabled).toBe(true);
    expect(entries[0].selectable).toBe(false);
    // Second entry is tomorrow — selectable
    expect(entries[1].disabled).toBe(false);
    expect(entries[1].selectable).toBe(true);
  });
});

describe("groupByMonth", () => {
  it("groups dates by month", () => {
    const c = dateRange(new Date(2026, 0, 28), new Date(2026, 1, 3));
    const groups = generateGroups(c, groupByMonth);
    expect(groups).toHaveLength(2);
    expect(groups[0].dates.length).toBe(4); // Jan 28-31
    expect(groups[1].dates.length).toBe(3); // Feb 1-3
  });

  it("uses short month + year as label", () => {
    const c = dateRange(new Date(2026, 2, 1), new Date(2026, 2, 2));
    const groups = generateGroups(c, groupByMonth);
    expect(groups).toHaveLength(1);
    // Label should contain "Mar" and "2026"
    expect(groups[0].label).toMatch(/Mar/);
    expect(groups[0].label).toMatch(/2026/);
  });
});

describe("groupByYear", () => {
  it("groups dates by year", () => {
    const c = yearsFromToday(3);
    const groups = generateGroups(c, groupByYear);
    expect(groups.length).toBeGreaterThanOrEqual(1);
  });
});

describe("noGrouping", () => {
  it("puts all entries in one group", () => {
    const c = dateRange(new Date(2026, 0, 1), new Date(2026, 2, 31));
    const groups = noGrouping(generateEntries(c));
    expect(groups).toHaveLength(1);
    expect(groups[0].key).toBe("all");
  });

  it("returns empty for empty entries", () => {
    expect(noGrouping([])).toHaveLength(0);
  });
});
