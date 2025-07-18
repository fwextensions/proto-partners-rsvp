import React, { useEffect } from "react";

interface ConfirmationDialogProps {
	onClose: () => void;
	onConfirm: () => void;
	selectedCount: number;
	alternateContactCount: number;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ onClose, onConfirm, selectedCount, alternateContactCount }) => {
	const totalRecipients = selectedCount + alternateContactCount;

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" || (event.key === "." && event.metaKey)) {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [onClose]);

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative font-sans">
				<button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
					<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				<h2 className="text-lg font-bold text-gray-900">Send email to applicants</h2>
				<div className="mt-4 text-sm text-gray-600 space-y-2">
					<p>You are about to send an email to {totalRecipients} {totalRecipients === 1 ? "recipient" : "recipients"}.</p>
					<ul className="list-disc list-inside pl-2">
						<li>{selectedCount} selected applicants</li>
						<li>{alternateContactCount} have alternate contacts</li>
					</ul>
				</div>
				<div className="mt-6 flex justify-end space-x-3">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Send now
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationDialog;
