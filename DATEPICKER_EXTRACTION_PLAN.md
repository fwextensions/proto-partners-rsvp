# DatePicker Extraction Plan: Headless React Component Library

## Overview

Extract the current `DatePicker` from this prototype into a headless, composable React component library (working name: `@constrained-date-picker/react`). The library provides date-range-constrained selection logic, keyboard navigation, and accessibility — with zero styling opinions — following the Radix UI compound-component pattern.

---

## 1. Current State Analysis

### What exists today
The prototype's DatePicker is a **horizontal scrolling day-strip** purpose-built for one scenario: "pick a deadline within the next 30 days." It is tightly coupled to:

- **A single constraint model**: contiguous days from tomorrow → today + N.
- **A single visual layout**: horizontal scroll strip with chevron buttons, snap points, and month dividers.
- **Tailwind CSS**: all styling is hardcoded via class strings in `PickerItemBase`, `PickerDay`, and `PickerMonth`.
- **A specific output format**: `"YYYY-MM-DD 11:59 PM"` string with hardcoded time.
- **Prototype-specific presentation logic**: weekday counters ("5 days"), weekend dimming, "Today" labels.

### What needs to change for reuse
| Concern | Current | Target |
|---|---|---|
| Styling | Tailwind classes baked in | Zero default styles; consumers compose with own CSS/Tailwind/CSS-in-JS |
| Constraint model | "next N days from today" | Pluggable: date range, min/max, allow/disallow functions, step units |
| Output value | Formatted string with time | `Date` object (consumers format as needed) |
| Layout | Horizontal strip only | Any layout — strip, grid/calendar, dropdown, mobile sheet, etc. |
| Presentation | Weekday count, "Today" label | Consumer-defined render functions or components |
| Date generation | Always contiguous days | Days, months, or years; sparse or contiguous |

---

## 2. Target Architecture

### Design Principles

1. **Headless first** — Expose state, behavior, and ARIA via hooks and context. Render nothing visual.
2. **Compound components** — `Root`, `Item`, `Group`, `Navigation` parts that compose like Radix primitives, each rendering a single DOM element (or none via `asChild`).
3. **Bring your own element** — Every part supports `asChild` (render-delegation via Slot, same as Radix) so consumers can use their own styled elements.
4. **Constraint-driven** — The core concept is "select a date from a constrained set." The constraint is the primary configuration surface.
5. **Uncontrolled by default, controlled when needed** — `defaultValue` / `value` + `onValueChange` pattern.

### Package Structure

```
@constrained-date-picker/
├── core/              # Framework-agnostic logic (pure TS)
│   ├── constraints.ts       # Constraint builders & evaluation
│   ├── date-set.ts          # Generate date arrays from constraints
│   ├── navigation.ts        # Keyboard nav state machine
│   ├── filters.ts           # Common filter predicates (weekdaysOnly, etc.)
│   └── types.ts             # Shared types
│
├── react/             # React bindings (headless components + hooks)
│   ├── context.ts           # DatePickerContext
│   ├── use-date-picker.ts   # Core hook (state, handlers, ARIA)
│   ├── Root.tsx             # Provider + orchestrator
│   ├── Item.tsx             # Single selectable date
│   ├── Group.tsx            # Logical grouping (e.g., month)
│   ├── GroupLabel.tsx        # Label for a group
│   ├── Navigation.tsx       # Prev/Next control
│   └── index.ts             # Public API
│
└── react/presets/     # Ready-to-use composed components (CSS included)
    ├── HorizontalStrip.tsx        # Scrollable day strip (current prototype layout)
    ├── HorizontalStrip.css        # Minimal structural + theme CSS
    ├── CalendarGrid.tsx           # Month calendar grid
    ├── CalendarGrid.css
    ├── CompactPicker.tsx          # Pill/chip selector for sparse sets (years, months)
    ├── CompactPicker.css
    └── index.ts
```

Splitting `core` from `react` keeps the door open for future framework bindings (Vue, Svelte, etc.) and makes the logic independently testable. The `presets/` layer provides batteries-included components for consumers who want something working immediately.

---

## 3. Core Logic Layer (`core/`)

### 3.1 Constraint System

The constraint is the central abstraction. A constraint defines what dates are selectable.

```ts
interface DateConstraint {
  /** Generate the ordered set of candidate dates */
  dates(): Date[];
  /** Return true if a specific date is selectable */
  isSelectable(date: Date): boolean;
  /** Optional: return true if a date should appear but be disabled */
  isDisabled?(date: Date): boolean;
}
```

