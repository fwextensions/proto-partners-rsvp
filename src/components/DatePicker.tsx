import { useState, useRef, useEffect, useCallback } from "react";
import ChevronLeftIcon from "./ChevronLeftIcon";
import ChevronRightIcon from "./ChevronRightIcon";

interface DatePickerProps {
	daysCount?: number;
	cellSize?: number;
	gap?: number;
	onDateSelect: (date: string) => void;
	defaultDate?: string;
}
const ScrollButtonStyle = "p-0 disabled:opacity-50 enabled:hover:bg-gray-100 enabled:active:bg-gray-200 rounded text-gray-600";

export default function DatePicker({
	daysCount = 30, 
	cellSize = 64, 
	gap = 8, 
	onDateSelect, 
	defaultDate,
}: DatePickerProps) {
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);

	const makeDateArray = useCallback(() => {
		const arr = [];
		for (let i = 0; i <= daysCount; i++) {
			const d = new Date(today);
			d.setDate(today.getDate() + i);
			arr.push(d);
		}
		return arr;
	}, [today, daysCount]);

	const dates = useRef<Date[]>(makeDateArray());
	const containerRef = useRef<HTMLDivElement>(null);

	const findInitialIndex = useCallback(() => {
		if (!defaultDate) {
			return 1; // tomorrow
		}
		const defaultDateObj = new Date(defaultDate.split(' ')[0]);
		const index = dates.current.findIndex(d => 
			d.getFullYear() === defaultDateObj.getFullYear() &&
			d.getMonth() === defaultDateObj.getMonth() &&
			d.getDate() === defaultDateObj.getDate()
		);
		// if not found, or if it's today, default to tomorrow
		return index > 0 ? index : 1; 
	}, [defaultDate, dates]);

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
		const selectedDate = dates.current[selectedIndex];
		if (selectedDate && onDateSelect) {
			const year = selectedDate.getFullYear();
			const month = selectedDate.getMonth() + 1;
			const day = selectedDate.getDate();

			const formattedMonth = month < 10 ? `0${month}` : month;
			const formattedDay = day < 10 ? `0${day}` : day;
			
			const formattedDateString = `${year}-${formattedMonth}-${formattedDay} 11:59 PM`;
			onDateSelect(formattedDateString);
		}
	}, [selectedIndex, onDateSelect, dates]);

	const onLeft = () => {
		if (selectedIndex > 1) setSelectedIndex((i) => i - 1);
	};
	const onRight = () => {
		if (selectedIndex < dates.current.length - 1) setSelectedIndex((i) => i + 1);
	};

	return (
		<div className="flex items-center my-2">
			<button onClick={onLeft} disabled={selectedIndex <= 1} className={ScrollButtonStyle}>
				<ChevronLeftIcon className="w-6 h-6" />
			</button>
			<button onClick={onRight} disabled={selectedIndex >= dates.current.length - 1} className={ScrollButtonStyle}>
				<ChevronRightIcon className="w-6 h-6" />
			</button>
			<div
				ref={containerRef}
				className="flex overflow-x-auto scroll-snap-x mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
				style={{ scrollPadding: `0 calc(50% - ${cellSize / 2}px)` }}
			>
				{dates.current.map((d, idx) => {
					const isToday = idx === 0;
					const isSelected = idx === selectedIndex;
					const dayAndDate = `${d.toLocaleDateString(undefined, { weekday: "short" })} ${d.getDate()}`;
					const isWeekend = d.getDay() % 6 == 0;

					return (
						<div
							key={d.toISOString()}
							onClick={() => !isToday && setSelectedIndex(idx)}
							className={[
								"flex-shrink-0",
								"w-[3.5rem] h-[3.5rem]",
								`m-[${gap / 2}px]`,
								"flex flex-col items-center justify-evenly",
								"scroll-snap-align-center",
								"cursor-pointer",
								"rounded",
								isToday ? "text-gray-400" : "",
								isSelected ? "bg-blue-600 text-white" : "",
								!isToday && !isSelected ? "hover:bg-blue-100" : "",
							].filter(Boolean).join(" ")}
						>
							<div className={`text-sm ${isWeekend ? "opacity-40" : "opacity-70"}`}>
								{dayAndDate}
							</div>
							<div className={`${isToday ? "text-sm" : "text-lg"} font-semibold pr-1 ${isWeekend ? "opacity-50" : ""}`}>
								{isToday ? "Today" : `+${idx}`}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
