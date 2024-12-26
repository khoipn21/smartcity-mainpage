import React from 'react';

interface Props {
	children: React.ReactNode;
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	className?: string;
}

const Button: React.FC<Props> = ({ children, onClick, type = 'button', className }) => {
	return (
		<button
			type={type}
			onClick={onClick}
			className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`}
		>
			{children}
		</button>
	);
};

export default Button; 