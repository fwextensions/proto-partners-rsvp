// base item wrapper used by month divider and day items
export type PickerItemBaseProps = {
	selected?: boolean;
	selectedClass?: string;
	className?: string;
	onClick?: () => void;
	children: any;
};

function PickerItemBase({ selected = false, selectedClass = "", className, onClick, children }: PickerItemBaseProps) {
	return (
		<div
			onClick={onClick}
			className={[
				"flex-shrink-0",
				"w-[3.5rem] h-[3.5rem]",
				"flex flex-col items-center justify-evenly",
				"scroll-snap-align-center",
				selected ? selectedClass : "",
				className,
			].filter(Boolean).join(" ")}
		>
			{children}
		</div>
	);
}

export type PickerMonthProps = {
	label: string;
};

export function PickerMonth({ label }: PickerMonthProps) {
	return (
		<PickerItemBase
			className={["border-l-4 border-gray-200", "cursor-default select-none"].join(" ")}
		>
			<div className="text-sm">&nbsp;</div>
			<div className="text-lg font-semibold text-gray-500">{label}</div>
		</PickerItemBase>
	);
}

export type PickerDayProps = {
	isToday: boolean;
	isWeekend: boolean;
	selected: boolean;
	dayAndDate: string;
	weekdayCount: number;
	onSelect: () => void;
};

export function PickerDay({ isToday, isWeekend, selected, dayAndDate, weekdayCount, onSelect }: PickerDayProps) {
	const containerClass = [
		"rounded",
		isToday ? "text-gray-400 cursor-default" : "cursor-pointer",
		selected ? "" : "",
		!isToday && !selected ? "hover:bg-blue-100" : "",
	].filter(Boolean).join(" ");

	return (
		<PickerItemBase
			selected={selected}
			selectedClass="bg-blue-600 text-white"
			className={containerClass}
			onClick={!isToday ? onSelect : undefined}
		>
			<div className={`text-sm ${isWeekend ? "opacity-40" : "opacity-70"}`}>{dayAndDate}</div>
			<div className={`text-lg font-semibold pr-1 ${isWeekend ? "opacity-50" : ""}`}>
				{isToday ? <span className="text-sm">Today</span> : (isWeekend ? <span>&nbsp;</span> : `+${weekdayCount}`)}
			</div>
		</PickerItemBase>
	);
}
