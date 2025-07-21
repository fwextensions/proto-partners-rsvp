import React, { createContext, useContext } from "react";
import { useSelection, UseSelectionResult } from "../hooks/useSelection";

// generic item type with required id
type ItemWithId = { id: number };

interface SelectionProviderProps<T extends ItemWithId> {
	items: T[];
	children: React.ReactNode;
}

// create context with undefined default so we can throw if used outside provider
const SelectionContext = createContext<UseSelectionResult | undefined>(undefined);

export function SelectionProvider<T extends ItemWithId>({ items, children }: SelectionProviderProps<T>) {
	// reuse existing hook for the heavy lifting
	const selection = useSelection(items);
	return <SelectionContext.Provider value={selection}>{children}</SelectionContext.Provider>;
}

// consumer hook that components will import instead of calling useSelection directly
export function useSelectionContext(): UseSelectionResult {
	const context = useContext(SelectionContext);
	if (!context) {
		throw new Error("useSelectionContext must be used within a SelectionProvider");
	}
	return context;
}
