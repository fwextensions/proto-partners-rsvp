// Compound components
export { Root } from "./Root.js";
export { Item } from "./Item.js";
export { Group } from "./Group.js";
export { GroupLabel } from "./GroupLabel.js";
export { Groups } from "./Groups.js";
export { Navigation } from "./Navigation.js";

// Hook
export { useDatePicker } from "./use-date-picker.js";
export type { UseDatePickerOptions, UseDatePickerReturn } from "./use-date-picker.js";

// Context (for advanced consumers)
export { useDatePickerContext, DatePickerContext } from "./context.js";
export type { DatePickerContextValue } from "./context.js";

// Slot (for consumers building their own compound components)
export { Slot } from "./Slot.js";

// Re-export core for convenience
export * from "../core/index.js";
