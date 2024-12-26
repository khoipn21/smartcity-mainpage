import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<h1 className="text-4xl font-bold mb-8">Welcome to Smart City</h1>
			<div className="flex space-x-4">
				<Link
					to="/cities"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
					Explore Cities
				</Link>
				<Link
					to="/services"
					className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
					All Services
				</Link>
			</div>
		</div>
	);
};

export default LandingPage;
