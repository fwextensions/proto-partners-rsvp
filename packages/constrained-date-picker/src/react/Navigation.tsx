import React from "react";
import { useDatePickerContext } from "./context.js";
import { findFirstSelectable, findLastSelectable } from "../core/navigation.js";
import { Slot } from "./Slot.js";

export interface NavigationProps {
  /** Direction: "prev" moves backward, "next" moves forward. */
  action: "prev" | "next";
  /** Render as child element instead of wrapping button. */
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function Navigation({ action, asChild = false, children, className }: NavigationProps) {
  const { navigate, selectedIndex, flatEntries, disabled } = useDatePickerContext();

  const atStart =
    selectedIndex === -1 ||
    selectedIndex === findFirstSelectable(flatEntries);
  const atEnd =
    selectedIndex !== -1 &&
    selectedIndex === findLastSelectable(flatEntries);

  const isDisabled =
    disabled ||
    (action === "prev" && atStart) ||
    (action === "next" && atEnd);

  const onClick = () => {
    navigate({ type: action === "prev" ? "PREV" : "NEXT" });
  };

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type={asChild ? undefined : "button"}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={action === "prev" ? "Previous date" : "Next date"}
      className={className}
    >
      {children}
    </Comp>
  );
}

Navigation.displayName = "DatePicker.Navigation";
