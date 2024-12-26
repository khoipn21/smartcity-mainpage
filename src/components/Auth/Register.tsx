import React, { useState } from "react";
import { registerUser } from "@utils/auth";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		fullName: "",
	});
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			const { confirmPassword, ...registrationData } = formData;
			await registerUser(registrationData);
			navigate("/login");
		} catch (err: any) {
			setError(err.response?.data?.error || "Registration failed");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded shadow-md w-96">
				<h2 className="text-2xl mb-4">Register</h2>
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
						minLength={3}
						maxLength={50}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">Full Name</label>
					<input
						type="text"
						name="fullName"
						value={formData.fullName}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded"
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">Email</label>
					<input
						type="email"
						name="email"
						value={formData.email}
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
						minLength={6}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">Confirm Password</label>
					<input
						type="password"
						name="confirmPassword"
						value={formData.confirmPassword}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded"
						required
						minLength={6}
					/>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
					Register
				</button>
			</form>
		</div>
	);
};

export default Register;
