import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import ChevronLeftIcon from "./ChevronLeftIcon";
import ChevronRightIcon from "./ChevronRightIcon";
import { PickerMonth, PickerDay } from "./DatePickerItems";

// util to compare y-m-d
function isSameYMD(a: Date, b: Date) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

// build an array of dates starting from today, inclusive, through today + daysCount
function makeDateArray(today: Date, daysCount: number) {
	const arr: Date[] = [];
	for (let i = 0; i <= daysCount; i++) {
		const d = new Date(today);
		d.setDate(today.getDate() + i);
		arr.push(d);
	}
	return arr;
}

interface DatePickerProps {
	daysCount?: number;
	cellSize?: number;
	onDateSelect: (date: string) => void;
	defaultDate?: string;
}

const ScrollButtonStyle = "p-0 disabled:opacity-50 enabled:hover:bg-gray-100 enabled:active:bg-gray-200 rounded text-gray-600";

export default function DatePicker({
	daysCount = 30, 
	onDateSelect,
	defaultDate,
}: DatePickerProps) {
	const today = new Date();

	const dates = useRef<Date[]>(makeDateArray(today, daysCount));
	const containerRef = useRef<HTMLDivElement>(null);

	// build items with month dividers inserted before the first date of a new month
	type DateItem = { kind: "date"; date: Date };
	type DividerItem = { kind: "divider"; month: number; year: number };
	type PickerItem = DateItem | DividerItem;

	const items = useMemo<PickerItem[]>(() => {
		const base = dates.current;
		const out: PickerItem[] = [];
		for (let i = 0; i < base.length; i++) {
			const d = base[i];
			if (i > 0) {
				const prev = base[i - 1];
				if (d.getMonth() !== prev.getMonth() || d.getFullYear() !== prev.getFullYear()) {
					out.push({ kind: "divider", month: d.getMonth(), year: d.getFullYear() });
				}
			}
			out.push({ kind: "date", date: d });
		}
		return out;
	}, []);

	// helpers to locate selectable indices (date items excluding today)
	const isTodayDate = (d: Date) => isSameYMD(d, dates.current[0]);

	const firstSelectableIndex = useMemo(() => {
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (item.kind === "date" && !isTodayDate(item.date)) return i;
		}
		return -1;
	}, [items, isTodayDate]);

	const getPrevSelectableIndex = useCallback((from: number) => {
		for (let i = from - 1; i >= 0; i--) {
			const item = items[i];
			if (item.kind === "date" && !isTodayDate(item.date)) return i;
		}
		return null;
	}, [items, isTodayDate]);

	const getNextSelectableIndex = useCallback((from: number) => {
		for (let i = from + 1; i < items.length; i++) {
			const item = items[i];
			if (item.kind === "date") return i;
		}
		return null;
	}, [items]);

	const lastSelectableIndex = useMemo(() => {
		for (let i = items.length - 1; i >= 0; i--) {
			const item = items[i];
			if (item.kind === "date") return i;
		}
		return -1;
	}, [items]);

	const findInitialIndex = useCallback(() => {
		if (!defaultDate) {
			return -1; // No selection by default
		}
		// Parse date components manually to avoid timezone issues
		const datePart = defaultDate.split(" ")[0];
		const [year, month, day] = datePart.split("-").map(Number);
		const defaultDateObj = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
		
		let index = items.findIndex(item => item.kind === "date" && isSameYMD(item.date, defaultDateObj));
		if (index === -1 || (items[index] as DateItem).kind === "date" && isTodayDate((items[index] as DateItem).date)) {
			return -1; // No selection if default date is invalid or today
		}
		return index > -1 ? index : -1;
	}, [defaultDate, items, isSameYMD, isTodayDate]);

	const [selectedIndex, setSelectedIndex] = useState(findInitialIndex);

	useEffect(() => {
		if (containerRef.current && selectedIndex >= 0) {
			const el = containerRef.current.children[selectedIndex];
			if (el && "scrollIntoView" in el) {
				el.scrollIntoView();
			}
		}
	}, [selectedIndex]);

	useEffect(() => {
		const item = items[selectedIndex];
		if (item && item.kind === "date" && onDateSelect && selectedIndex >= 0) {
			const selectedDate = item.date;
			const year = selectedDate.getFullYear();
			const month = selectedDate.getMonth() + 1;
			const day = selectedDate.getDate();

			const formattedMonth = month < 10 ? `0${month}` : month;
			const formattedDay = day < 10 ? `0${day}` : day;
			
			const formattedDateString = `${year}-${formattedMonth}-${formattedDay} 11:59 PM`;
			onDateSelect(formattedDateString);
		}
	}, [selectedIndex, onDateSelect, items]);

	const onLeft = () => {
		if (selectedIndex === -1) {
			// Start from first selectable when no selection
			if (firstSelectableIndex > -1) setSelectedIndex(firstSelectableIndex);
			return;
		}
		const prev = getPrevSelectableIndex(selectedIndex);
		if (prev !== null) setSelectedIndex(prev);
	};
	const onRight = () => {
		if (selectedIndex === -1) {
			// Start from first selectable when no selection
			if (firstSelectableIndex > -1) setSelectedIndex(firstSelectableIndex);
			return;
		}
		const next = getNextSelectableIndex(selectedIndex);
		if (next !== null) setSelectedIndex(next);
	};

	const moveByDays = useCallback((delta: number) => {
		if (selectedIndex === -1) {
			// Start from first selectable when no selection
			if (firstSelectableIndex > -1) setSelectedIndex(firstSelectableIndex);
			return;
		}
		const current = items[selectedIndex];
		if (!current || current.kind !== "date") {
			const fallback = delta >= 0 ? firstSelectableIndex : lastSelectableIndex;
			if (fallback > -1) setSelectedIndex(fallback);
			return;
		}
		const baseDate = current.date;
		const target = new Date(baseDate);
		target.setDate(baseDate.getDate() + delta);

		const firstIdx = firstSelectableIndex;
		const lastIdx = lastSelectableIndex;
		if (firstIdx === -1 || lastIdx === -1) return;

		const firstDate = (items[firstIdx] as { kind: "date"; date: Date }).date;
		const lastDate = (items[lastIdx] as { kind: "date"; date: Date }).date;

		if (target <= firstDate) {
			setSelectedIndex(firstIdx);
			return;
		}
		if (target >= lastDate) {
			setSelectedIndex(lastIdx);
			return;
		}

		let idx = items.findIndex(it => it.kind === "date" && isSameYMD((it as { kind: "date"; date: Date }).date, target));
		if (idx === -1) {
			// fallback: walk toward target direction to find a date item
			const step = delta >= 0 ? 1 : -1;
			for (let i = selectedIndex + step; i >= 0 && i < items.length; i += step) {
				const it = items[i];
				if (it.kind === "date") { idx = i; break; }
			}
		}
		if (idx !== -1) {
			const it = items[idx] as { kind: "date"; date: Date };
			if (isTodayDate(it.date)) {
				const next = delta >= 0 ? getNextSelectableIndex(idx) : getPrevSelectableIndex(idx);
				if (next !== null) {
					setSelectedIndex(next);
					return;
				}
			}
			setSelectedIndex(idx);
		}
	}, [items, selectedIndex, firstSelectableIndex, lastSelectableIndex, getNextSelectableIndex, getPrevSelectableIndex]);

	const onKeyDown = (e: any) => {
		// handle arrow keys when picker has focus
		if (e.key === "ArrowLeft") {
			e.preventDefault();
			onLeft();
			return;
		}
		if (e.key === "ArrowRight") {
			e.preventDefault();
			onRight();
			return;
		}
		if (e.key === "PageUp") {
			e.preventDefault();
			moveByDays(-7);
			return;
		}
		if (e.key === "PageDown") {
			e.preventDefault();
			moveByDays(7);
			return;
		}
		if (e.key === "Home") {
			e.preventDefault();
			if (firstSelectableIndex > -1) setSelectedIndex(firstSelectableIndex);
			return;
		}
		if (e.key === "End") {
			e.preventDefault();
			if (lastSelectableIndex > -1) setSelectedIndex(lastSelectableIndex);
			return;
		}
	};
	let weekdayCount = 0;

	return (
		<div className="flex items-center my-2" onKeyDown={onKeyDown}>
			<button onClick={onLeft} disabled={selectedIndex !== -1 && getPrevSelectableIndex(selectedIndex) === null} className={ScrollButtonStyle}>
				<ChevronLeftIcon className="w-6 h-6" />
			</button>
			<button onClick={onRight} disabled={selectedIndex !== -1 && getNextSelectableIndex(selectedIndex) === null} className={ScrollButtonStyle}>
				<ChevronRightIcon className="w-6 h-6" />
			</button>
			<div
				ref={containerRef}
				className="flex gap-[2px] overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
				tabIndex={0}
			>
				{items.map((item, idx) => {
					if (item.kind === "divider") {
						const label = new Date(item.year, item.month, 1).toLocaleString(undefined, { month: "short" });
						return (
							<PickerMonth
								key={`divider-${item.year}-${item.month}`}
								label={label}
							/>
						);
					}

					// date item
					const d = item.date;
					const isToday = isTodayDate(d);
					const isSelected = idx === selectedIndex;
					const dayAndDate = `${d.toLocaleDateString(undefined, { weekday: "short" })} ${d.getDate()}`;
					const isWeekend = d.getDay() % 6 == 0;

					// update the running weekday total if needed, not counting today
					if (!isToday && !isWeekend) {
						weekdayCount += 1;
					}

					return (
						<PickerDay
							key={d.toISOString()}
							isToday={isToday}
							isWeekend={isWeekend}
							selected={isSelected}
							dayAndDate={dayAndDate}
							weekdayCount={weekdayCount}
							onSelect={() => setSelectedIndex(idx)}
						/>
					);
				})}
			</div>
		</div>
	);
}
