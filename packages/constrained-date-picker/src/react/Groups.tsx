import type { DateGroup } from "../core/types.js";
import { useDatePickerContext } from "./context.js";

export interface GroupsProps {
  /** Render function receiving each group. */
  children: (group: DateGroup) => React.ReactNode;
}

/** Iterates over groups from the constraint, passing each to the render function. */
export function Groups({ children }: GroupsProps) {
  const { groups } = useDatePickerContext();
  return <>{groups.map((group) => children(group))}</>;
}

Groups.displayName = "DatePicker.Groups";
