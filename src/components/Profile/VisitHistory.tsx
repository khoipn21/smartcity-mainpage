import React, { useEffect, useState } from "react";
import api from "@api/api";
import { useStore } from "@store/useStore";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	CircularProgress,
	Alert,
	TableSortLabel,
} from "@mui/material";

interface Visit {
	id: number;
	userId: number;
	userName: string;
	serviceId: number;
	serviceName: string;
	visitDate: string;
}

type SortField = "serviceName" | "visitDate";
type SortOrder = "asc" | "desc";

const VisitHistory: React.FC = () => {
	const { user } = useStore();
	const [visits, setVisits] = useState<Visit[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [sortField, setSortField] = useState<SortField>("visitDate");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

	useEffect(() => {
		const fetchVisits = async () => {
			try {
				const response = await api.get<Visit[]>("/visits");
				console.log("Fetched Visits:", response.data); // Debugging line

				// Filter visits for the current user's username
				const userVisits = response.data.filter(
					(visit) => visit.userName === user?.username,
				);
				setVisits(userVisits);
				setLoading(false);
			} catch (err: any) {
				setError(err.response?.data?.error || "Failed to fetch visit history.");
				setLoading(false);
			}
		};

		fetchVisits();
	}, [user]);

	const handleSort = (field: SortField) => {
		const isAsc = sortField === field && sortOrder === "asc";
		setSortOrder(isAsc ? "desc" : "asc");
		setSortField(field);
	};

	const sortedVisits = [...visits].sort((a, b) => {
		const order = sortOrder === "asc" ? 1 : -1;

		if (sortField === "serviceName") {
			return a.serviceName.localeCompare(b.serviceName) * order;
		} else {
			return (
				(new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()) *
				order
			);
		}
	});

	if (loading) {
		return (
			<div className="flex justify-center items-center py-8">
				<CircularProgress />
			</div>
		);
	}

	if (error) {
		return (
			<Alert
				severity="error"
				className="my-4">
				{error}
			</Alert>
		);
	}

	return (
		<div className="my-8">
			<Typography
				variant="h6"
				gutterBottom>
				Your Visit History
			</Typography>
			{visits.length === 0 ? (
				<Typography variant="body1">You have no visit history.</Typography>
			) : (
				<TableContainer component={Paper}>
					<Table aria-label="visit history table">
						<TableHead>
							<TableRow>
								<TableCell>No.</TableCell>
								<TableCell>
									<TableSortLabel
										active={sortField === "serviceName"}
										direction={sortField === "serviceName" ? sortOrder : "asc"}
										onClick={() => handleSort("serviceName")}>
										Service Name
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={sortField === "visitDate"}
										direction={sortField === "visitDate" ? sortOrder : "asc"}
										onClick={() => handleSort("visitDate")}>
										Visit Date
									</TableSortLabel>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{sortedVisits.map((visit, index) => (
								<TableRow key={visit.id}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{visit.serviceName}</TableCell>
									<TableCell>
										{new Date(visit.visitDate).toLocaleString()}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</div>
	);
};

export default VisitHistory;
