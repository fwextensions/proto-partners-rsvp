import React, { useState, useEffect } from "react";

interface DeadlineDialogProps {
	onClose: () => void;
	onSave: (deadline: string) => void;
	currentDeadline: string;
}

const DeadlineDialog: React.FC<DeadlineDialogProps> = ({ onClose, onSave, currentDeadline }) => {
	const [month, setMonth] = useState('');
	const [day, setDay] = useState('');
	const [year, setYear] = useState('');

	const months = [
		{ value: '01', label: 'January' },
		{ value: '02', label: 'February' },
		{ value: '03', label: 'March' },
		{ value: '04', label: 'April' },
		{ value: '05', label: 'May' },
		{ value: '06', label: 'June' },
		{ value: '07', label: 'July' },
		{ value: '08', label: 'August' },
		{ value: '09', label: 'September' },
		{ value: '10', label: 'October' },
		{ value: '11', label: 'November' },
		{ value: '12', label: 'December' }
	];

	useEffect(() => {
		if (currentDeadline) {
			const datePart = currentDeadline.split(' ')[0];
			const [y, m, d] = datePart.split('-');
			if (y && m && d) {
				setYear(y);
				setMonth(m);
				setDay(d);
			}
		}
	}, [currentDeadline]);

	const handleSave = () => {
		if (month && day && year && year.length === 4) {
			const formattedMonth = month.padStart(2, '0');
			const formattedDay = day.padStart(2, '0');
			onSave(`${year}-${formattedMonth}-${formattedDay} 11:59 PM`);
			// Don't call onClose() here - let the parent handle closing after save
		}
	};

	const isSaveDisabled = !month || !day || !year || year.length !== 4;

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

				{/* Content */}
				<div className="px-12 py-8">
					<div className="flex flex-col gap-3 w-full">
						<div className="flex flex-col gap-2">
							<h2 className="text-lg font-semibold text-[#30383a] leading-[1.25]" style={{ fontSize: '18px' }}>
								Set deadline to submit documents
							</h2>
							<p className="text-base text-[#222222] leading-[1.5]" style={{ fontSize: '16px' }}>
								Enter the date applicants will see as the deadline to submit their documents. It will also show the time of the deadline: 11:59 PM Pacific Time.
							</p>
						</div>
						<div className="flex flex-row gap-3 h-[75px] w-full">
							{/* Month Dropdown */}
							<div className="flex-1 flex flex-col gap-2">
								<label htmlFor="month" className="text-[#555555] text-sm leading-[21px]" style={{ fontSize: '14px' }}>
									Month
								</label>
								<div className="relative">
									<select
										id="month"
										value={month}
										onChange={(e) => setMonth(e.target.value)}
										className="w-full bg-[#f9f9f9] border border-[#dedee0] rounded px-3.5 py-[11px] text-base appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
										style={{ fontSize: '16px', lineHeight: '24px' }}
									>
										<option value="" className="text-[#767676]">Select One</option>
										{months.map(({ value, label }) => (
											<option key={value} value={value} className="text-black">
												{label}
											</option>
										))}
									</select>
									<div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
										<svg className="w-3 h-3 text-[#555555]" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
										</svg>
									</div>
								</div>
							</div>

							{/* Day Input */}
							<div className="w-[75px] flex flex-col gap-2">
								<label htmlFor="day" className="text-[#555555] text-sm leading-[21px]" style={{ fontSize: '14px' }}>
									Day
								</label>
								<input 
									type="text"
									id="day"
									value={day}
									onChange={(e) => setDay(e.target.value)}
									placeholder=""
									maxLength={2}
									className="w-full bg-[#f9f9f9] border border-[#dedee0] rounded px-3.5 py-[11px] text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
									style={{ fontSize: '16px', lineHeight: '24px' }}
								/>
							</div>

							{/* Year Input */}
							<div className="w-[93px] flex flex-col gap-2">
								<label htmlFor="year" className="text-[#555555] text-sm leading-[21px]" style={{ fontSize: '14px' }}>
									Year
								</label>
								<input 
									type="text"
									id="year"
									value={year}
									onChange={(e) => setYear(e.target.value)}
									placeholder=""
									maxLength={4}
									className="w-full bg-[#f9f9f9] border border-[#dedee0] rounded px-3.5 py-[11px] text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
									style={{ fontSize: '16px', lineHeight: '24px' }}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex flex-row gap-4 h-[95px] items-center justify-end px-[22px] py-6 bg-[#f5f8f9] rounded-b-lg">
					<button
						onClick={onClose}
						className="h-[47px] w-[110px] bg-[#f5f8f9] border-2 border-[#f5f8f9] rounded text-[#0077da] font-bold text-[13px] tracking-[1.86px] uppercase hover:bg-gray-100"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={isSaveDisabled}
						className="bg-[#0077da] px-6 py-[15px] h-[47px] rounded text-white font-bold text-[13px] tracking-[1.86px] uppercase hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeadlineDialog;
