import React from "react";

interface Props {
	categories: string[];
	selected: string;
	onSelect: (category: string) => void;
}

const ServiceCategoryFilter: React.FC<Props> = ({
	categories,
	selected,
	onSelect,
}) => {
	return (
		<div className="flex space-x-4 overflow-x-auto">
			{categories.map((category) => (
				<button
					key={category}
					onClick={() => onSelect(category)}
					className={`px-4 py-2 rounded ${
						selected === category
							? "bg-blue-500 text-white"
							: "bg-gray-200 text-gray-700"
					}`}>
					{category}
				</button>
			))}
		</div>
	);
};

export default ServiceCategoryFilter;
