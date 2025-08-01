import { useState, useEffect, useRef } from "react";
import { 
	createBrowserRouter,
	RouterProvider,
	Outlet,
	Navigate,
	ScrollRestoration,
	useOutletContext,
	useParams,
	useLocation,
} from "react-router-dom";
import { pagedApplicants as initialPagedApplicants, Applicant } from "./data";
import SendDialog from "./components/SendDialog";
import ApplicantList from "./components/ApplicantList";
import ApplicantDetails from "./components/ApplicantDetails";
import ApplicantToolbar from "./components/ApplicantToolbar";
import Header from "./components/Header";
import UploadURLDialog from "./components/UploadURLDialog";
import DeadlineDialog from "./components/DeadlineDialog";
import SendExampleEmailDialog from "./components/SendExampleEmailDialog";
import InlineNotification from "./components/InlineNotification";
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
	const [documentUrl, setDocumentUrl] = useState("");
	const [deadline, setDeadline] = useState("");
	const [noEmailCount, setNoEmailCount] = useState(4);
	const [isUploadURLDialogOpen, setIsUploadURLDialogOpen] = useState(false);
	const [isDeadlineDialogOpen, setIsDeadlineDialogOpen] = useState(false);
	const [isExampleEmailDialogOpen, setIsExampleEmailDialogOpen] = useState(false);
	const [isInSendChain, setIsInSendChain] = useState(false);
	const [showNotification, setShowNotification] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState("");

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

	const calculateDefaultDeadline = () => {
		const date = new Date();
		date.setDate(date.getDate() + 5);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day} 11:59 PM`;
	};

	const handleOpenConfirm = (selectedIds: number[], altCount: number) => {
		console.log('handleOpenConfirm called:', { selectedCount: selectedIds.length, altCount, documentUrl, deadline });
		setDialogSelectedIds(selectedIds);
		setDialogSelectedCount(selectedIds.length);
		setDialogAltContactCount(altCount);
		
		// Calculate how many selected applicants have no email
		const selectedApplicants = pagedApplicants.flat().filter(applicant => selectedIds.includes(applicant.id));
		const noEmailApplicants = selectedApplicants.filter(applicant => applicant.noEmail === true);
		setNoEmailCount(noEmailApplicants.length);
		
		console.log('Setting isInSendChain = true (starting chain)');
		setIsInSendChain(true); // Mark that we're in the send chain
		
		// Check if upload URL is set first
		if (!documentUrl) {
			console.log('Opening UploadURLDialog - no URL set');
			setIsUploadURLDialogOpen(true);
			return;
		}
		
		// Then check if deadline is set
		if (!deadline) {
			console.log('Opening DeadlineDialog - no deadline set');
			setIsDeadlineDialogOpen(true);
			return;
		}
		
		// Both are set, show send dialog
		console.log('Opening SendDialog immediately - both URL and deadline set');
		console.log('Setting isInSendChain = false (exiting chain - immediate send)');
		setIsInSendChain(false); // Exit send chain
		setIsConfirmDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsConfirmDialogOpen(false);
	};

	const handleOpenUploadURLDialog = () => {
		setIsUploadURLDialogOpen(true);
	};

	const handleOpenDeadlineDialog = () => {
		setIsDeadlineDialogOpen(true);
	};

	const handleOpenExampleEmailDialog = () => {
		setIsExampleEmailDialogOpen(true);
	};

	const handleSendExampleEmail = (email: string) => {
		// Here you would typically make an API call to send the example email
		console.log('Sending example email to:', email);
		// Don't close the dialog - let the component handle showing the sent state
	};
	
	const handleCloseNotification = () => {
		setShowNotification(false);
	};

	const handleCancelUploadURL = () => {
		console.log('handleCancelUploadURL called - this should NOT happen during normal save!');
		setIsUploadURLDialogOpen(false);
		// Only reset selection state if we're canceling during the send chain
		if (isInSendChain) {
			console.log('Setting isInSendChain = false (canceling URL during chain)');
			setDialogSelectedIds([]);
			setDialogSelectedCount(0);
			setDialogAltContactCount(0);
			setIsInSendChain(false);
		}
	};

	const handleCancelDeadline = () => {
		console.log('handleCancelDeadline called - this should NOT happen during normal save!', { isInSendChain, dialogSelectedCount });
		setIsDeadlineDialogOpen(false);
		// Only reset selection state if we're canceling during the send chain
		if (isInSendChain) {
			console.log('Setting isInSendChain = false (canceling deadline during chain)');
			setDialogSelectedIds([]);
			setDialogSelectedCount(0);
			setDialogAltContactCount(0);
			setIsInSendChain(false);
		}
	};

	const handleSaveUploadURL = (url: string) => {
		console.log('handleSaveUploadURL called:', { url, isInSendChain, deadline });
		setDocumentUrl(url);
		setIsUploadURLDialogOpen(false);
		
		// Continue the chain: check if deadline is set
		if (isInSendChain) {
			if (!deadline) {
				console.log('Continuing chain to DeadlineDialog');
				setIsDeadlineDialogOpen(true);
			} else {
				console.log('Continuing chain to SendDialog');
				// Both URL and deadline are now set, show send dialog
				console.log('Setting isInSendChain = false (exiting chain - URL save to send)');
				setIsInSendChain(false); // Exit send chain
				setIsConfirmDialogOpen(true);
			}
		} else {
			console.log('Not in send chain after URL save');
		}
	};

	const handleSaveDeadline = (newDeadline: string) => {
		console.log('handleSaveDeadline called:', { newDeadline, isInSendChain, dialogSelectedCount });
		const wasInSendChain = isInSendChain; // Capture current state
		
		setDeadline(newDeadline);
		setIsDeadlineDialogOpen(false);
		
		// Use setTimeout to ensure state updates are processed first
		setTimeout(() => {
			// After setting deadline, show send dialog if we're in the send chain
			if (wasInSendChain) {
				console.log('Opening SendDialog from deadline save');
				console.log('Setting isInSendChain = false (exiting chain - deadline save to send)');
				setIsInSendChain(false); // Exit send chain
				setIsConfirmDialogOpen(true);
			} else {
				console.log('Not in send chain, not opening SendDialog');
			}
		}, 0);
	};

	const handleConfirmSend = () => {
		const newPagedApplicants = pagedApplicants.map((page) =>
			page.map((applicant) =>
				dialogSelectedIds.includes(applicant.id) && !applicant.noEmail
					? {
							...applicant,
							status: "Processing",
							substatus: "📧 Invitation to apply sent",
							updated: new Date().toLocaleDateString("en-US"),
					  }
					: applicant) as Applicant,
		);
		setPagedApplicants(newPagedApplicants);
		
		// Calculate message for notification (matching SendDialog calculation)
		const totalRecipients = dialogSelectedCount + dialogAltContactCount - noEmailCount;
		const applicantsWithEmail = dialogSelectedCount - noEmailCount;
		const applicantsWithoutEmail = noEmailCount;
		
		let message = `Messages sent to ${applicantsWithEmail} applicant${applicantsWithEmail !== 1 ? 's' : ''}`;
		if (dialogAltContactCount > 0) {
			message += ` and ${dialogAltContactCount} alternate contact${dialogAltContactCount !== 1 ? 's' : ''}`;
		}
		if (applicantsWithoutEmail > 0) {
			message += `. ${applicantsWithoutEmail} applicant${applicantsWithoutEmail > 1 ? 's' : ''} did not have email addresses`;
		}
		message += '.';
		
		setNotificationMessage(message);
		setShowNotification(true);
		
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
		documentUrl,
		deadline,
		showNotification,
		notificationMessage,
		handleCloseNotification,
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
						onEditUrl={handleOpenUploadURLDialog}
						onEditDeadline={handleOpenDeadlineDialog}
						onSendExampleEmail={handleOpenExampleEmailDialog}
					/>
				)}
				{isUploadURLDialogOpen && (
					<UploadURLDialog 
						currentUrl={documentUrl}
						onClose={handleCancelUploadURL}
						onSave={handleSaveUploadURL}
					/>
				)}
				{isDeadlineDialogOpen && (
					<DeadlineDialog 
						currentDeadline={deadline}
						onClose={handleCancelDeadline}
						onSave={handleSaveDeadline}
					/>
				)}
				{isExampleEmailDialogOpen && (
					<SendExampleEmailDialog 
						onClose={() => setIsExampleEmailDialogOpen(false)}
						onSend={handleSendExampleEmail}
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
	const location = useLocation();
	const { 
		pagedApplicants,
		currentPage,
		applicants,
		handleNextPage,
		handlePrevPage,
		handlePageInputChange,
		handleUpdateApplicantStatus,
		handleOpenConfirm,
		documentUrl,
		deadline,
		showNotification,
		notificationMessage,
		handleCloseNotification
	} = useOutletContext<any>();
	
	const prevPageRef = useRef(currentPage);

	// Close notification when changing pages
	useEffect(() => {
		if (currentPage !== prevPageRef.current && showNotification) {
			handleCloseNotification();
		}
		prevPageRef.current = currentPage;
	}, [currentPage, showNotification, handleCloseNotification]);

	return (
		<main className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-[4rem] py-8">
			<div className="mb-6">
				<p className="text-sm text-gray-500">Lease Ups &gt; Quincy &gt; Applicant list</p>
				<h2 className="text-3xl font-bold text-gray-800">QUINCY</h2>
				<p className="text-gray-500">555 Bryant St, San Francisco, CA 94107</p>
			</div>

			{showNotification && (
				<div className="mb-4">
					<InlineNotification 
						message={notificationMessage} 
						onClose={handleCloseNotification} 
					/>
				</div>
			)}

			<ApplicantToolbar applicants={applicants} onInvite={handleOpenConfirm} documentUrl={documentUrl} deadline={deadline} />

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
	const { 
		pagedApplicants, 
		handleUpdateApplicantStatus,
		showNotification,
		handleCloseNotification 
	} = useOutletContext<any>();
	const { id } = useParams<{ id: string }>();
	const applicant = findApplicantById(id, pagedApplicants);

	// Close notification when entering applicant details page
	useEffect(() => {
		if (showNotification) {
			handleCloseNotification();
		}
	}, []); // Only run once when component mounts

	return (
		<ApplicantDetails 
			applicant={applicant}
			onUpdateApplicantStatus={handleUpdateApplicantStatus}
		/>
	);
}

export default App;
