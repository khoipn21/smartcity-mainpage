import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const LandingPage: React.FC = () => {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<div className="h-[calc(100vh-64px)] w-full overflow-hidden">
			{isLoading && (
				<div className="absolute inset-0 z-30 flex items-center justify-center bg-gray-900">
					<CircularProgress sx={{ color: "white" }} />
				</div>
			)}

			<div
				className="absolute inset-0 z-0 transition-opacity duration-500"
				style={{
					backgroundImage: 'url("/bg.jpg")',
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					filter: "brightness(0.7)",
					opacity: isLoading ? 0 : 1,
				}}>
				<img
					src="/bg.jpg"
					alt="background"
					className="hidden"
					onLoad={() => {
						setIsLoading(false);
					}}
				/>
			</div>

			<div
				className="absolute inset-0 z-10"
				style={{
					backdropFilter: "blur(8px)",
					backgroundColor: "rgba(255, 255, 255, 0.1)",
				}}
			/>

			<div
				className={`relative z-20 flex flex-col items-center justify-center h-full transition-opacity duration-500 ${
					isLoading ? "opacity-0" : "opacity-100"
				}`}>
				<div className="p-8 rounded-xl backdrop-blur-md bg-white/10 shadow-lg border border-white/20">
					<h1 className="text-5xl font-bold mb-8 text-white drop-shadow-lg">
						Welcome to Smart City
					</h1>
					<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
						<Link
							to="/cities"
							className="bg-indigo-500/50 hover:bg-indigo-600/50 text-white font-bold py-3 px-6 rounded-lg 
								transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg text-center
								backdrop-blur-sm border border-indigo-400/50 shadow-indigo-500/30
								hover:shadow-indigo-500/50">
							Explore Cities
						</Link>
						<Link
							to="/services"
							className="bg-purple-500/50 hover:bg-purple-600/50 text-white font-bold py-3 px-6 rounded-lg 
								transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg text-center
								backdrop-blur-sm border border-purple-400/50 shadow-purple-500/30
								hover:shadow-purple-500/50">
							All Services
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LandingPage;
