import React, { useEffect, useRef } from "react";

interface DropdownMenuProps {
	onClose: () => void;
	children: React.ReactNode;
}

function DropdownMenu({ onClose, children }: DropdownMenuProps) {
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onClose]);

	return (
		<div
			ref={dropdownRef}
			className="absolute right-0 mt-2 w-fit whitespace-nowrap bg-white rounded-md shadow-lg border border-gray-200 z-10"
		>
			<div className="py-1">{children}</div>
		</div>
	);
}

export default DropdownMenu;