**Built-in constraint builders** (composable):

| Builder | Description | Example use case |
|---|---|---|
| `daysFromToday(count)` | Next N calendar days | "Pick a deadline within 30 days" |
| `dateRange(start, end)` | All days between two dates | "Select any date in Q2" |
| `monthsFromToday(count)` | First of each month for N months | "Pick a billing month" |
| `yearsFromToday(count)` | Jan 1 of each year for N years | "Pick a tax year" |
| `filter(constraint, fn)` | Remove dates matching predicate | "Weekdays only" |
| `custom(datesFn, selectableFn)` | Fully custom | "Available appointment slots from API" |

Composability example:
```ts
// Any weekday in the next 60 days
const constraint = filter(daysFromToday(60), (d) => !isWeekend(d));

// Any day in the next 10 years (sparse — only year boundaries)
const constraint = yearsFromToday(10);
```

### 3.2 Date Set Generator (`date-set.ts`)

Takes a constraint, produces a structured array:

```ts
interface DateGroup {
  key: string;         // e.g., "2026-03"
  label: string;       // e.g., "Mar 2026"
  dates: DateEntry[];
}

interface DateEntry {
  date: Date;
  selectable: boolean;
  disabled: boolean;    // visible but not selectable (e.g., "today")
  metadata: Record<string, unknown>;  // extensible — consumers can attach anything
}
```

The grouping strategy is also configurable:
- `groupByMonth` (default for day-level constraints)
- `groupByYear` (default for month/year-level constraints)
- `noGrouping`
- Custom `(dates: DateEntry[]) => DateGroup[]`

### 3.3 Navigation State Machine (`navigation.ts`)

Pure functions implementing keyboard navigation over a `DateEntry[]`:

```ts
type NavAction =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "JUMP"; delta: number }   // e.g., +7 for PageDown
  | { type: "FIRST" }
  | { type: "LAST" }
  | { type: "SELECT"; index: number }; // mouse click

function navigate(
  entries: DateEntry[],
  currentIndex: number,
  action: NavAction
): number;  // returns new index
```

This replaces all the `getPrevSelectableIndex`, `getNextSelectableIndex`, `moveByDays` logic in the current component with a single, testable function.

---

## 4. React Layer (`react/`)

### 4.1 Hook: `useDatePicker`

The low-level hook for consumers who want full control:

```ts
function useDatePicker(options: {
  constraint: DateConstraint;
  defaultValue?: Date;
  value?: Date;
  onValueChange?: (date: Date) => void;
  groupBy?: GroupingStrategy;
  disabled?: boolean;
}): {
  groups: DateGroup[];
  flatEntries: DateEntry[];
  selectedDate: Date | null;
  selectedIndex: number;
  select: (date: Date) => void;
  navigate: (action: NavAction) => void;
  // ARIA helpers
  getContainerProps: () => Record<string, unknown>;
  getItemProps: (entry: DateEntry, index: number) => Record<string, unknown>;
  getGroupProps: (group: DateGroup) => Record<string, unknown>;
  getGroupLabelProps: (group: DateGroup) => Record<string, unknown>;
};
```

### 4.2 Compound Components

For consumers who prefer JSX composition over hooks:

```tsx
// Consumer code — fully styled by consumer
<DatePicker.Root
  constraint={daysFromToday(30)}
  defaultValue={defaultDeadline}
  onValueChange={setDeadline}
>
  <DatePicker.Navigation action="prev" asChild>
    <button className="my-chevron-btn"><ChevronLeft /></button>
  </DatePicker.Navigation>

  <div className="flex overflow-x-auto">
    <DatePicker.Groups>
      {(group) => (
        <DatePicker.Group key={group.key}>
          <DatePicker.GroupLabel asChild>
            <div className="font-bold border-l-4">{group.label}</div>
          </DatePicker.GroupLabel>

          {group.dates.map((entry) => (
            <DatePicker.Item key={entry.date.toISOString()} entry={entry} asChild>
              <button className={entry.selectable ? "selectable" : "disabled"}>
                {formatDay(entry.date)}
              </button>
            </DatePicker.Item>
          ))}
        </DatePicker.Group>
      )}
    </DatePicker.Groups>
  </div>

  <DatePicker.Navigation action="next" asChild>
    <button className="my-chevron-btn"><ChevronRight /></button>
  </DatePicker.Navigation>
</DatePicker.Root>
```

