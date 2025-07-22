import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Applicant } from "../data";
import { useSelectionContext } from "../contexts/SelectionContext";
import StatusMenu from "./StatusMenu";
import { Status } from "../statuses.ts";
import CommentIcon from "./CommentIcon"; // Assuming CommentIcon is in the same directory

interface ApplicantListProps {
	applicants: Applicant[];
	onUpdateApplicantStatus: (id: number, newStatus: Status) => void;
}

const ApplicantList: React.FC<ApplicantListProps> = ({ applicants, onUpdateApplicantStatus }) => {
	const { selectedIds, handleCheckboxChange } = useSelectionContext();
	const navigate = useNavigate();

	const handleRowClick = (applicationId: string) => {
		navigate(`/applicants/${applicationId}`);
	};

	return (
		<>
			<div className="bg-white shadow-md rounded-lg overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="w-12"></th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HH</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Substatus</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
							<th className="w-12"></th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{applicants.map((applicant, index) => (
							<tr 
								key={applicant.id} 
								className={`${selectedIds.includes(applicant.id) ? "bg-blue-50" : ""} cursor-pointer hover:bg-gray-50`}
								onClick={(e) => {
									// Don't navigate if clicking on checkbox or status menu
									if (
										(e.target as HTMLElement).closest('input[type="checkbox"]') ||
										(e.target as HTMLElement).closest('.status-menu')
									) {
										return;
									}
									handleRowClick(applicant.applicationId);
								}}
							>
								<td className="pl-4" onClick={(e) => e.stopPropagation()}>
									<input
										type="checkbox"
										checked={selectedIds.includes(applicant.id)}
										onChange={(e) => handleCheckboxChange(index, applicant.id, e)}
										className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
									/>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.rank}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
									<Link to={`/applicants/${applicant.applicationId}`}>{applicant.applicationId}</Link>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									<Link to={`/applicants/${applicant.applicationId}`}>{applicant.firstName}</Link>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									<Link to={`/applicants/${applicant.applicationId}`}>{applicant.lastName}</Link>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.hh}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.requests}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{applicant.updated ? applicant.updated : <em className="italic text-gray-400">none</em>}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.substatus}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" onClick={(e) => e.stopPropagation()}>
									<div className="status-menu">
										<StatusMenu currentStatus={applicant.status} onUpdateStatus={(newStatus) => onUpdateApplicantStatus(applicant.id, newStatus)} />
									</div>
								</td>
								<td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500" onClick={(e) => e.stopPropagation()}>
									<CommentIcon className="w-5 h-5" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default ApplicantList;
