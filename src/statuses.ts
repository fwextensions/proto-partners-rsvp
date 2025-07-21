export const STATUSES = {
	"": {
		label: "Status",
		textColor: "text-[#999999]",
		backgroundColor: "bg-white",
		borderColor: "border-[#999999]",
	},
	Processing: {
		label: "Processing",
		textColor: "text-white",
		backgroundColor: "bg-[#999999]",
		borderColor: "border-[#999999]",
	},
	Withdrawn: {
		label: "Withdrawn",
		textColor: "text-black",
		backgroundColor: "bg-[#FFD97D]",
		borderColor: "border-[#FFD97D]",
	},
	Appealed: {
		label: "Appealed",
		textColor: "text-white",
		backgroundColor: "bg-[#C084FC]",
		borderColor: "border-[#C084FC]",
	},
	Waitlisted: {
		label: "Waitlisted",
		textColor: "text-white",
		backgroundColor: "bg-[#22D3EE]",
		borderColor: "border-[#22D3EE]",
	},
	Disqualified: {
		label: "Disqualified",
		textColor: "text-white",
		backgroundColor: "bg-[#EF4444]",
		borderColor: "border-[#EF4444]",
	},
	Approved: {
		label: "Approved",
		textColor: "text-white",
		backgroundColor: "bg-[#3B82F6]",
		borderColor: "border-[#3B82F6]",
	},
	"Lease Signed": {
		label: "Lease Signed",
		textColor: "text-white",
		backgroundColor: "bg-[#16A34A]",
		borderColor: "border-[#16A34A]",
	},
} as const;

export type Status = keyof typeof STATUSES;

export const STATUS_ORDER: Status[] = [
	"Processing",
	"Withdrawn",
	"Appealed",
	"Waitlisted",
	"Disqualified",
	"Approved",
	"Lease Signed",
];