Each compound component:
- Renders a sensible default element (`div`, `button`, etc.)
- Supports `asChild` to delegate rendering to the consumer's child element
- Injects appropriate ARIA attributes and event handlers via context
- Does **not** apply any visual styles

### 4.3 `asChild` / Slot Implementation

Follow the Radix `Slot` approach: when `asChild` is true, the component merges its props (event handlers, ARIA attrs, refs) onto the single child element rather than rendering its own wrapper element. This can use `@radix-ui/react-slot` as a dependency or a lightweight equivalent.

---

## 5. Presets: Batteries-Included Defaults

Pure headless is powerful but creates a high barrier to entry. The library should also offer **presets** — pre-composed components that work out of the box and are incrementally customizable. Think of it like Radix Primitives vs. Radix Themes: the primitives are headless, the themes give you a working UI that you can progressively peel apart.

### 5.1 Three Tiers of Usage

| Tier | Import from | What you get | Who it's for |
|---|---|---|---|
| **Quick start** | `@constrained-date-picker/react/presets` | Drop-in components with default styles, just pass a constraint | Prototyping, internal tools, "I just need a date picker" |
| **Compose** | `@constrained-date-picker/react` | Headless compound components, bring your own markup and styles | Design-system teams, custom UIs |
| **Full control** | `@constrained-date-picker/react` + `core` | Raw hook + pure logic functions | Advanced use cases, non-standard layouts |

### 5.2 Preset Components

#### `HorizontalStrip` — the current prototype's layout, generalized

```tsx
import { HorizontalStrip } from "@constrained-date-picker/react/presets";
import { daysFromToday, weekdaysOnly } from "@constrained-date-picker/core";

// Minimal — works immediately
<HorizontalStrip
  constraint={daysFromToday(30)}
  onValueChange={setDeadline}
/>

// With common options
<HorizontalStrip
  constraint={daysFromToday(30)}
  filter={weekdaysOnly}
  onValueChange={setDeadline}
  showToday={true}
  itemSize="compact"          // "compact" | "default" | "large"
  className="my-override"     // applied to outer container
/>
```

Includes: horizontal scroll, snap points, month dividers, prev/next chevrons, keyboard nav, selected state, disabled "today" styling. Ships a small CSS file (~2KB) with CSS custom properties for theming.

#### `CalendarGrid` — traditional month grid

```tsx
import { CalendarGrid } from "@constrained-date-picker/react/presets";
import { daysFromToday } from "@constrained-date-picker/core";

<CalendarGrid
  constraint={daysFromToday(365)}
  onValueChange={setDate}
/>
```

Includes: month-by-month grid, day-of-week headers, prev/next month navigation, selected + disabled states.

#### `CompactPicker` — for sparse sets (years, months)

```tsx
import { CompactPicker } from "@constrained-date-picker/react/presets";
import { yearsFromToday } from "@constrained-date-picker/core";

<CompactPicker
  constraint={yearsFromToday(10)}
  onValueChange={setYear}
  formatLabel={(date) => date.getFullYear().toString()}
/>
```

Includes: horizontal pill/chip layout, wrap behavior, selected state.

### 5.3 Styling Strategy for Presets

Presets ship with **minimal structural CSS + CSS custom properties** for theming. No Tailwind dependency, no CSS-in-JS runtime.

```css
/* HorizontalStrip.css — ships with the preset */
.cdp-strip { display: flex; align-items: center; gap: 2px; }
.cdp-strip-scroll { display: flex; gap: 2px; overflow-x: auto; scroll-snap-type: x mandatory; }
.cdp-strip-item { flex-shrink: 0; width: var(--cdp-item-size, 3.5rem); height: var(--cdp-item-size, 3.5rem); scroll-snap-align: start; }
.cdp-strip-item[aria-selected="true"] { background: var(--cdp-selected-bg, #2563eb); color: var(--cdp-selected-text, #fff); }
.cdp-strip-item[aria-disabled="true"] { opacity: var(--cdp-disabled-opacity, 0.4); cursor: default; }
.cdp-strip-item:not([aria-disabled]):hover { background: var(--cdp-hover-bg, #dbeafe); }
.cdp-strip-divider { border-left: var(--cdp-divider-border, 4px solid #e5e7eb); }
/* etc. */
```

