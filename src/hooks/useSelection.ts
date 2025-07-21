import { useState, ChangeEvent } from "react";

export interface UseSelectionResult {
	selectedIds: number[];
	isAllSelected: boolean;
	lastCheckedIndex: number | null;
	handleSelectAll: (e: ChangeEvent<HTMLInputElement>) => void;
	handleCheckboxChange: (
		index: number,
		id: number,
		e: ChangeEvent<HTMLInputElement>
	) => void;
	clearSelection: () => void;
}

/**
 * Hook to manage selection state with shift-click range support.
 */
export function useSelection<T extends { id: number }>(items: T[]): UseSelectionResult {
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [lastCheckedIndex, setLastCheckedIndex] = useState<number | null>(null);

	const isAllSelected = items.length > 0 && selectedIds.length === items.length;

	const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setSelectedIds(items.map((i) => i.id));
		} else {
			setSelectedIds([]);
		}
		setLastCheckedIndex(null);
	};

	const handleCheckboxChange = (
		index: number,
		id: number,
		e: ChangeEvent<HTMLInputElement>
	) => {
		const checked = e.target.checked;

		if (
			e.nativeEvent instanceof MouseEvent &&
			e.nativeEvent.shiftKey &&
			lastCheckedIndex !== null
		) {
			const [start, end] = [lastCheckedIndex, index].sort((a, b) => a - b);
			const rangeIds = items.slice(start, end + 1).map((i) => i.id);
			setSelectedIds((prev) => Array.from(new Set([...prev, ...rangeIds])));
		} else {
			setSelectedIds((prev) =>
				checked ? [...prev, id] : prev.filter((curr) => curr !== id)
			);
		}

		setLastCheckedIndex(index);
	};

	const clearSelection = () => setSelectedIds([]);

	return {
		selectedIds,
		isAllSelected,
		lastCheckedIndex,
		handleSelectAll,
		handleCheckboxChange,
		clearSelection,
	};
}
