import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useStore } from "@store/useStore";
import { logoutUser } from "@utils/auth";

const NavBar: React.FC = () => {
	const { user } = useStore();
	const navigate = useNavigate();
	const location = useLocation();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleLogout = async () => {
		await logoutUser();
		navigate("/login");
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const isActive = (path: string) => location.pathname === path;

	return (
		<nav className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-sm">
			<Link
				to="/"
				className="text-gray-800 font-bold text-xl hover:text-indigo-600 transition-colors duration-200 flex items-center gap-2">
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					/>
				</svg>
				Smart City
			</Link>

			<div className="flex items-center space-x-8">
				<Link
					to="/cities"
					className={`relative group ${
						isActive("/cities")
							? "text-indigo-600"
							: "text-gray-600 hover:text-indigo-600"
					} transition-colors duration-200`}>
					<span className="flex items-center gap-1">
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
						Cities
					</span>
					<span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
				</Link>

				<Link
					to="/services"
					className={`relative group ${
						isActive("/services")
							? "text-indigo-600"
							: "text-gray-600 hover:text-indigo-600"
					} transition-colors duration-200`}>
					<span className="flex items-center gap-1">
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						Services
					</span>
					<span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
				</Link>

				{user ? (
					<div
						className="relative"
						ref={dropdownRef}>
						<button
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
							className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200 focus:outline-none">
							<span className="flex items-center gap-2">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								{user.username}
							</span>
							<svg
								className={`w-4 h-4 ml-1 transition-transform duration-200 ${
									isDropdownOpen ? "rotate-180" : ""
								}`}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>

						{isDropdownOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
								<Link
									to="/profile"
									className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
									Profile
								</Link>
								<button
									onClick={handleLogout}
									className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
										/>
									</svg>
									Logout
								</button>
							</div>
						)}
					</div>
				) : (
					<div className="flex items-center space-x-4">
						<Link
							to="/login"
							className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">
							Login
						</Link>
						<Link
							to="/register"
							className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow">
							Register
						</Link>
					</div>
				)}
			</div>
		</nav>
	);
};

export default NavBar;
