import React, { useEffect, useState } from "react";

interface SendDialogProps {
	onClose: () => void;
	onConfirm: (url: string, deadline: string) => void;
	selectedCount: number;
	alternateContactCount: number;
	documentUrl: string;
	deadline: string;
	noEmailCount: number;
}

const SendDialog: React.FC<SendDialogProps> = ({ 
	onClose, 
	onConfirm, 
	selectedCount, 
	alternateContactCount, 
	documentUrl, 
	deadline, 
	noEmailCount 
}) => {
	const getDefaultDeadline = () => {
		const today = new Date();
		const futureDate = new Date(today);
		futureDate.setDate(today.getDate() + 5);
	
		const year = futureDate.getFullYear();
		const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
		const day = String(futureDate.getDate()).padStart(2, '0');
	
		return `${year}-${month}-${day} 11:59 PM`;
	};

	const [isEditingUrl, setIsEditingUrl] = useState(!documentUrl);
	const [isEditingDeadline, setIsEditingDeadline] = useState(!deadline);
	const [currentUrl, setCurrentUrl] = useState(documentUrl);
	const [currentDeadline, setCurrentDeadline] = useState(deadline || getDefaultDeadline());

	const totalRecipients = selectedCount + alternateContactCount;

	const isSendDisabled = !currentUrl || !currentDeadline;

	// Extract just the date part for the input value, e.g., YYYY-MM-DD
	const deadlineDatePart = currentDeadline.split(' ')[0] || '';

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

	const handleConfirm = () => {
		if (!isSendDisabled) {
			onConfirm(currentUrl, currentDeadline);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center font-sans">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative flex flex-col p-8">
				<button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
					<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				<h2 className="text-xl font-semibold text-gray-800 mb-4">Send to selected applicants</h2>
				<p className="text-sm text-gray-600 mb-6">
					When you're ready, send an email to the applicants you selected. If you want, <a href="#" className="text-blue-600 underline">send yourself an example email</a> to preview what applicants will see.
				</p>

				<div className="space-y-4 text-sm mb-6">
					<p><span className="font-semibold">You are sending:</span> Invitation to Apply</p>
					<div>
						<p className="font-semibold">Document upload URL: 
							{!isEditingUrl && <button onClick={() => setIsEditingUrl(true)} className="text-blue-600 underline font-normal ml-2">Edit</button>}
						</p>
						{isEditingUrl ? (
							<input 
								type="text" 
								value={currentUrl} 
								onChange={(e) => setCurrentUrl(e.target.value)} 
								placeholder="https://app.box.com/upload-widget/view/"
								className="border border-gray-300 rounded px-3 py-2 w-full mt-1"
							/>
						) : (
							<p className="text-gray-600 break-all">{currentUrl}</p>
						)}
					</div>
					<div>
						<p className="font-semibold">Deadline: 
							{!isEditingDeadline && <button onClick={() => setIsEditingDeadline(true)} className="text-blue-600 underline font-normal ml-2">Edit</button>}
						</p>
						{isEditingDeadline ? (
							<input 
								type="date" 
								value={deadlineDatePart}
								onChange={(e) => setCurrentDeadline(`${e.target.value} 11:59 PM`)} 
								className="border border-gray-300 rounded px-3 py-2 w-full mt-1"
							/>
						) : (
							<p>{currentDeadline}</p>
						)}
					</div>
					<div>
						<p className="font-semibold">Total recipients: {totalRecipients} people</p>
						<ul className="list-disc list-inside pl-4 text-gray-600">
							<li>{selectedCount} applicants</li>
							<li>{alternateContactCount} have alternate contacts</li>
						</ul>
					</div>
				</div>

				{noEmailCount > 0 && (
					<p className="text-sm text-gray-600 mb-8">
						{noEmailCount} applicants do not have an email address. You will need to contact them separately. After you send this email, the applicant list will show who you still need to contact.
					</p>
				)}

				<div className="flex justify-end">
					<button
						onClick={handleConfirm}
						disabled={isSendDisabled}
						className="px-6 py-3 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
