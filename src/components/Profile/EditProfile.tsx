import React, { useEffect, useState } from "react";
import api from "@api/api";
import {
	Box,
	TextField,
	Typography,
	Button,
	Paper,
	Alert,
	Modal,
} from "@mui/material";

interface UserProfile {
	username: string;
	email: string;
	fullName: string;
	role: string;
}

const EditProfile: React.FC = () => {
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// State for Change Password
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await api.get("/account");
				setProfile(response.data);
				setFullName(response.data.fullName);
				setEmail(response.data.email);
			} catch (err: any) {
				setError(err.response?.data?.error || "Failed to fetch profile");
			}
		};

		fetchProfile();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await api.put("/account", {
				fullName,
				email,
			});
			setSuccess("Profile updated successfully");
			setError(null);
		} catch (err: any) {
			setError(err.response?.data?.error || "Failed to update profile");
			setSuccess(null);
		}
	};

	const handleOpenModal = () => {
		setIsModalOpen(true);
		setPasswordError(null);
		setPasswordSuccess(null);
		setCurrentPassword("");
		setNewPassword("");
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await api.post("/account/change-password", {
				currentPassword,
				newPassword,
			});
			setPasswordSuccess(response.data.message);
			setPasswordError(null);
			handleCloseModal();
		} catch (err: any) {
			setPasswordError(
				err.response?.data?.error || "Failed to change password",
			);
			setPasswordSuccess(null);
		}
	};

	if (!profile) {
		return (
			<Box className="flex justify-center items-center min-h-[400px]">
				<Typography color="textSecondary">Loading...</Typography>
			</Box>
		);
	}

	return (
		<Box className="max-w-2xl mx-auto p-4">
			<Typography
				variant="h4"
				component="h1"
				gutterBottom>
				Edit Profile
			</Typography>

			<Paper className="p-6 mt-4">
				{error && (
					<Alert
						severity="error"
						className="mb-4">
						{error}
					</Alert>
				)}
				{success && (
					<Alert
						severity="success"
						className="mb-4">
						{success}
					</Alert>
				)}

				<form
					onSubmit={handleSubmit}
					className="space-y-4">
					<TextField
						fullWidth
						label="Username"
						value={profile.username}
						disabled
						variant="outlined"
					/>

					<TextField
						fullWidth
						label="Full Name"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						variant="outlined"
						required
					/>

					<TextField
						fullWidth
						type="email"
						label="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						variant="outlined"
						required
					/>

					<TextField
						fullWidth
						label="Role"
						value={profile.role}
						disabled
						variant="outlined"
					/>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						size="large"
						className="w-full">
						Save Changes
					</Button>

					{/* Change Password Button */}
					<Button
						type="button"
						variant="outlined"
						color="secondary"
						size="large"
						className="w-full mt-4"
						onClick={handleOpenModal}>
						Change Password
					</Button>
				</form>
			</Paper>

			{/* Change Password Modal */}
			<Modal
				open={isModalOpen}
				onClose={handleCloseModal}
				aria-labelledby="change-password-modal"
				aria-describedby="modal-to-change-user-password">
				<Box
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
					bg-white p-8 rounded-lg shadow-lg w-96"
					sx={{
						boxShadow: 24,
					}}>
					<Typography
						id="change-password-modal"
						variant="h6"
						component="h2"
						gutterBottom>
						Change Password
					</Typography>

					{passwordError && (
						<Alert
							severity="error"
							className="mb-4">
							{passwordError}
						</Alert>
					)}
					{passwordSuccess && (
						<Alert
							severity="success"
							className="mb-4">
							{passwordSuccess}
						</Alert>
					)}

					<form
						onSubmit={handleChangePassword}
						className="space-y-4">
						<TextField
							fullWidth
							type="password"
							label="Current Password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							variant="outlined"
							required
						/>

						<TextField
							fullWidth
							type="password"
							label="New Password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							variant="outlined"
							required
						/>

						<Box className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outlined"
								color="secondary"
								onClick={handleCloseModal}>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="contained"
								color="primary">
								Change Password
							</Button>
						</Box>
					</form>
				</Box>
			</Modal>
		</Box>
	);
};

export default EditProfile;
