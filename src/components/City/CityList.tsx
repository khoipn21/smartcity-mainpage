import React, { useEffect, useState } from "react";
import api from "@api/api";
import { Link } from "react-router-dom";
import {
	Card,
	CardContent,
	TextField,
	MenuItem,
	Grid,
	Typography,
	Box,
} from "@mui/material";
import LocationCityIcon from "@mui/icons-material/LocationCity";

interface City {
	id: number;
	name: string;
	country: string;
	description: string;
}

const CityList: React.FC = () => {
	const [cities, setCities] = useState<City[]>([]);
	const [search, setSearch] = useState("");
	const [selectedCountry, setSelectedCountry] = useState<string>("All");
	const [countries, setCountries] = useState<string[]>([]);

	useEffect(() => {
		const fetchCities = async () => {
			const response = await api.get("/cities");
			setCities(response.data);

			// Extract unique countries
			const uniqueCountries = Array.from(
				new Set(response.data.map((city: City) => city.country)),
			).sort();
			setCountries(uniqueCountries);
		};
		fetchCities();
	}, []);

	const filteredCities = cities.filter((city) => {
		const matchesSearch = city.name
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchesCountry =
			selectedCountry === "All" || city.country === selectedCountry;
		return matchesSearch && matchesCountry;
	});

	return (
		<div className="max-w-7xl mx-auto p-4">
			<Typography
				variant="h4"
				component="h1"
				gutterBottom>
				Cities
			</Typography>

			{/* Filters */}
			<Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				<TextField
					fullWidth
					label="Search cities..."
					variant="outlined"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<TextField
					select
					fullWidth
					label="Select Country"
					value={selectedCountry}
					onChange={(e) => setSelectedCountry(e.target.value)}
					variant="outlined">
					<MenuItem value="All">All Countries</MenuItem>
					{countries.map((country) => (
						<MenuItem
							key={country}
							value={country}>
							{country}
						</MenuItem>
					))}
				</TextField>
			</Box>

			{/* City Grid */}
			<Grid
				container
				spacing={3}>
				{filteredCities.map((city) => (
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						key={city.id}>
						<Link
							to={`/cities/${city.id}`}
							className="no-underline">
							<Card className="h-full hover:shadow-lg transition-shadow duration-200">
								<CardContent>
									<Box className="flex items-center gap-2 mb-2">
										<LocationCityIcon className="text-blue-500" />
										<Typography
											variant="h6"
											component="h2"
											noWrap>
											{city.name}
										</Typography>
									</Box>
									<Typography
										color="textSecondary"
										gutterBottom>
										{city.country}
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										className="line-clamp-2">
										{city.description}
									</Typography>
								</CardContent>
							</Card>
						</Link>
					</Grid>
				))}
			</Grid>

			{filteredCities.length === 0 && (
				<Box className="text-center py-8">
					<Typography
						variant="h6"
						color="textSecondary">
						No cities found matching your criteria
					</Typography>
				</Box>
			)}
		</div>
	);
};

export default CityList;
