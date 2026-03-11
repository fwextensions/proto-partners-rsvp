import React from "react";
import type { DateEntry } from "../core/types.js";
import { useDatePickerContext } from "./context.js";
import { Slot } from "./Slot.js";

export interface ItemProps {
  /** The date entry this item represents. */
  entry: DateEntry;
  /** The index of this entry in the flat entries array. */
  index: number;
  /** Render as child element instead of wrapping div. */
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function Item({ entry, index, asChild = false, children, className }: ItemProps) {
  const { getItemProps } = useDatePickerContext();
  const itemProps = getItemProps(entry, index);

  const Comp = asChild ? Slot : "div";

  return (
    <Comp {...itemProps} className={className}>
      {children}
    </Comp>
  );
}

Item.displayName = "DatePicker.Item";
