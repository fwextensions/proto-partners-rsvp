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
│   └── types.ts             # Shared types
│
└── react/             # React bindings (headless components + hooks)
    ├── context.ts           # DatePickerContext
    ├── use-date-picker.ts   # Core hook (state, handlers, ARIA)
    ├── Root.tsx             # Provider + orchestrator
    ├── Item.tsx             # Single selectable date
    ├── Group.tsx            # Logical grouping (e.g., month)
    ├── GroupLabel.tsx        # Label for a group
    ├── Navigation.tsx       # Prev/Next control
    └── index.ts             # Public API
```

Splitting `core` from `react` keeps the door open for future framework bindings (Vue, Svelte, etc.) and makes the logic independently testable.

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

## 5. Scenario Walkthrough: How Different Apps Use This

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

### Phase 3: Constraint builders
11. Implement `dateRange`, `monthsFromToday`, `yearsFromToday`, `filter`, `custom`.
12. Implement grouping strategies (`groupByMonth`, `groupByYear`, custom).
13. Test each constraint builder with the full component stack.

### Phase 4: Polish and documentation
14. Write JSDoc on all public APIs.
15. Create example implementations covering scenarios A–D above.
16. Bundle configuration (Vite library mode or tsup), ESM + CJS output, `exports` map in package.json.
17. Write a short README with quick-start examples.

---

## 7. Key Design Decisions

| Decision | Rationale |
|---|---|
| **`Date` objects as the value type, not strings** | Strings couple the library to a format. Consumers format as they need. |
| **Constraints as the primary API, not `minDate`/`maxDate` props** | A single `constraint` prop replaces multiple conflicting props and covers sparse date sets (appointments, fiscal years) that min/max can't express. |
| **Compound components with `asChild`, not render props everywhere** | Better DX for simple cases; `asChild` composes more naturally than render props when consumers already have styled components. Render-prop iteration (`Groups` children-as-function) is used only where a mapping function is genuinely needed. |
| **Core logic separated from React** | Enables future framework ports, simplifies unit testing, and keeps the React layer thin. |
| **No built-in "today" / "weekend" concepts** | These are presentation concerns. A consumer can derive them (`isToday(entry.date)`, `isWeekend(entry.date)`) and render accordingly. The constraint layer's `isDisabled` handles "today is not selectable." |
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