Consumers override by:
1. **CSS custom properties** — easiest: set `--cdp-selected-bg: purple` on a parent.
2. **className prop** — override the outer container class.
3. **Swapping to headless** — peel the preset apart and use compound components directly when they outgrow it.

### 5.4 Common Constraint Shortcuts & Filters

The `core` package exports convenience functions so consumers don't have to write predicates for common cases:

```ts
// Filters (composable with any constraint)
import {
  weekdaysOnly,     // excludes Saturday & Sunday
  weekendsOnly,     // only Saturday & Sunday
  excludeToday,     // makes today visible but disabled
  excludeDates,     // excludeDates([christmas, newYears])
  onlyDates,        // allowlist — only these specific dates are selectable
} from "@constrained-date-picker/core";

// Shorthand constraints (combine base + filter in one call)
import {
  nextWeekdays,     // nextWeekdays(30) = daysFromToday(30) + weekdaysOnly
  nextMonths,       // alias for monthsFromToday
  nextYears,        // alias for yearsFromToday
} from "@constrained-date-picker/core";

// Usage
<HorizontalStrip constraint={nextWeekdays(30)} onValueChange={setDate} />
```

### 5.5 Progressive Customization Path

The key insight: presets are not a separate API. They are thin compositions of the same headless primitives. A consumer's journey looks like:

1. **Start with a preset**: `<HorizontalStrip constraint={daysFromToday(30)} />`
2. **Theme it**: override CSS custom properties.
3. **Customize rendering**: pass `renderItem`, `renderDivider`, or `renderNavigation` props to replace specific parts while keeping the layout.
4. **Go headless**: when customization props aren't enough, import `DatePicker.Root` / `DatePicker.Item` / etc. and build the layout themselves. The preset source code serves as a reference implementation.

```tsx
// Step 3: Customize specific parts of a preset
<HorizontalStrip
  constraint={daysFromToday(30)}
  onValueChange={setDate}
  renderItem={(entry, { selected, disabled }) => (
    <div className={`my-day ${selected ? "my-selected" : ""}`}>
      <span>{entry.date.getDate()}</span>
      {isToday(entry.date) && <span className="badge">Today</span>}
    </div>
  )}
  renderDivider={(group) => (
    <div className="my-month-label">{group.label}</div>
  )}
/>
```

This means presets have **render props for each visual slot**, giving partial customization before you need to drop down to headless. The render props are optional — each has a sensible default.

---

## 6. Scenario Walkthrough: How Different Apps Use This

### Scenario A: "Pick a deadline in the next 30 days" (current prototype)

```tsx
<DatePicker.Root constraint={daysFromToday(30)} onValueChange={setDeadline}>
  {/* horizontal strip layout, weekday counters, etc. — all consumer-defined */}
</DatePicker.Root>
```

The consumer recreates today's strip UI in their own styles and adds the weekday-counter presentation logic in their `Item` render.

### Scenario B: "Pick any date in the next year" — calendar grid

```tsx
<DatePicker.Root constraint={daysFromToday(365)} onValueChange={setDate}>
  <DatePicker.Groups>
    {(group) => (
      <div className="month-grid">
        <h3>{group.label}</h3>
        <div className="grid grid-cols-7">
          {group.dates.map((entry) => (
            <DatePicker.Item key={entry.date.toISOString()} entry={entry} asChild>
              <button>{entry.date.getDate()}</button>
            </DatePicker.Item>
          ))}
        </div>
      </div>
    )}
  </DatePicker.Groups>
</DatePicker.Root>
```

Same core logic, totally different layout.

### Scenario C: "Pick a year in the next 10 years" — dropdown or button group

```tsx
<DatePicker.Root constraint={yearsFromToday(10)} onValueChange={setYear}>
  <div className="flex flex-wrap gap-2">
    <DatePicker.Groups>
      {(group) =>
        group.dates.map((entry) => (
          <DatePicker.Item key={entry.date.toISOString()} entry={entry} asChild>
            <button className="pill">{entry.date.getFullYear()}</button>
          </DatePicker.Item>
        ))
      }
    </DatePicker.Groups>
  </div>
</DatePicker.Root>
```

### Scenario D: "Pick an available appointment slot" — API-driven

```tsx
const slots = useAppointmentSlots(); // from API
const constraint = custom(
  () => slots.map(s => s.date),
  (d) => slots.find(s => isSameDay(s.date, d))?.available ?? false
);

<DatePicker.Root constraint={constraint} onValueChange={setAppointment}>
  {/* any layout */}
</DatePicker.Root>
```

