import React, { useState } from "react";
import type { DateConstraint, DateEntry, DateGroup, GroupingStrategy } from "../../core/types.js";
import { isWeekend as isWeekendUtil, isToday as isTodayUtil } from "../../core/date-utils.js";
import { useDatePicker } from "../use-date-picker.js";
import { keyToNavAction } from "../../core/navigation.js";

export interface CalendarGridProps {
  /** The constraint defining available dates. */
  constraint: DateConstraint;
  /** Initial selected date (uncontrolled). */
  defaultValue?: Date;
  /** Selected date (controlled). */
  value?: Date;
  /** Callback when selection changes. */
  onValueChange?: (date: Date) => void;
  /** Grouping strategy. Defaults to groupByMonth. */
  groupBy?: GroupingStrategy;
  /** Whether the picker is disabled. */
  disabled?: boolean;
  /** CSS class for the outer container. */
  className?: string;
  /** Custom renderer for a date cell. */
  renderItem?: (
    entry: DateEntry,
    state: { selected: boolean; disabled: boolean; isToday: boolean; isWeekend: boolean },
  ) => React.ReactNode;
  /** Custom renderer for prev/next month buttons. */
  renderNavigation?: (direction: "prev" | "next", props: { onClick: () => void; disabled: boolean }) => React.ReactNode;
}

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Traditional month calendar grid preset.
 * Shows one month at a time with prev/next navigation.
 */
export function CalendarGrid({
  constraint,
  defaultValue,
  value,
  onValueChange,
  groupBy,
  disabled = false,
  className,
  renderItem,
  renderNavigation,
}: CalendarGridProps) {
  const picker = useDatePicker({
    constraint,
    defaultValue,
    value,
    onValueChange,
    groupBy,
    disabled,
  });

  // Track which month group is currently visible
  const [visibleGroupIdx, setVisibleGroupIdx] = useState(0);
  const group = picker.groups[visibleGroupIdx];

  if (!group) return null;

  const canGoPrev = visibleGroupIdx > 0;
  const canGoNext = visibleGroupIdx < picker.groups.length - 1;

  const onKeyDown = (e: React.KeyboardEvent) => {
    const action = keyToNavAction(e.key);
    if (action) {
      e.preventDefault();
      picker.navigate(action);
    }
  };

  // Build the 7-column grid with empty cells for alignment
  const firstDate = group.dates[0]?.date;
  const startDayOfWeek = firstDate ? firstDate.getDay() : 0;

  // Compute the global flat index offset for this group
  let globalOffset = 0;
  for (let g = 0; g < visibleGroupIdx; g++) {
    globalOffset += picker.groups[g].dates.length;
  }

  const prevProps = {
    onClick: () => setVisibleGroupIdx((i) => Math.max(0, i - 1)),
    disabled: !canGoPrev || disabled,
  };
  const nextProps = {
    onClick: () => setVisibleGroupIdx((i) => Math.min(picker.groups.length - 1, i + 1)),
    disabled: !canGoNext || disabled,
  };

  return (
    <div className={`cdp-grid ${className ?? ""}`} role="listbox" tabIndex={disabled ? -1 : 0} onKeyDown={onKeyDown}>
      <div className="cdp-grid-header">
        {renderNavigation ? (
          renderNavigation("prev", prevProps)
        ) : (
          <button type="button" className="cdp-grid-nav" aria-label="Previous month" {...prevProps}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="cdp-grid-nav-icon">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <span className="cdp-grid-title">{group.label}</span>
        {renderNavigation ? (
          renderNavigation("next", nextProps)
        ) : (
          <button type="button" className="cdp-grid-nav" aria-label="Next month" {...nextProps}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="cdp-grid-nav-icon">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>

      <div className="cdp-grid-days">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="cdp-grid-dayheader">{d}</div>
        ))}
      </div>

      <div className="cdp-grid-body">
        {/* Empty cells before first day */}
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="cdp-grid-cell cdp-grid-cell--empty" />
        ))}

        {group.dates.map((entry, localIdx) => {
          const flatIdx = globalOffset + localIdx;
          const isSelected = flatIdx === picker.selectedIndex;
          const today = isTodayUtil(entry.date);
          const weekend = isWeekendUtil(entry.date);

          if (renderItem) {
            return (
              <div
                key={entry.date.toISOString()}
                className={`cdp-grid-cell ${isSelected ? "cdp-grid-cell--selected" : ""}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={entry.disabled || !entry.selectable || undefined}
                onClick={entry.selectable && !disabled ? () => picker.selectIndex(flatIdx) : undefined}
              >
                {renderItem(entry, { selected: isSelected, disabled: entry.disabled, isToday: today, isWeekend: weekend })}
              </div>
            );
          }

          return (
            <div
              key={entry.date.toISOString()}
              className={[
                "cdp-grid-cell",
                isSelected ? "cdp-grid-cell--selected" : "",
                today ? "cdp-grid-cell--today" : "",
                weekend ? "cdp-grid-cell--weekend" : "",
                entry.disabled || !entry.selectable ? "cdp-grid-cell--disabled" : "",
              ].filter(Boolean).join(" ")}
              role="option"
              aria-selected={isSelected}
              aria-disabled={entry.disabled || !entry.selectable || undefined}
              onClick={entry.selectable && !disabled ? () => picker.selectIndex(flatIdx) : undefined}
            >
              {entry.date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

CalendarGrid.displayName = "CalendarGrid";
