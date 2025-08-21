import React, { useState, useEffect } from "react";
import { Applicant } from "../data";

interface UploadURLsDialogProps {
	applicants: Applicant[];
	onClose: () => void;
	onNext: (urlMappings: { [applicantId: number]: string }) => void;
}

const UploadURLsDialog: React.FC<UploadURLsDialogProps> = ({ applicants, onClose, onNext }) => {
	const [urlMappings, setUrlMappings] = useState<{ [applicantId: number]: string }>({});
	const [validationErrors, setValidationErrors] = useState<{ [applicantId: number]: string }>({});

	// Initialize URL mappings with existing URLs from applicants
	useEffect(() => {
		const initialMappings: { [applicantId: number]: string } = {};
		applicants.forEach(applicant => {
			if (applicant.uploadUrl) {
				initialMappings[applicant.id] = applicant.uploadUrl;
			}
		});
		setUrlMappings(initialMappings);
	}, [applicants]);

	const validateUrl = (url: string): string => {
		// Disabled URL validation for prototype
		return "";
	};

	const handleUrlChange = (applicantId: number, url: string) => {
		setUrlMappings(prev => ({
			...prev,
			[applicantId]: url
		}));

		// Validate the URL
		const error = validateUrl(url);
		setValidationErrors(prev => ({
			...prev,
			[applicantId]: error
		}));
	};

	const handleNext = () => {
		// Check if there are any validation errors
		const hasErrors = Object.values(validationErrors).some(error => error !== "");
		if (hasErrors) {
			return; // Don't proceed if there are validation errors
		}

		onNext(urlMappings);
	};

	const handleCancel = () => {
		onClose();
	};

	// Handle ESC key
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
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center font-sans" onClick={onClose}>
			<div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
				{/* Header */}
				<div className="p-6 border-b border-gray-200 flex justify-between items-center">
					<h2 className="text-xl font-semibold text-gray-800">Set Upload URLs</h2>
					<button onClick={onClose} className="text-gray-400 hover:text-gray-600">
						<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* Content */}
				<div className="p-6 flex-1 overflow-auto">
					<p className="text-sm text-gray-600 mb-6">
						Enter individual upload URLs for each selected applicant. These URLs will be included in their invitation emails.
					</p>

					<div className="bg-white shadow-md rounded-lg overflow-hidden">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload URL</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{applicants.map((applicant, index) => (
									<tr key={applicant.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.rank}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{applicant.applicationId}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{applicant.firstName} {applicant.lastName}</td>
										<td className="px-6 py-4 text-sm">
											<div className="flex flex-col">
												<input
													type="text"
													value={urlMappings[applicant.id] || ""}
													onChange={(e) => handleUrlChange(applicant.id, e.target.value)}
													placeholder="https://example.com/upload"
													className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
												/>
												{validationErrors[applicant.id] && (
													<span className="text-red-500 text-xs mt-1">{validationErrors[applicant.id]}</span>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Footer */}
				<div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-4">
					<button
						onClick={handleCancel}
						className="px-6 py-2 bg-gray-50 border-2 border-gray-50 rounded text-blue-600 font-semibold hover:bg-gray-100"
					>
						Cancel
					</button>
					<button
						onClick={handleNext}
						className="px-6 py-2 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						style={{ backgroundColor: '#0077da' }}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default UploadURLsDialog;