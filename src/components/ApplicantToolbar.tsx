import React, { useState } from "react";
import { useSelectionContext } from "../contexts/SelectionContext";
import DropdownMenu from "./DropdownMenu";
import { Applicant } from "../data";

interface ApplicantToolbarProps {
	applicants: Applicant[];
	onInvite: (selectedIds: number[], alternateContactCount: number) => void;
	documentUrl: string;
	deadline: string;
}

const ApplicantToolbar: React.FC<ApplicantToolbarProps> = ({ applicants, onInvite, documentUrl, deadline }) => {
	const { selectedIds, isAllSelected, handleSelectAll } = useSelectionContext();
	const [isEmailDropdownOpen, setIsEmailDropdownOpen] = useState(false);

	const alternateContactCount = applicants.filter(
		(applicant) => selectedIds.includes(applicant.id) && applicant.hasAlternateContact,
	).length;

	return (
		<div className="flex justify-between items-center mb-4">
			<div className="flex items-center space-x-2">
				<input
					type="checkbox"
					className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					onChange={handleSelectAll}
					checked={isAllSelected}
				/>
				<button 
					className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50"
					disabled={selectedIds.length === 0}
				>
					SET STATUS
				</button>
				<button 
					className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50"
					disabled={selectedIds.length === 0}
				>
					ADD COMMENT
				</button>
				<div className="relative">
					<button
						onClick={() => setIsEmailDropdownOpen(!isEmailDropdownOpen)}
						className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 flex items-center disabled:opacity-50"
						disabled={selectedIds.length === 0}
					>
						SEND EMAIL
						<svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								fillRule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
					{isEmailDropdownOpen && (
						<DropdownMenu onClose={() => setIsEmailDropdownOpen(false)}>
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									setIsEmailDropdownOpen(false);
									onInvite(selectedIds, alternateContactCount);
								}}
								className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold"
							>
								{!documentUrl || !deadline ? "Set up Invitation to Apply" : "Invite to apply"}
							</a>
						</DropdownMenu>
					)}
				</div>
			</div>
			<div className="flex space-x-2">
				<input
					type="text"
					placeholder="Application, First Name, Last name..."
					className="px-4 py-2 border border-gray-300 rounded-md"
				/>
				<button className="px-4 py-2 bg-gray-600 text-white rounded-md">SEARCH</button>
				<button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md flex items-center">SHOW FILTERS</button>
			</div>
		</div>
	);
};

export default ApplicantToolbar;
