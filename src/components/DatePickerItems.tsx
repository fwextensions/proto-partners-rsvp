// base item wrapper used by month divider and day items
export type PickerItemBaseProps = {
	selected?: boolean;
	selectedClass?: string;
	className?: string;
	onClick?: () => void;
	children: any;
	// optional passthrough attributes for aria/ids/roles etc
	attrs?: Record<string, any>;
};

function PickerItemBase({ selected = false, selectedClass = "", className, onClick, children, attrs }: PickerItemBaseProps) {
	return (
		<div
			onClick={onClick}
			{...attrs}
			className={[
				"flex-shrink-0",
				"w-[3.5rem] h-[3.5rem]",
				"flex flex-col items-center justify-evenly",
				"snap-center",
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
			attrs={{ role: "separator", "aria-hidden": true }}
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
	id?: string;
};

export function PickerDay({ isToday, isWeekend, selected, dayAndDate, weekdayCount, onSelect, id }: PickerDayProps) {
	const containerClass = [
		"rounded",
		isToday ? "text-gray-400 cursor-default" : "cursor-pointer",
		selected ? "" : "",
		!isToday && !selected ? "hover:bg-blue-100" : "",
		"outline-none"
	].filter(Boolean).join(" ");

	return (
		<PickerItemBase
			selected={selected}
			selectedClass="bg-blue-600 text-white"
			className={containerClass}
			onClick={!isToday ? onSelect : undefined}
			attrs={{ id, role: "option", "aria-selected": selected, "aria-disabled": isToday || undefined, tabIndex: -1 }}
		>
			<div className={`text-sm ${isWeekend ? "opacity-40" : "opacity-70"}`}>{dayAndDate}</div>
			<div className={`${isWeekend ? "opacity-50" : ""}`}>
				{isToday
					? <span className="text-sm">Today</span>
					: (isWeekend
						? <span>&nbsp;</span>
						: <>
								<span className="font-semibold pr-[.15em]">{weekdayCount}</span>
								<span className="opacity-50">{`day${weekdayCount > 1 ? "s" : ""}`}</span>
							</>)}
			</div>
		</PickerItemBase>
	);
}
