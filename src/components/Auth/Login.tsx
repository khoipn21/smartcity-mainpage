import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@utils/auth";

const Login: React.FC = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		try {
			await loginUser(formData);
			navigate("/");
		} catch (err: any) {
			if (err.response?.data?.error) {
				setError(err.response.data.error);
			} else {
				setError("An unexpected error occurred. Please try again.");
			}
			console.error("Login Error:", err);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded shadow-md w-96">
				<h2 className="text-2xl mb-4">Login</h2>
				{error && <p className="text-red-500 mb-4">{error}</p>}
				<div className="mb-4">
					<label className="block text-gray-700">Username</label>
					<input
						type="text"
						name="username"
						value={formData.username}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded"
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">Password</label>
					<input
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded"
						required
					/>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
