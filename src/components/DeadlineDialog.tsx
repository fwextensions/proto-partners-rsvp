import React, { useState } from "react";

interface DeadlineDialogProps {
	onClose: () => void;
	onSave: (deadline: string) => void;
	currentDeadline: string;
}

const DeadlineDialog: React.FC<DeadlineDialogProps> = ({ onClose, onSave, currentDeadline }) => {
	// Extract just the date part for the input value, e.g., YYYY-MM-DD
	const initialDate = currentDeadline.split(' ')[0] || '';
	const [date, setDate] = useState(initialDate);

	const handleSave = () => {
		if (date) {
			onSave(`${date} 11:59 PM`);
			onClose();
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center font-sans">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative flex flex-col">
				{/* Header */}
				<div className="p-8 flex justify-end items-center border-b border-gray-200">
					<button onClick={onClose} className="text-gray-400 hover:text-gray-600">
						<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* Content */}
				<div className="p-12">
					<h2 className="text-lg font-semibold text-gray-900">Set application deadline</h2>
					<p className="text-sm text-gray-600 mt-2">
						Applicants must submit all required documents by this date.
					</p>
					<div className="mt-6">
						<label htmlFor="deadline-date" className="block text-sm font-medium text-gray-700">Application deadline</label>
						<input 
							type="date"
							id="deadline-date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						/>
					</div>
				</div>

				{/* Footer */}
				<div className="px-12 py-6 bg-gray-50 rounded-b-lg flex justify-end">
					<button
						onClick={handleSave}
						disabled={!date}
						className="px-6 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}

export default DeadlineDialog;
