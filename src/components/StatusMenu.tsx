import React, { useState, useRef, useEffect } from "react";
import { STATUSES, STATUS_ORDER, Status } from "../statuses";

interface StatusMenuProps {
	currentStatus: Status | undefined;
	onUpdateStatus: (newStatus: Status) => void;
}

const StatusMenu: React.FC<StatusMenuProps> = ({ currentStatus = "", onUpdateStatus }) => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const currentStyle = STATUSES[currentStatus];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleSelectStatus = (newStatus: Status) => {
		onUpdateStatus(newStatus);
		setIsOpen(false);
	};

	return (
		<div className="relative" ref={menuRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`w-[18ch] flex items-center justify-between px-3 py-1 text-sm font-bold rounded border ${currentStyle.backgroundColor} ${currentStyle.textColor} ${currentStyle.borderColor}`}
			>
				<span className="uppercase">{currentStyle.label}</span>
				<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
				</svg>
			</button>
			{isOpen && (
				<div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
					<ul className="py-1">
						{STATUS_ORDER.map((status) => {
							const style = STATUSES[status];
							return (
								<li key={status}>
									<button
										onClick={() => handleSelectStatus(status)}
										className={`w-full text-left flex items-center text-sm ${
											status === currentStatus ? "bg-blue-100" : "hover:bg-gray-100"
										}`}
									>
										<span className={`w-1 h-6 mr-3 ${style.backgroundColor}`}></span>
										<span className="py-1">{style.label}</span>
									</button>
								</li>
							);
						})}
					</ul>
				</div>
			)}
		</div>
	);
};

export default StatusMenu;
