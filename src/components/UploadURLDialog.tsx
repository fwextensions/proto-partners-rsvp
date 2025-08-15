import React, { useState } from "react";

interface UploadURLDialogProps {
	onClose: () => void;
	onSave: (url: string) => void;
	currentUrl: string;
}

const UploadURLDialog: React.FC<UploadURLDialogProps> = ({ onClose, onSave, currentUrl }) => {
	const [url, setUrl] = useState(currentUrl);

	const handleSave = () => {
		if (url) {
			onSave(url);
			// Don't call onClose() here - let the parent handle closing after save
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
					<h2 className="text-lg font-semibold text-gray-900">Set document upload URL</h2>
					<p className="text-sm text-gray-600 mt-2">
						This URL will be sent to applicants so they can upload required documents. You will only have to enter this once per listing.
					</p>
					<div className="mt-6">
						<label htmlFor="upload-url" className="block text-sm font-medium text-gray-700">Document upload URL</label>
						<input 
							type="text"
							id="upload-url"
							value={url}
							autoFocus={true}
							onChange={(e) => setUrl(e.target.value)}
							placeholder="https://app.box.com/upload-widget/view/"
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						/>
					</div>
				</div>

				{/* Footer */}
				<div className="px-12 py-6 bg-gray-50 rounded-b-lg flex justify-end gap-4">
					<button
						onClick={onClose}
						className="px-6 py-2 bg-gray-50 border-2 border-gray-50 rounded text-blue-600 font-semibold hover:bg-gray-100"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={!url}
						className="px-6 py-2 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
						style={{ backgroundColor: '#0077da' }}
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}

export default UploadURLDialog;
