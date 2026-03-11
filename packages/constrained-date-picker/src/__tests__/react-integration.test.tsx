import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import * as DatePicker from "../react/index.js";
import { daysFromToday, dateRange } from "../core/constraints.js";

describe("DatePicker compound components", () => {
  it("renders groups and items from a constraint", () => {
    const constraint = dateRange(new Date(2026, 2, 1), new Date(2026, 2, 5));

    render(
      <DatePicker.Root constraint={constraint}>
        <DatePicker.Groups>
          {(group) => (
            <DatePicker.Group key={group.key} group={group}>
              <DatePicker.GroupLabel group={group}>
                {group.label}
              </DatePicker.GroupLabel>
              {group.dates.map((entry, i) => (
                <DatePicker.Item key={entry.date.toISOString()} entry={entry} index={i}>
                  {entry.date.getDate()}
                </DatePicker.Item>
              ))}
            </DatePicker.Group>
          )}
        </DatePicker.Groups>
      </DatePicker.Root>,
    );

    // Should render 5 date items with role="option"
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(5);
  });

  it("selects a date on click and calls onValueChange", () => {
    const onValueChange = vi.fn();
    const constraint = dateRange(new Date(2026, 2, 1), new Date(2026, 2, 3));

    let globalIdx = 0;
    render(
      <DatePicker.Root constraint={constraint} onValueChange={onValueChange}>
        <DatePicker.Groups>
          {(group) =>
            group.dates.map((entry) => {
              const idx = globalIdx++;
              return (
                <DatePicker.Item key={entry.date.toISOString()} entry={entry} index={idx}>
                  {entry.date.getDate()}
                </DatePicker.Item>
              );
            })
          }
        </DatePicker.Groups>
      </DatePicker.Root>,
    );

    const options = screen.getAllByRole("option");
    fireEvent.click(options[1]); // Click March 2

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const selectedDate = onValueChange.mock.calls[0][0];
    expect(selectedDate.getDate()).toBe(2);
    expect(selectedDate.getMonth()).toBe(2); // March
  });

  it("marks selected item with aria-selected", () => {
    const constraint = dateRange(new Date(2026, 2, 1), new Date(2026, 2, 3));
    const defaultValue = new Date(2026, 2, 2);

    let globalIdx = 0;
    render(
      <DatePicker.Root constraint={constraint} defaultValue={defaultValue}>
        <DatePicker.Groups>
          {(group) =>
            group.dates.map((entry) => {
              const idx = globalIdx++;
              return (
                <DatePicker.Item key={entry.date.toISOString()} entry={entry} index={idx}>
                  {entry.date.getDate()}
                </DatePicker.Item>
              );
            })
          }
        </DatePicker.Groups>
      </DatePicker.Root>,
    );

    const options = screen.getAllByRole("option");
    expect(options[1].getAttribute("aria-selected")).toBe("true");
    expect(options[0].getAttribute("aria-selected")).toBe("false");
  });

  it("supports keyboard navigation", () => {
    const onValueChange = vi.fn();
    const constraint = dateRange(new Date(2026, 2, 1), new Date(2026, 2, 5));

    let globalIdx = 0;
    render(
      <DatePicker.Root constraint={constraint} onValueChange={onValueChange}>
        <DatePicker.Groups>
          {(group) =>
            group.dates.map((entry) => {
              const idx = globalIdx++;
              return (
                <DatePicker.Item key={entry.date.toISOString()} entry={entry} index={idx}>
                  {entry.date.getDate()}
                </DatePicker.Item>
              );
            })
          }
        </DatePicker.Groups>
      </DatePicker.Root>,
    );

    const listbox = screen.getByRole("listbox");

    // First arrow key should select first item
    fireEvent.keyDown(listbox, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0].getDate()).toBe(1);

    // Move right again
    fireEvent.keyDown(listbox, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(onValueChange.mock.calls[1][0].getDate()).toBe(2);

    // End key
    fireEvent.keyDown(listbox, { key: "End" });
    const lastCall = onValueChange.mock.calls[onValueChange.mock.calls.length - 1][0];
    expect(lastCall.getDate()).toBe(5);
  });

  it("Navigation component works", () => {
    const onValueChange = vi.fn();
    const constraint = dateRange(new Date(2026, 2, 1), new Date(2026, 2, 5));

    let globalIdx = 0;
    render(
      <DatePicker.Root constraint={constraint} defaultValue={new Date(2026, 2, 2)} onValueChange={onValueChange}>
        <DatePicker.Navigation action="prev">Prev</DatePicker.Navigation>
        <DatePicker.Groups>
          {(group) =>
            group.dates.map((entry) => {
              const idx = globalIdx++;
              return (
                <DatePicker.Item key={entry.date.toISOString()} entry={entry} index={idx}>
                  {entry.date.getDate()}
                </DatePicker.Item>
              );
            })
          }
        </DatePicker.Groups>
        <DatePicker.Navigation action="next">Next</DatePicker.Navigation>
      </DatePicker.Root>,
    );

    fireEvent.click(screen.getByText("Next"));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0].getDate()).toBe(3);
  });
});

describe("useDatePicker hook", () => {
  it("returns groups and entries", () => {
    let hookResult: DatePicker.UseDatePickerReturn | null = null;

    function TestComponent() {
      hookResult = DatePicker.useDatePicker({
        constraint: dateRange(new Date(2026, 2, 1), new Date(2026, 2, 10)),
      });
      return null;
    }

    render(<TestComponent />);

    expect(hookResult!.flatEntries).toHaveLength(10);
    expect(hookResult!.groups.length).toBeGreaterThanOrEqual(1);
    expect(hookResult!.selectedDate).toBeNull();
    expect(hookResult!.selectedIndex).toBe(-1);
  });
});
