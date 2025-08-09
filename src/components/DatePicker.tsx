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
	cellSize = 64, 
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

	const findInitialIndex = useCallback(() => {
		if (!defaultDate) {
			return firstSelectableIndex > -1 ? firstSelectableIndex : 0;
		}
		const defaultDateObj = new Date(defaultDate.split(" ")[0]);
		let index = items.findIndex(item => item.kind === "date" && isSameYMD(item.date, defaultDateObj));
		if (index === -1 || (items[index] as DateItem).kind === "date" && isTodayDate((items[index] as DateItem).date)) {
			index = firstSelectableIndex;
		}
		return index > -1 ? index : 0;
	}, [defaultDate, items, firstSelectableIndex, isSameYMD, isTodayDate]);

	const [selectedIndex, setSelectedIndex] = useState(findInitialIndex);

	useEffect(() => {
		if (containerRef.current) {
			const el = containerRef.current.children[selectedIndex];
			if (el && "scrollIntoView" in el) {
				el.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
			}
		}
	}, [selectedIndex]);

	useEffect(() => {
		const item = items[selectedIndex];
		if (item && item.kind === "date" && onDateSelect) {
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
		const prev = getPrevSelectableIndex(selectedIndex);
		if (prev !== null) setSelectedIndex(prev);
	};
	const onRight = () => {
		const next = getNextSelectableIndex(selectedIndex);
		if (next !== null) setSelectedIndex(next);
	};
	let weekdayCount = 0;

	return (
		<div className="flex items-center my-2">
			<button onClick={onLeft} disabled={getPrevSelectableIndex(selectedIndex) === null} className={ScrollButtonStyle}>
				<ChevronLeftIcon className="w-6 h-6" />
			</button>
			<button onClick={onRight} disabled={getNextSelectableIndex(selectedIndex) === null} className={ScrollButtonStyle}>
				<ChevronRightIcon className="w-6 h-6" />
			</button>
			<div
				ref={containerRef}
				className="flex gap-[2px] overflow-x-auto scroll-snap-x mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
				style={{ scrollPadding: `0 calc(50% - ${cellSize / 2}px)` }}
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
