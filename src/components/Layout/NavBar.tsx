import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@store/useStore";
import { logoutUser } from "@utils/auth";

const NavBar: React.FC = () => {
	const { user } = useStore();
	const navigate = useNavigate();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleLogout = async () => {
		await logoutUser();
		navigate("/login");
	};

	// Close dropdown when clicking outside
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

	return (
		<nav className="bg-blue-600 p-4 flex justify-between items-center">
			<Link
				to="/"
				className="text-white font-bold text-xl">
				Smart City
			</Link>
			<div className="flex items-center">
				<Link
					to="/cities"
					className="text-white mr-4">
					Cities
				</Link>
				<Link
					to="/services"
					className="text-white mr-4">
					All Services
				</Link>
				{user ? (
					<div
						className="relative"
						ref={dropdownRef}>
						<button
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
							className="flex items-center text-white focus:outline-none">
							<span className="mr-2">{user.username}</span>
							<svg
								className={`w-4 h-4 transition-transform ${
									isDropdownOpen ? "rotate-180" : ""
								}`}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>

						{isDropdownOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
								<Link
									to="/profile"
									className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
									Profile
								</Link>
								<button
									onClick={handleLogout}
									className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
									Logout
								</button>
							</div>
						)}
					</div>
				) : (
					<>
						<Link
							to="/login"
							className="text-white mr-4">
							Login
						</Link>
						<Link
							to="/register"
							className="text-white">
							Register
						</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default NavBar;
