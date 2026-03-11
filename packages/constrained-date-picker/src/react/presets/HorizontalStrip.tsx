import React, { useRef, useEffect } from "react";
import type { DateConstraint, DateEntry, DateGroup, GroupingStrategy } from "../../core/types.js";
import { isWeekend as isWeekendUtil, isToday as isTodayUtil } from "../../core/date-utils.js";
import { useDatePicker } from "../use-date-picker.js";
import { keyToNavAction } from "../../core/navigation.js";

export interface HorizontalStripProps {
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
  /** Whether to show today as a disabled item. Defaults to true. */
  showToday?: boolean;
  /** Item size variant. */
  itemSize?: "compact" | "default" | "large";
  /** CSS class for the outer container. */
  className?: string;
  /** Custom renderer for a date item. */
  renderItem?: (
    entry: DateEntry,
    state: { selected: boolean; disabled: boolean; isToday: boolean; isWeekend: boolean },
  ) => React.ReactNode;
  /** Custom renderer for a group divider. */
  renderDivider?: (group: DateGroup) => React.ReactNode;
  /** Custom renderer for prev/next nav buttons. */
  renderNavigation?: (direction: "prev" | "next", props: { onClick: () => void; disabled: boolean }) => React.ReactNode;
}

const sizeMap = {
  compact: "cdp-strip-item--compact",
  default: "",
  large: "cdp-strip-item--large",
};

/**
 * Ready-to-use horizontal scrolling date strip.
 * Comes with built-in styles (import the CSS file) and supports
 * progressive customization via render props.
 */
export function HorizontalStrip({
  constraint,
  defaultValue,
  value,
  onValueChange,
  groupBy,
  disabled = false,
  showToday = true,
  itemSize = "default",
  className,
  renderItem,
  renderDivider,
  renderNavigation,
}: HorizontalStripProps) {
  const picker = useDatePicker({
    constraint,
    defaultValue,
    value,
    onValueChange,
    groupBy,
    disabled,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll selected item into view
  useEffect(() => {
    if (scrollRef.current && picker.selectedIndex >= 0) {
      const items = scrollRef.current.querySelectorAll("[data-cdp-item]");
      const el = items[picker.selectedIndex];
      el?.scrollIntoView({ inline: "nearest", block: "nearest" });
    }
  }, [picker.selectedIndex]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const action = keyToNavAction(e.key);
    if (action) {
      e.preventDefault();
      picker.navigate(action);
    }
  };

  const sizeClass = sizeMap[itemSize];

  // Build a flat render list with dividers interleaved
  let globalIndex = 0;
  const renderList: React.ReactNode[] = [];

  for (const group of picker.groups) {
    // Divider
    if (renderDivider) {
      renderList.push(
        <React.Fragment key={`divider-${group.key}`}>
          {renderDivider(group)}
        </React.Fragment>,
      );
    } else {
      renderList.push(
        <div
          key={`divider-${group.key}`}
          className={`cdp-strip-divider ${sizeClass}`}
          role="separator"
          aria-hidden
        >
          <span className="cdp-strip-divider-label">{group.label}</span>
        </div>,
      );
    }

    // Date items
    for (const entry of group.dates) {
      const idx = globalIndex;
      const isSelected = idx === picker.selectedIndex;
      const today = isTodayUtil(entry.date);
      const weekend = isWeekendUtil(entry.date);

      if (today && !showToday) {
        globalIndex++;
        continue;
      }

      if (renderItem) {
        renderList.push(
          <div
            key={entry.date.toISOString()}
            data-cdp-item
            role="option"
            aria-selected={isSelected}
            aria-disabled={entry.disabled || !entry.selectable || undefined}
            className={`cdp-strip-item ${sizeClass} ${isSelected ? "cdp-strip-item--selected" : ""}`}
            onClick={entry.selectable && !disabled ? () => picker.selectIndex(idx) : undefined}
          >
            {renderItem(entry, { selected: isSelected, disabled: entry.disabled, isToday: today, isWeekend: weekend })}
          </div>,
        );
      } else {
        const dayLabel = entry.date.toLocaleDateString(undefined, { weekday: "short" });
        const dateNum = entry.date.getDate();

        renderList.push(
          <div
            key={entry.date.toISOString()}
            data-cdp-item
            role="option"
            aria-selected={isSelected}
            aria-disabled={entry.disabled || !entry.selectable || undefined}
            className={[
              "cdp-strip-item",
              sizeClass,
              isSelected ? "cdp-strip-item--selected" : "",
              today ? "cdp-strip-item--today" : "",
              weekend ? "cdp-strip-item--weekend" : "",
            ].filter(Boolean).join(" ")}
            onClick={entry.selectable && !disabled ? () => picker.selectIndex(idx) : undefined}
          >
            <span className="cdp-strip-item-day">{dayLabel}</span>
            <span className="cdp-strip-item-date">{dateNum}</span>
          </div>,
        );
      }

      globalIndex++;
    }
  }

  const prevDisabled = disabled || picker.selectedIndex <= 0;
  const lastIdx = picker.flatEntries.length - 1;
  const nextDisabled = disabled || (picker.selectedIndex !== -1 && picker.selectedIndex >= lastIdx);

  const prevProps = {
    onClick: () => picker.navigate({ type: "PREV" as const }),
    disabled: prevDisabled,
  };
  const nextProps = {
    onClick: () => picker.navigate({ type: "NEXT" as const }),
    disabled: nextDisabled,
  };

  return (
    <div className={`cdp-strip ${className ?? ""}`}>
      {renderNavigation ? (
        renderNavigation("prev", prevProps)
      ) : (
        <button
          type="button"
          className="cdp-strip-nav"
          aria-label="Previous date"
          {...prevProps}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="cdp-strip-nav-icon">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      <div
        ref={scrollRef}
        className="cdp-strip-scroll"
        role="listbox"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={onKeyDown}
      >
        {renderList}
      </div>

      {renderNavigation ? (
        renderNavigation("next", nextProps)
      ) : (
        <button
          type="button"
          className="cdp-strip-nav"
          aria-label="Next date"
          {...nextProps}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="cdp-strip-nav-icon">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}
    </div>
  );
}

HorizontalStrip.displayName = "HorizontalStrip";
