import React, { useEffect, useState } from "react";
import api from "@api/api";
import {
	Box,
	TextField,
	Typography,
	Button,
	Paper,
	Alert,
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
				</form>
			</Paper>
		</Box>
	);
};

export default EditProfile;
