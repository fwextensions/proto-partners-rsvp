import React, { useState } from "react";

interface SendExampleEmailDialogProps {
	onClose: () => void;
	onSend: (email: string) => void;
}

const SendExampleEmailDialog: React.FC<SendExampleEmailDialogProps> = ({ onClose, onSend }) => {
	const [email, setEmail] = useState("");
	const [isSent, setIsSent] = useState(false);

	const handleSend = () => {
		if (email) {
			onSend(email);
			setIsSent(true);
		}
	};

	const handleDone = () => {
		onClose();
	};

	const isSendDisabled = !email;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center font-sans">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative flex flex-col" style={{ boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2)' }}>
				{/* Header */}
				<div className="pt-8 px-12 flex justify-end items-center">
					<button onClick={onClose} className="text-blue-500 hover:text-blue-600">
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* Success Toast */}
				{isSent && (
					<div className="bg-[#b4e5be] flex flex-row items-center justify-between p-4 w-full">
						<div className="flex flex-row gap-3 items-center">
							<div className="size-5">
								<svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
							</div>
							<p className="text-[#222222] text-[13px] leading-[1.5]">
								Example email sent to {email}
							</p>
						</div>
					</div>
				)}

				{/* Content */}
				<div className="px-12 py-8">
					<div className="flex flex-col gap-4 w-full">
						<div className="flex flex-col gap-2">
							<h2 className="text-lg font-semibold text-[#30383a] leading-[1.25]" style={{ fontSize: '18px' }}>
								See an example
							</h2>
							<p className="text-base text-[#222222] leading-[1.5]" style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '16px' }}>
								Send yourself an example email to see what {isSent ? 'recipients' : 'applicants'} will see when they get an Invitation to Apply.
							</p>
						</div>
						
						<div className="flex flex-col gap-2 w-full">
							<label htmlFor="email" className="text-[#555555] text-sm leading-[21px]" style={{ fontSize: '14px' }}>
								Email address
							</label>
							<div className="flex flex-col gap-1 w-full">
								<input
									type="email"
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder=""
									className="w-full bg-[#f9f9f9] border border-[#dedee0] rounded px-3.5 py-[11px] text-base text-[#222222] focus:outline-none focus:ring-2 focus:ring-blue-500"
									style={{ fontSize: '16px', lineHeight: '24px' }}
								/>
								<p className="text-[#767676] text-[13px] leading-[19.5px]">
									Enter your own email address, or send it to a colleague.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex flex-row gap-4 h-[95px] items-center justify-end px-[22px] py-6 bg-[#f5f8f9] rounded-b-lg">
					{!isSent ? (
						<>
							<button
								onClick={onClose}
								className="h-[47px] w-[110px] bg-[#f5f8f9] border-2 border-[#f5f8f9] rounded text-[#0077da] font-bold text-[13px] tracking-[1.86px] uppercase hover:bg-gray-100"
							>
								Cancel
							</button>
							<button
								onClick={handleSend}
								disabled={isSendDisabled}
								className="bg-[#0077da] px-6 py-[15px] h-[47px] rounded text-white font-bold text-[13px] tracking-[1.86px] uppercase hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								Send example email
							</button>
						</>
					) : (
						<>
							<button
								onClick={onClose}
								className="h-[47px] w-[110px] bg-[#f5f8f9] border-2 border-[#f5f8f9] rounded text-[#0077da] font-bold text-[13px] tracking-[1.86px] uppercase hover:bg-gray-100"
							>
								Cancel
							</button>
							<button
								onClick={handleDone}
								className="bg-[#0077da] px-6 py-[15px] h-[47px] rounded text-white font-bold text-[13px] tracking-[1.86px] uppercase hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Done
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default SendExampleEmailDialog;