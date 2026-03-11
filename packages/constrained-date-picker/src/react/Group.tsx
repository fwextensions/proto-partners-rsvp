import React from "react";
import type { DateGroup } from "../core/types.js";
import { useDatePickerContext } from "./context.js";
import { Slot } from "./Slot.js";

export interface GroupProps {
  /** The date group this element represents. */
  group: DateGroup;
  /** Render as child element instead of wrapping div. */
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function Group({ group, asChild = false, children, className }: GroupProps) {
  const { getGroupProps } = useDatePickerContext();
  const groupProps = getGroupProps(group);

  const Comp = asChild ? Slot : "div";

  return (
    <Comp {...groupProps} className={className}>
      {children}
    </Comp>
  );
}

Group.displayName = "DatePicker.Group";
