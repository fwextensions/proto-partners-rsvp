import React, { useEffect } from "react";
import DatePicker from "./DatePicker";

interface SendDialogProps {
	onClose: () => void;
	onConfirm: () => void;
	selectedCount: number;
	alternateContactCount: number;
	documentUrl: string;
	deadline: string;
	noEmailCount: number;
	onEditUrl: () => void;
	onUpdateDeadline: (newDeadline: string) => void;
	onSendExampleEmail: () => void;
}

const SendDialog: React.FC<SendDialogProps> = ({ 
	onClose, 
	onConfirm, 
	selectedCount, 
	alternateContactCount, 
	documentUrl, 
	deadline, 
	noEmailCount, 
	onEditUrl,
	onUpdateDeadline,
	onSendExampleEmail,
}) => {
	const totalRecipients = selectedCount + alternateContactCount - noEmailCount;

	const isSendDisabled = !documentUrl || !deadline;

	const formatDeadline = (deadlineStr: string) => {
		if (!deadlineStr) return "Not set";
		
		const months = [
			'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'
		];
		
		// Parse "YYYY-MM-DD 11:59 PM" format
		const datePart = deadlineStr.split(' ')[0];
		const [year, month, day] = datePart.split('-');
		
		if (year && month && day) {
			const monthName = months[parseInt(month) - 1];
			return `${monthName} ${parseInt(day)}, ${year} 11:59 PM Pacific Time`;
		}
		
		return deadlineStr;
	};

	const handleConfirm = () => {
		if (!isSendDisabled) {
			onConfirm();
		}
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [onClose]);

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center" onClick={onClose}>
			<div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative flex flex-col p-8" onClick={(e) => e.stopPropagation()}>
				<button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
					<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				<h2 className="text-xl font-semibold text-gray-800 mb-4">Send to selected applicants</h2>
				<p className="text-sm text-gray-600 mb-6">
					When you're ready, send an email to the applicants you selected. If you want, <button onClick={onSendExampleEmail} className="text-blue-600 underline hover:text-blue-800 bg-transparent border-none cursor-pointer">send yourself an example email</button> to preview what applicants will see.
				</p>

				<div className="space-y-4 text-sm mb-6">
					<p><span className="font-semibold">You are sending:</span> Invitation to Apply</p>
					<div>
						<p className="font-semibold">Document upload URL: 
							<button onClick={onEditUrl} className="text-blue-600 underline font-normal ml-2">Edit</button>
						</p>
						<p className="text-gray-600 break-all">{documentUrl || "Not set"}</p>
					</div>
					<div>
						<p className="font-semibold">Deadline:</p>
						<div className="my-2">
							<DatePicker onDateSelect={onUpdateDeadline} defaultDate={deadline} />
						</div>
						<p>{formatDeadline(deadline)}</p>
					</div>
					<div>
						<p className="font-semibold">Total recipients: {totalRecipients} people</p>
						<ul className="list-disc list-inside pl-4 text-gray-600">
							<li>{selectedCount - noEmailCount} applicants</li>
							<li>{alternateContactCount} have alternate contacts</li>
						</ul>
					</div>
				</div>

				{noEmailCount > 0 && (
					<p className="text-sm text-gray-600 mb-8">
						{noEmailCount === 1 
							? "1 applicant does not have an email address. You will need to contact them separately. After you send this email, the applicant list will show who you still need to contact."
							: `${noEmailCount} applicants do not have an email address. You will need to contact them separately. After you send this email, the applicant list will show who you still need to contact.`
						}
					</p>
				)}

				<div className="flex justify-end">
					<button
						onClick={handleConfirm}
						disabled={isSendDisabled}
						className="px-6 py-3 border border-transparent rounded-md font-semibold text-white bg-[#0077da] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
					>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M1.33301 1.33301L14.6663 8.66634L1.33301 15.9997V9.99967L10.6663 8.66634L1.33301 7.33301V1.33301Z" fill="white"/>
						</svg>
						SEND NOW
					</button>
				</div>
			</div>
		</div>
	);
};

export default SendDialog;
