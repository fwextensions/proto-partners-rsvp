import { useState } from "react";
import { 
	createBrowserRouter,
	RouterProvider,
	Outlet,
	Navigate,
	ScrollRestoration,
	useOutletContext,
	useParams,
} from "react-router-dom";
import { pagedApplicants as initialPagedApplicants, Applicant } from "./data";
import SendDialog from "./components/SendDialog";
import ApplicantList from "./components/ApplicantList";
import ApplicantDetails from "./components/ApplicantDetails";
import ApplicantToolbar from "./components/ApplicantToolbar";
import Header from "./components/Header";
import { Status } from "./statuses";
import { SelectionProvider } from "./contexts/SelectionContext";

// Find an applicant by ID across all pages
const findApplicantById = (id: string | undefined, pagedApplicants: Applicant[][]): Applicant | null => {
	if (!id) return null;
	for (const page of pagedApplicants) {
		const applicant = page.find(a => a.applicationId === id);
		if (applicant) return applicant;
	}
	return null;
};


function Root() {
	const [pagedApplicants, setPagedApplicants] = useState(initialPagedApplicants);
	const [currentPage, setCurrentPage] = useState(1);
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [dialogSelectedCount, setDialogSelectedCount] = useState(0);
	const [dialogAltContactCount, setDialogAltContactCount] = useState(0);
	const [dialogSelectedIds, setDialogSelectedIds] = useState<number[]>([]);
	const [selectionKey, setSelectionKey] = useState(0);

	// Hardcoded data based on the screenshot for now
	const [documentUrl, setDocumentUrl] = useState("");
	const [deadline, setDeadline] = useState("");
	const [noEmailCount, setNoEmailCount] = useState(4);

	const applicants = pagedApplicants[currentPage - 1] || [];

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
		setDialogSelectedIds(selectedIds);
		setDialogSelectedCount(selectedIds.length);
		setDialogAltContactCount(altCount);
		setIsConfirmDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsConfirmDialogOpen(false);
	};

	const handleConfirmSend = (newUrl: string, newDeadline: string) => {
		setDocumentUrl(newUrl);
		setDeadline(newDeadline);

		const newPagedApplicants = pagedApplicants.map((page) =>
			page.map((applicant) =>
				(dialogSelectedIds.includes(applicant.id)
					? {
							...applicant,
							status: "Processing",
							substatus: "📧 Invitation to apply sent",
							updated: new Date().toLocaleDateString("en-US"),
					  }
					: applicant) as Applicant,
			)
		);
		setPagedApplicants(newPagedApplicants);
		// clear selection by re-mounting provider
		setSelectionKey((k) => k + 1);
		setIsConfirmDialogOpen(false);
	};

	const context = {
		pagedApplicants,
		currentPage,
		applicants,
		handleNextPage,
		handlePrevPage,
		handlePageInputChange,
		handleUpdateApplicantStatus,
		handleOpenConfirm,
	};

	return (
		<SelectionProvider key={selectionKey} items={applicants}>
			<ScrollRestoration />
			<div className="font-sans bg-gray-50 min-h-screen">
				<Header />
				<Outlet context={context} />
				{isConfirmDialogOpen && (
					<SendDialog 
						onClose={handleCloseDialog} 
						onConfirm={handleConfirmSend} 
						selectedCount={dialogSelectedCount} 
						alternateContactCount={dialogAltContactCount}
						documentUrl={documentUrl}
						deadline={deadline}
						noEmailCount={noEmailCount}
					/>
				)}
			</div>
		</SelectionProvider>
	);
}

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				index: true,
				element: <ApplicantListPage />
			},
			{
				path: "/applicants/:id",
				element: <ApplicantDetailsPage />
			},
			{
				path: "*",
				element: <Navigate to="/" replace />
			}
		]
	}
]);

function App() {
	return <RouterProvider router={router} />;
}

function ApplicantListPage() {
	const { 
		pagedApplicants,
		currentPage,
		applicants,
		handleNextPage,
		handlePrevPage,
		handlePageInputChange,
		handleUpdateApplicantStatus,
		handleOpenConfirm
	} = useOutletContext<any>();

	return (
		<main className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-[4rem] py-8">
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
	);
}

function ApplicantDetailsPage() {
	const { pagedApplicants, handleUpdateApplicantStatus } = useOutletContext<any>();
	const { id } = useParams<{ id: string }>();
	const applicant = findApplicantById(id, pagedApplicants);

	return (
		<ApplicantDetails 
			applicant={applicant}
			onUpdateApplicantStatus={handleUpdateApplicantStatus}
		/>
	);
}

export default App;
