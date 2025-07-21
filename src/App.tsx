import { useState } from "react";
import { pagedApplicants as initialPagedApplicants } from "./data";
import ConfirmationDialog from "./components/ConfirmationDialog";
import ApplicantList from "./components/ApplicantList";
import ApplicantToolbar from "./components/ApplicantToolbar";
import Header from "./components/Header";
import { Status } from "./statuses";
import { SelectionProvider } from "./contexts/SelectionContext";

function App() {
	const [pagedApplicants, setPagedApplicants] = useState(initialPagedApplicants);
	const [currentPage, setCurrentPage] = useState(1);
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [dialogSelectedCount, setDialogSelectedCount] = useState(0);
	const [dialogAltContactCount, setDialogAltContactCount] = useState(0);

	const applicants = pagedApplicants[currentPage - 1];

	const handleNextPage = () => {
		if (currentPage < pagedApplicants.length) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === "") {
			setCurrentPage(0);
		} else {
			const page = parseInt(value, 10);
			if (page > 0 && page <= pagedApplicants.length) {
				setCurrentPage(page);
			}
		}
	};

	const handleUpdateApplicantStatus = (applicantId: number, newStatus: Status) => {
		const newPagedApplicants = pagedApplicants.map((page) =>
			page.map((applicant) =>
				applicant.id === applicantId
					? { ...applicant, status: newStatus, updated: new Date().toLocaleDateString("en-US") }
					: applicant
			)
		);
		setPagedApplicants(newPagedApplicants);
	};

	const handleOpenConfirm = (selectedIds: number[], altCount: number) => {
		setDialogSelectedCount(selectedIds.length);
		setDialogAltContactCount(altCount);
		setIsConfirmDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsConfirmDialogOpen(false);
	};

	const handleConfirmSend = () => {
		// we'll add the logic to update applicant state later
		console.log("Email sent!");
		setIsConfirmDialogOpen(false);
	};

	return (
		<SelectionProvider items={applicants}>
			<div className="font-sans bg-gray-50 min-h-screen">
				<Header />
				<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="mb-6">
						<p className="text-sm text-gray-500">Lease Ups &gt; Quincy &gt; Applicant list</p>
						<h2 className="text-3xl font-bold text-gray-800">QUINCY</h2>
						<p className="text-gray-500">555 Bryant St, San Francisco, CA 94107</p>
					</div>

					<ApplicantToolbar applicants={applicants} onInvite={handleOpenConfirm} />

					<ApplicantList
						applicants={applicants}
						onUpdateApplicantStatus={handleUpdateApplicantStatus}
					/>

					<div className="flex justify-between items-center mt-4">
						<button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50" onClick={handlePrevPage} disabled={currentPage <= 1}>PREVIOUS</button>
						<div>
							Page
							<input type="text" value={currentPage > 0 ? currentPage : ""} onChange={handlePageInputChange} className="w-12 text-center border-gray-300 rounded-md" />
							of {pagedApplicants.length}
						</div>
						<button className="px-4 py-2 border border-blue-500 text-white bg-blue-600 rounded-md disabled:opacity-50" onClick={handleNextPage} disabled={currentPage >= pagedApplicants.length}>NEXT</button>
					</div>
				</main>

				{isConfirmDialogOpen && (
					<ConfirmationDialog onClose={handleCloseDialog} onConfirm={handleConfirmSend} selectedCount={dialogSelectedCount} alternateContactCount={dialogAltContactCount} />
				)}
			</div>
		</SelectionProvider>
	);
}

export default App;
