import React, { forwardRef, cloneElement, isValidElement } from "react";

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * Lightweight Slot implementation following the Radix pattern.
 * When used, merges its props onto its single child element instead
 * of rendering its own wrapper.
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    if (!isValidElement(children)) {
      return null;
    }

    return cloneElement(children, {
      ...mergeProps(slotProps, children.props as Record<string, unknown>),
      ref: forwardedRef,
    } as Record<string, unknown>);
  },
);

Slot.displayName = "Slot";

function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...childProps };

  for (const key of Object.keys(slotProps)) {
    const slotVal = slotProps[key];
    const childVal = childProps[key];

    if (key === "style") {
      merged[key] = { ...(slotVal as object), ...(childVal as object) };
    } else if (key === "className") {
      merged[key] = [slotVal, childVal].filter(Boolean).join(" ");
    } else if (key.startsWith("on") && typeof slotVal === "function") {
      // Compose event handlers: call slot handler, then child handler
      if (typeof childVal === "function") {
        merged[key] = (...args: unknown[]) => {
          (childVal as Function)(...args);
          (slotVal as Function)(...args);
        };
      } else {
        merged[key] = slotVal;
      }
    } else if (childVal === undefined) {
      merged[key] = slotVal;
    }
  }

  return merged;
}