---

## 6. Implementation Steps

### Phase 1: Core logic extraction
1. Create the package scaffolding (`core/` and `react/` workspaces or a single package with subpath exports).
2. Extract date generation into `date-set.ts` — generalize `makeDateArray` into constraint-driven generation.
3. Extract navigation into `navigation.ts` — consolidate `getPrevSelectableIndex`, `getNextSelectableIndex`, `moveByDays` into the `navigate()` state machine.
4. Build the constraint system with `daysFromToday` as the first builder (directly replacing current `daysCount` prop).
5. Write unit tests for all core logic (constraint evaluation, date set generation, navigation).

### Phase 2: React headless layer
6. Build `useDatePicker` hook wiring core logic to React state.
7. Build `DatePickerContext` and compound components (`Root`, `Item`, `Group`, `GroupLabel`, `Navigation`).
8. Implement `asChild` / Slot support.
9. Add ARIA attributes: `role="listbox"` on container, `role="option"` + `aria-selected` + `aria-disabled` on items, `role="separator"` on group labels.
10. Write integration tests (React Testing Library) for selection, keyboard nav, and ARIA.

### Phase 3: Constraint builders & filters
11. Implement `dateRange`, `monthsFromToday`, `yearsFromToday`, `filter`, `custom`.
12. Implement common filters: `weekdaysOnly`, `weekendsOnly`, `excludeToday`, `excludeDates`, `onlyDates`.
13. Implement shorthand constraints: `nextWeekdays`, `nextMonths`, `nextYears`.
14. Implement grouping strategies (`groupByMonth`, `groupByYear`, custom).
15. Test each constraint builder and filter with the full component stack.

### Phase 4: Presets
16. Build `HorizontalStrip` preset by composing headless primitives — port the current prototype's layout.
17. Write structural CSS with custom properties for `HorizontalStrip`.
18. Add `renderItem`, `renderDivider`, `renderNavigation` escape hatches to `HorizontalStrip`.
19. Build `CalendarGrid` preset.
20. Build `CompactPicker` preset.
21. Test presets in isolation and with various constraints.

### Phase 5: Polish and documentation
22. Write JSDoc on all public APIs.
23. Create example implementations covering scenarios A–D above, showing all three tiers (preset → compose → full control).
24. Bundle configuration (Vite library mode or tsup), ESM + CJS output, `exports` map in package.json. Ensure preset CSS is importable separately.
25. Write a short README with quick-start examples starting from the preset tier.

---

## 7. Key Design Decisions

| Decision | Rationale |
|---|---|
| **`Date` objects as the value type, not strings** | Strings couple the library to a format. Consumers format as they need. |
| **Constraints as the primary API, not `minDate`/`maxDate` props** | A single `constraint` prop replaces multiple conflicting props and covers sparse date sets (appointments, fiscal years) that min/max can't express. |
| **Compound components with `asChild`, not render props everywhere** | Better DX for simple cases; `asChild` composes more naturally than render props when consumers already have styled components. Render-prop iteration (`Groups` children-as-function) is used only where a mapping function is genuinely needed. |
| **Core logic separated from React** | Enables future framework ports, simplifies unit testing, and keeps the React layer thin. |
| **No built-in "today" / "weekend" concepts in headless layer** | These are presentation concerns. The headless layer doesn't embed them, but `core` exports `weekdaysOnly`, `excludeToday`, etc. as composable filters, and presets wire up sensible defaults. |
| **Presets are compositions, not a separate API** | Presets import and compose the same headless primitives consumers use. This means they serve as both working components *and* reference implementations. No hidden internal APIs. |
| **`Groups` uses children-as-function** | Groups are dynamic (determined by constraint + grouping strategy), so a render-prop pattern is the most natural way to iterate them without forcing consumers to call a hook. |
| **Single `onValueChange(date: Date)` callback** | Matches Radix convention. No `onDateSelect` with formatted strings. |

---

## 8. What Gets Left Behind (Prototype-Specific)

These things stay in the consuming app, **not** in the library:

- Weekday counting ("5 days") display logic
- "Today" label rendering
- Weekend opacity dimming
- `11:59 PM` time appending
- Chevron icon components (consumers bring their own)
- Tailwind class strings
- Horizontal scroll-strip layout with snap points
