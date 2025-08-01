import React from "react";

interface InlineNotificationProps {
	message: string;
	onClose: () => void;
}

const InlineNotification: React.FC<InlineNotificationProps> = ({ message, onClose }) => {
	return (
		<div className="bg-[#e7f7ea] box-border flex flex-row items-center justify-start p-4 relative rounded border-2 border-[#b4e5be]">
			<div className="flex flex-row items-center justify-between w-full">
				<div className="flex flex-row gap-3 items-center">
					<div className="flex items-center justify-center w-6 h-6 relative">
						<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
							<path 
								d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
								stroke="#216e1f" 
								strokeWidth="1.5" 
								strokeLinecap="round" 
								strokeLinejoin="round"
							/>
						</svg>
					</div>
					<div className="text-[#222222] text-[14px] font-normal leading-[21px]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
						{message}
					</div>
				</div>
				<button 
					onClick={onClose}
					className="w-5 h-5 flex items-center justify-center hover:opacity-75"
				>
					<svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
						<path 
							d="M15 5L5 15M5 5L15 15" 
							stroke="#222222" 
							strokeWidth="1.5" 
							strokeLinecap="round" 
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default InlineNotification;