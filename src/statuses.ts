export const STATUSES = {
	"": {
		label: "Status",
		textColor: "text-gray-400",
		backgroundColor: "bg-white",
		borderColor: "border-gray-400",
	},
	Processing: {
		label: "Processing",
		textColor: "text-gray-800",
		backgroundColor: "bg-gray-200",
		borderColor: "border-gray-400",
	},
	Withdrawn: {
		label: "Withdrawn",
		textColor: "text-yellow-800",
		backgroundColor: "bg-yellow-200",
		borderColor: "border-yellow-500",
	},
	Appealed: {
		label: "Appealed",
		textColor: "text-purple-800",
		backgroundColor: "bg-purple-200",
		borderColor: "border-purple-500",
	},
	Waitlisted: {
		label: "Waitlisted",
		textColor: "text-cyan-800",
		backgroundColor: "bg-cyan-200",
		borderColor: "border-cyan-500",
	},
	Disqualified: {
		label: "Disqualified",
		textColor: "text-white",
		backgroundColor: "bg-red-600",
		borderColor: "border-red-700",
	},
	Approved: {
		label: "Approved",
		textColor: "text-blue-800",
		backgroundColor: "bg-blue-200",
		borderColor: "border-blue-600",
	},
	"Lease Signed": {
		label: "Lease Signed",
		textColor: "text-green-800",
		backgroundColor: "bg-green-200",
		borderColor: "border-green-600",
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
