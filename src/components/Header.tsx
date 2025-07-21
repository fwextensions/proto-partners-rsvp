import React from "react";

interface NavItem {
	label: string;
	href: string;
	isActive?: boolean;
}

const navItems: NavItem[] = [
	{ label: "LISTINGS", href: "#" },
	{ label: "APPLICATIONS", href: "#" },
	{ label: "PENDING FLAGGED APPS", href: "#" },
	{ label: "MARKED DUPLICATE APPS", href: "#" },
	{ label: "LEASE UPS", href: "#", isActive: true },
];

const Header: React.FC = () => {
	return (
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
						<h1 className="text-xl font-semibold text-gray-800">DAHLIA PARTNERS</h1>
					</div>
					<nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
						{navItems.map((item) => (
							<a
								key={item.label}
								href={item.href}
								className={
									item.isActive
										? "text-blue-600 border-b-2 border-blue-600 pb-1"
										: "hover:text-blue-600"
								}
							>
								{item.label}
							</a>
						))}
					</nav>
					<a href="#" className="text-sm font-medium text-gray-600">
						SIGN OUT
					</a>
				</div>
			</div>
		</header>
	);
};

export default Header;
