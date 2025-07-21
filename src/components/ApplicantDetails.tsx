import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Applicant } from "../data";
import StatusMenu from "./StatusMenu";
import { Status } from "../statuses";

interface ApplicantDetailsProps {
	findApplicantById: (id: string) => Applicant | null;
	onUpdateApplicantStatus?: (id: number, newStatus: Status) => void;
}

const ApplicantDetails: React.FC<ApplicantDetailsProps> = ({ findApplicantById, onUpdateApplicantStatus }) => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const applicant = findApplicantById(id || "");

	if (!applicant) {
		return <div className="text-center py-10">Applicant not found</div>;
	}

	const handleStatusChange = (newStatus: Status) => {
		if (onUpdateApplicantStatus && applicant) {
			onUpdateApplicantStatus(applicant.id, newStatus);
		}
	};

	return (
		<div className="bg-gray-50 min-h-screen">
			<div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-[4rem] py-4">
				{/* Back button */}
				<button 
					onClick={() => navigate(-1)} 
					className="text-blue-600 text-sm font-medium mb-4 flex items-center"
				>
					&lt; BACK TO LIST
				</button>

				{/* Applicant header */}
				<h1 className="text-2xl font-bold text-gray-800 mb-6">
					{applicant.applicationId}: {applicant.firstName.toUpperCase()} {applicant.lastName.toUpperCase()}
				</h1>

				{/* Tabs */}
				<div className="border-b border-gray-200 mb-6">
					<div className="flex">
						<button className="px-4 py-2 border-b-2 border-blue-600 font-medium text-blue-600">
							SUPPLEMENTAL INFORMATION
						</button>
						<button className="px-4 py-2 text-gray-500">
							ELIGIBILITY / LEASE UP
						</button>
					</div>
				</div>

				<div className="flex justify-between mb-6">
					<h2 className="text-xl font-bold text-gray-800">Preferences and Priorities</h2>
					<div className="flex gap-2">
						<StatusMenu 
							currentStatus={applicant.status || ""} 
							onUpdateStatus={handleStatusChange} 
						/>
						<button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold">
							ADD A COMMENT
						</button>
					</div>
				</div>

				{/* Preferences description */}
				<div className="bg-white p-6 rounded-lg shadow-sm mb-6">
					<p className="text-gray-700 mb-4">
						Complete this section first. The most significant claimed preferences before sending out a rental listing.
						These preferences may qualify the applicant for specific units and determine their position on the waitlist.
					</p>
					
					<ul className="list-disc pl-6 text-gray-700 mb-6">
						<li className="mb-2">Preferences must be verified at the time of listing preference verification.</li>
						<li className="mb-2">Applicant must provide proof for each preference claimed (e.g. proof of address).</li>
						<li className="mb-2">Staff should update the status for each preference after verification.</li>
					</ul>

					{/* Confirmed Preferences */}
					<h3 className="font-bold text-gray-800 mb-4">Confirmed Preferences</h3>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200 mb-6">
							<thead>
								<tr className="bg-gray-50">
									<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Preference</th>
									<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Claimant</th>
									<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
									<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Proof</th>
									<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
									<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"></th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								<tr>
									<td className="px-4 py-2 text-sm">Live in San Francisco Preference</td>
									<td className="px-4 py-2 text-sm">Head</td>
									<td className="px-4 py-2 text-sm">{applicant.firstName} {applicant.lastName}</td>
									<td className="px-4 py-2 text-sm">Paystub</td>
									<td className="px-4 py-2 text-sm text-blue-600">VERIFIED</td>
									<td className="px-4 py-2 text-sm text-blue-600">EDIT</td>
								</tr>
							</tbody>
						</table>
					</div>

					{/* Application Signature */}
					<h3 className="font-bold text-gray-800 mb-4">Application Signature</h3>
					<p className="text-gray-700 mb-4">
						Complete this section to verify the date of the applicant's signature on the application. 
						If the applicant did not sign the application, you can request that they do so.
					</p>
					
					<div className="flex gap-4 mb-6">
						<div className="w-1/3 max-w-xs">
							<label className="block text-sm font-medium text-gray-700 mb-1">Signature Date</label>
							<div className="flex gap-2">
								<input type="text" placeholder="MM" className="border border-gray-300 rounded px-3 py-2 w-16" />
								<span className="self-center">/</span>
								<input type="text" placeholder="DD" className="border border-gray-300 rounded px-3 py-2 w-16" />
								<span className="self-center">/</span>
								<input type="text" placeholder="YYYY" className="border border-gray-300 rounded px-3 py-2 w-20" />
							</div>
						</div>
					</div>
				</div>

				{/* Household Reserved and Priority Units */}
				<h2 className="text-xl font-bold text-gray-800 mb-4">Household Reserved and Priority Units</h2>
				<div className="bg-white p-6 rounded-lg shadow-sm mb-6">
					<div className="grid grid-cols-2 gap-8">
						<div>
							<h3 className="font-bold text-gray-800 mb-4">Household Unit Priorities</h3>
							<div className="space-y-2">
								<div className="flex items-center">
									<input type="checkbox" id="mobility-impairment" className="h-4 w-4 mr-2" />
									<label htmlFor="mobility-impairment" className="text-gray-700">Mobility Impairments</label>
								</div>
								<div className="flex items-center">
									<input type="checkbox" id="vision-impairment" className="h-4 w-4 mr-2" />
									<label htmlFor="vision-impairment" className="text-gray-700">Vision Impairments</label>
								</div>
								<div className="flex items-center">
									<input type="checkbox" id="hearing-impairment" className="h-4 w-4 mr-2" />
									<label htmlFor="hearing-impairment" className="text-gray-700">Hearing Impairments</label>
								</div>
							</div>
						</div>
						<div>
							<h3 className="font-bold text-gray-800 mb-4">Household Member Priorities</h3>
							<div className="space-y-2">
								<div className="flex items-center">
									<input type="checkbox" id="senior-household" className="h-4 w-4 mr-2" />
									<label htmlFor="senior-household" className="text-gray-700">Senior in Household</label>
								</div>
								<div className="flex items-center">
									<input type="checkbox" id="children-household" className="h-4 w-4 mr-2" />
									<label htmlFor="children-household" className="text-gray-700">Children in Household</label>
								</div>
								<div className="flex items-center">
									<input type="checkbox" id="developmental-disability" className="h-4 w-4 mr-2" />
									<label htmlFor="developmental-disability" className="text-gray-700">Person with Developmental Disability in Household</label>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Income */}
				<h2 className="text-xl font-bold text-gray-800 mb-4">Income</h2>
				<div className="bg-white p-6 rounded-lg shadow-sm mb-6">
					<p className="text-gray-700 mb-4">
						Complete this section to verify the household's income eligibility. You must include all
						sources of income for all household members.
					</p>

					<h3 className="font-bold text-gray-800 mb-4">Confirmed Household Income</h3>
					<div className="mb-4">
						<p className="text-gray-700 mb-2">Household receives a recurring income or subsidy</p>
						<div className="flex gap-4">
							<div className="flex items-center">
								<input type="radio" id="income-yes" name="income" className="h-4 w-4 mr-2" />
								<label htmlFor="income-yes" className="text-gray-700">Yes</label>
							</div>
							<div className="flex items-center">
								<input type="radio" id="income-no" name="income" className="h-4 w-4 mr-2" />
								<label htmlFor="income-no" className="text-gray-700">No</label>
							</div>
						</div>
					</div>

					<div className="space-y-4 mb-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Included Income from Assets</label>
							<input type="text" placeholder="Dollar Amount" className="border border-gray-300 rounded px-3 py-2 w-full max-w-md" />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Total Household Liquid Assets</label>
							<input type="text" placeholder="Dollar Amount" className="border border-gray-300 rounded px-3 py-2 w-full max-w-md" />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Confirmed Total Household Annual Income</label>
							<input type="text" placeholder="Dollar Amount" className="border border-gray-300 rounded px-3 py-2 w-full max-w-md" />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Final Household Annual Income</label>
							<input type="text" placeholder="Dollar Amount" className="border border-gray-300 rounded px-3 py-2 w-full max-w-md" />
						</div>
						<div>
							<p className="text-gray-500 text-sm">Only required income from assets, if applicable.</p>
						</div>
					</div>

					<h3 className="font-bold text-gray-800 mb-4">Area Median Income</h3>
					<div className="space-y-4 mb-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Household AMI Percentage</label>
							<input type="text" placeholder="Enter Percentage" className="border border-gray-300 rounded px-3 py-2 w-full max-w-md" />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">AMI Chart Year</label>
							<select className="border border-gray-300 rounded px-3 py-2 w-full max-w-md">
								<option>Select One...</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">AMI Chart Type</label>
							<select className="border border-gray-300 rounded px-3 py-2 w-full max-w-md">
								<option>Select One...</option>
							</select>
						</div>
					</div>
				</div>

				{/* Demographics */}
				<h2 className="text-xl font-bold text-gray-800 mb-4">Demographics</h2>
				<div className="bg-white p-6 rounded-lg shadow-sm mb-6">
					<p className="text-gray-700 mb-4">
						Complete this section to record the demographic information for the household. You must complete this
						section to be able to create a lease.
					</p>

					<div className="space-y-4 mb-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Number of Dependents</label>
							<select className="border border-gray-300 rounded px-3 py-2 w-full max-w-md">
								<option>Select One...</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Number of Minors</label>
							<select className="border border-gray-300 rounded px-3 py-2 w-full max-w-md">
								<option>Select One...</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Number of Seniors</label>
							<select className="border border-gray-300 rounded px-3 py-2 w-full max-w-md">
								<option>Select One...</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Primary Applicant Marital Status</label>
							<select className="border border-gray-300 rounded px-3 py-2 w-full max-w-md">
								<option>Select One...</option>
							</select>
						</div>
					</div>
				</div>

				{/* Lease */}
				<h2 className="text-xl font-bold text-gray-800 mb-4">Lease</h2>
				<div className="bg-white p-6 rounded-lg shadow-sm mb-6">
					<p className="text-gray-700 mb-4">
						Once you have completed all required fields, you can create a lease for this household.
						The lease will be generated with all the information you have entered.
					</p>

					<button className="bg-blue-600 text-white px-6 py-2 rounded font-medium">
						CREATE LEASE
					</button>
				</div>
			</div>
		</div>
	);
};

export default ApplicantDetails;
