import { useState } from "react";
import { pagedApplicants } from "./data";

function App() {
	const [currentPage, setCurrentPage] = useState(1);
	const [selected, setSelected] = useState<number[]>([]);
	const [lastCheckedIndex, setLastCheckedIndex] = useState<number | null>(null);

	const applicants = pagedApplicants[currentPage - 1];

	const handlePageChange = (newPage: number) => {
		if (newPage > 0 && newPage <= pagedApplicants.length) {
			setCurrentPage(newPage);
			setSelected([]);
			setLastCheckedIndex(null);
		}
	};

	const handleSelect = (
		id: number,
		index: number,
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.nativeEvent.shiftKey && lastCheckedIndex !== null) {
			const start = Math.min(lastCheckedIndex, index);
			const end = Math.max(lastCheckedIndex, index);
			const rangeIds = applicants.slice(start, end + 1).map((a) => a.id);

			const isChecking = !selected.includes(id);

			setSelected((prev) => {
				const newSelected = new Set(prev);
				rangeIds.forEach((rangeId) => {
					if (isChecking) {
						newSelected.add(rangeId);
					} else {
						newSelected.delete(rangeId);
					}
				});
				return Array.from(newSelected);
			});
		} else {
			setSelected((prev) =>
				prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
			);
		}

		setLastCheckedIndex(index);
	};

	const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			setSelected(applicants.map((a) => a.id));
		} else {
			setSelected([]);
		}
	};

	return (
		<div className="bg-gray-50 min-h-screen font-sans">
			{/* Header */}
			<header className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center space-x-4">
							<div className="bg-blue-600 p-3 rounded-md">
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
									></path>
								</svg>
							</div>
							<h1 className="text-xl font-semibold text-gray-800">
								DAHLIA PARTNERS
							</h1>
						</div>
						<nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
							<a href="#" className="hover:text-blue-600">
								LISTINGS
							</a>
							<a href="#" className="hover:text-blue-600">
								APPLICATIONS
							</a>
							<a href="#" className="hover:text-blue-600">
								PENDING FLAGGED APPS
							</a>
							<a href="#" className="hover:text-blue-600">
								MARKED DUPLICATE APPS
							</a>
							<a
								href="#"
								className="text-blue-600 border-b-2 border-blue-600 pb-1"
							>
								LEASE UPS
							</a>
						</nav>
						<a href="#" className="text-sm font-medium text-gray-600">
							SIGN OUT
						</a>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Page Title */}
				<div className="mb-6">
					<p className="text-sm text-gray-500">
						Lease Ups &gt; Quincy &gt; Applicant list
					</p>
					<h2 className="text-3xl font-bold text-gray-800">QUINCY</h2>
					<p className="text-gray-500">
						555 Bryant St, San Francisco, CA 94107
					</p>
				</div>

				{/* Actions and Search */}
				<div className="flex justify-between items-center mb-4">
					<div className="flex space-x-2">
						<input
							type="checkbox"
							className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							onChange={handleSelectAll}
							checked={selected.length === applicants.length && applicants.length > 0}
						/>
						<button className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700">
							SET STATUS
						</button>
						<button className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700">
							ADD COMMENT
						</button>
						<button className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700">
							SEND EMAIL
						</button>
					</div>
					<div className="flex space-x-2">
						<input
							type="text"
							placeholder="Application, First Name, Last name..."
							className="px-4 py-2 border border-gray-300 rounded-md"
						/>
						<button className="px-4 py-2 bg-gray-600 text-white rounded-md">
							SEARCH
						</button>
						<button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md flex items-center">
							SHOW FILTERS
						</button>
					</div>
				</div>

				{/* Table */}
				<div className="bg-white shadow-md rounded-lg overflow-hidden">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="w-12"></th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Rank
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Application
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									First Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Last Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									HH
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Requests
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Updated
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Latest Substatus
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="w-12"></th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{applicants.map((applicant, index) => (
								<tr key={applicant.id}>
									<td className="pl-4">
										<input
											type="checkbox"
											className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											checked={selected.includes(applicant.id)}
											onChange={(e) => handleSelect(applicant.id, index, e)}
										/>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{applicant.rank}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
										{applicant.applicationId}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{applicant.firstName}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{applicant.lastName}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{applicant.hh}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{applicant.requests}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{applicant.updated}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{applicant.latestSubstatus}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										<select className="border-gray-300 rounded-md">
											<option>STATUS</option>
										</select>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										...
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="flex justify-between items-center mt-4">
					<button
						className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50"
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						PREVIOUS
					</button>
					<div>
						Page{" "}
						<input
							type="number"
							value={currentPage}
							onChange={(e) => handlePageChange(Number(e.target.value))}
							className="w-12 text-center border-gray-300 rounded-md"
						/>{" "}
						of {pagedApplicants.length}
					</div>
					<button
						className="px-4 py-2 border border-blue-500 text-white bg-blue-600 rounded-md disabled:opacity-50"
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === pagedApplicants.length}
					>
						NEXT
					</button>
				</div>
			</main>
		</div>
	);
}

export default App;
