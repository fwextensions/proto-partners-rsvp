import React from "react";

interface CommentIconProps {
	className?: string;
}

const CommentIcon: React.FC<CommentIconProps> = ({ className = "" }) => (
	<svg
		preserveAspectRatio="none"
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
	>
		<rect width="20" height="20" fill="white" />
		<rect x="4" y="2" width="16" height="2" fill="#767676" />
		<rect x="4" y="16" width="16" height="2" fill="#767676" />
		<rect x="4" y="9" width="16" height="2" fill="#767676" />
		<circle cx="1" cy="3" r="1" fill="#767676" />
		<circle cx="1" cy="17" r="1" fill="#767676" />
		<circle cx="1" cy="10" r="1" fill="#767676" />
	</svg>
);

export default CommentIcon;
