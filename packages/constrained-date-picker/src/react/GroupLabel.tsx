import React from "react";
import type { DateGroup } from "../core/types.js";
import { useDatePickerContext } from "./context.js";
import { Slot } from "./Slot.js";

export interface GroupLabelProps {
  /** The date group this label describes. */
  group: DateGroup;
  /** Render as child element instead of wrapping div. */
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function GroupLabel({ group, asChild = false, children, className }: GroupLabelProps) {
  const { getGroupLabelProps } = useDatePickerContext();
  const labelProps = getGroupLabelProps(group);

  const Comp = asChild ? Slot : "div";

  return (
    <Comp {...labelProps} className={className}>
      {children}
    </Comp>
  );
}

GroupLabel.displayName = "DatePicker.GroupLabel";
