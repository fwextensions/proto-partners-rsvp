import React from "react";
import { Link } from "react-router-dom";
import DahliaLogo from "../assets/dahlia-logo.svg";

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
		<header className="relative">
			<div className="absolute left-[47px] top-0 w-[235px] h-[75px] z-10 bg-white shadow-[0_1px_2px_0px_rgba(0,0,0,0.25)]">
				<img
					src={DahliaLogo}
					alt="DAHLIA PARTNERS Logo"
					className="w-full h-full object-contain"
				/>
			</div>

			{/* Feedback Bar */}
			<div className="bg-[#0077da] w-full">
				<div className="flex items-center justify-end px-4 py-4">
					<div className="flex items-center gap-3">
						<div className="flex items-start gap-2 text-white text-sm">
							<p className="leading-[21px]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
								Thanks for previewing new features.
							</p>
							<Link 
								to="/feedback"
								className="text-[13px] leading-[19.5px] underline hover:opacity-80 transition-opacity" 
								style={{ fontFamily: 'Open Sans, sans-serif' }}
							>
								We'd love to get your feedback.
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Main Navigation */}
			<div className="bg-white relative border-b border-[#dedee0]">
				{/* Navigation content with left padding to avoid logo overlap */}
				<div className="pl-[285px] pr-6 pt-5 pb-0">
					<div className="flex items-start justify-between gap-[261px]">
						{/* Navigation Items */}
						<div className="flex items-start">
							{navItems.map((item) => (
								<div key={item.label} className="flex flex-col items-center">
									<div className="px-6 py-0 flex items-center justify-center">
										<p 
											className="text-[13px] leading-[24px] text-[#222222] uppercase text-center"
											style={{ fontFamily: 'Open Sans, sans-serif' }}
										>
											{item.label}
										</p>
									</div>
									{item.isActive && (
										<div className="w-full h-[2.066px] mt-4">
											<div className="w-full h-full bg-[#0077da]"></div>
										</div>
									)}
								</div>
							))}
						</div>

						{/* Sign Out */}
						<div className="flex flex-col items-center">
							<div className="px-6 py-0 flex items-center justify-center">
								<p 
									className="text-[13px] leading-[24px] text-[#222222] uppercase text-center"
									style={{ fontFamily: 'Open Sans, sans-serif' }}
								>
									SIGN OUT
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Breadcrumbs and Title Section */}
			<div className="bg-neutral-50 px-12 py-6">
				{/* Breadcrumbs */}
				<div className="flex items-center gap-3 mb-6">
					<p 
						className="text-[12px] leading-[12px] tracking-[1px] text-[#0077da]"
						style={{ fontFamily: 'Open Sans, sans-serif' }}
					>
						LEASE UPS
					</p>
					<div className="w-[4.438px] h-[8px] flex items-center justify-center">
						<div className="rotate-[270deg]">
							<svg className="w-2 h-[4.444px]" viewBox="0 0 8 4" fill="none">
								<path d="M1 1L4 4L7 1" stroke="#222222" strokeWidth="1"/>
							</svg>
						</div>
					</div>
					<p 
						className="text-[12px] leading-[12px] tracking-[1px] text-[#222222]"
						style={{ fontFamily: 'Open Sans, sans-serif' }}
					>
						QUINCY
					</p>
					<div className="w-[4.438px] h-[8px] flex items-center justify-center">
						<div className="rotate-[270deg]">
							<svg className="w-2 h-[4.444px]" viewBox="0 0 8 4" fill="none">
								<path d="M1 1L4 4L7 1" stroke="#222222" strokeWidth="1"/>
							</svg>
						</div>
					</div>
					<p 
						className="text-[12px] leading-[12px] tracking-[1px] text-[#222222]"
						style={{ fontFamily: 'Open Sans, sans-serif' }}
					>
						APPLICANT LIST
					</p>
				</div>

				{/* Title Section */}
				<div className="flex items-end justify-between w-full">
					<div className="w-[640px]">
						<h1 
							className="text-[26px] leading-[32px] tracking-[2.1667px] font-black text-[#222222] uppercase mb-2"
							style={{ fontFamily: 'Lato, sans-serif' }}
						>
							QUINCY
						</h1>
						<p 
							className="text-[16px] leading-[24px] text-[#222222] h-6"
							style={{ fontFamily: 'Open Sans, sans-serif' }}
						>
							555 Bryant St, San Francisco, CA 94107
						</p>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
