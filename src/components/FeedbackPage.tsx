import React, { useState } from "react";

const FeedbackPage: React.FC = () => {
	const [feedbackType, setFeedbackType] = useState("");
	const [feedback, setFeedback] = useState("");
	const [email, setEmail] = useState("");

	return (
		<div className="relative min-h-screen">
			{/* Background Images */}
			<div className="absolute inset-0">
				{/* Blue background overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-[#0077da] to-[#005ba6]"></div>
				
				{/* White content area */}
				<div className="absolute left-0 top-[463px] w-full h-[719px] bg-white"></div>
			</div>

			{/* Content Container */}
			<div className="relative z-10 max-w-4xl mx-auto px-8 py-20">
				{/* Form Container */}
				<div className="bg-white rounded-lg shadow-lg p-12 max-w-3xl mx-auto">
					<h1 className="text-3xl font-bold text-[#222222] mb-6" style={{ fontFamily: 'Lato, sans-serif' }}>
						Tell us what you think
					</h1>
					
					<p className="text-[#666666] mb-8 leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>
						Use this form to share issues and feedback about the new DAHLIA Partners App. You can also email us directly at yindi.pei@sfgov.org
					</p>

					{/* Form */}
					<form className="space-y-8">
						{/* Feedback Type */}
						<div>
							<label className="block text-[#222222] font-medium mb-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
								Feedback type <span className="text-red-500">*</span>
							</label>
							<p className="text-sm text-[#666666] mb-3" style={{ fontFamily: 'Open Sans, sans-serif' }}>
								Please describe the type of product feedback you have
							</p>
							<select 
								value={feedbackType}
								onChange={(e) => setFeedbackType(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077da] focus:border-transparent"
								style={{ fontFamily: 'Open Sans, sans-serif' }}
							>
								<option value="">Select feedback type</option>
								<option value="bug">Bug Report</option>
								<option value="feature">Feature Request</option>
								<option value="improvement">Improvement Suggestion</option>
								<option value="general">General Feedback</option>
							</select>
						</div>

						{/* Feedback Details */}
						<div>
							<label className="block text-[#222222] font-medium mb-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
								Feedback <span className="text-red-500">*</span>
							</label>
							<p className="text-sm text-[#666666] mb-3" style={{ fontFamily: 'Open Sans, sans-serif' }}>
								Please describe your feedback in a few sentences, try to be as specific as possible. Optionally, tell us what browser and device type you are using (for example: Chrome browser on a Windows Surface laptop)
							</p>
							<textarea 
								value={feedback}
								onChange={(e) => setFeedback(e.target.value)}
								rows={6}
								className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077da] focus:border-transparent resize-vertical"
								style={{ fontFamily: 'Open Sans, sans-serif' }}
							/>
						</div>

						{/* Screenshot Upload */}
						<div>
							<label className="block text-[#222222] font-medium mb-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
								Screenshot
							</label>
							<div className="border-2 border-dashed border-gray-300 rounded-md p-12 text-center hover:border-[#0077da] transition-colors">
								<div className="flex items-center justify-center mb-4">
									<svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
									</svg>
								</div>
								<p className="text-[#666666]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
									Drop files here or <button type="button" className="text-[#0077da] underline">browse</button>
								</p>
							</div>
						</div>

						{/* Email */}
						<div>
							<label className="block text-[#222222] font-medium mb-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
								Email <span className="text-red-500">*</span>
							</label>
							<p className="text-sm text-[#666666] mb-3" style={{ fontFamily: 'Open Sans, sans-serif' }}>
								Provide your email so we can reach out in case we have additional questions
							</p>
							<input 
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077da] focus:border-transparent"
								style={{ fontFamily: 'Open Sans, sans-serif' }}
							/>
						</div>

						{/* Form Actions */}
						<div className="flex items-center justify-between pt-6">
							<button 
								type="button" 
								className="text-[#0077da] underline" 
								style={{ fontFamily: 'Open Sans, sans-serif' }}
							>
								Clear form
							</button>
							<button 
								type="submit" 
								className="bg-[#222222] text-white px-8 py-3 rounded-md hover:bg-[#333333] transition-colors font-medium"
								style={{ fontFamily: 'Open Sans, sans-serif' }}
							>
								Submit feedback
							</button>
						</div>
					</form>

					{/* Security Notice */}
					<p className="text-xs text-[#666666] mt-8" style={{ fontFamily: 'Open Sans, sans-serif' }}>
						Do not submit passwords through this form. Report malicious form
					</p>
				</div>
			</div>
		</div>
	);
};

export default FeedbackPage;
