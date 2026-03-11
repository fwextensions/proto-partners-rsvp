import { createContext, useContext } from "react";
import type { UseDatePickerReturn } from "./use-date-picker.js";

export type DatePickerContextValue = UseDatePickerReturn;

export const DatePickerContext = createContext<DatePickerContextValue | null>(null);

export function useDatePickerContext(): DatePickerContextValue {
  const ctx = useContext(DatePickerContext);
  if (!ctx) {
    throw new Error(
      "DatePicker compound components must be used within <DatePicker.Root>",
    );
  }
  return ctx;
}
