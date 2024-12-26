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
import BusinessIcon from "@mui/icons-material/Business";

interface Service {
	id: number;
	name: string;
	description: string;
	cityName: string;
	cityId: number;
	categoryName: string;
	address: string;
	contactInfo: string;
	operatingHours: string;
}

interface City {
	id: number;
	name: string;
	country: string;
}

const ServiceList: React.FC = () => {
	const [services, setServices] = useState<Service[]>([]);
	const [cities, setCities] = useState<City[]>([]);
	const [selectedCity, setSelectedCity] = useState<string>("All");
	const [search, setSearch] = useState("");

	useEffect(() => {
		const fetchServices = async () => {
			const response = await api.get("/allservices");
			setServices(response.data);
		};

		const fetchCities = async () => {
			const response = await api.get("/cities");
			setCities(response.data);
		};

		fetchServices();
		fetchCities();
	}, []);

	const filteredServices = services.filter((service) => {
		const matchesCity =
			selectedCity === "All" ||
			service.cityName.toLowerCase().includes(selectedCity.toLowerCase());
		const matchesSearch = service.name
			.toLowerCase()
			.includes(search.toLowerCase());
		return matchesCity && matchesSearch;
	});

	return (
		<div className="max-w-7xl mx-auto p-4">
			<Typography
				variant="h4"
				component="h1"
				gutterBottom>
				All Services
			</Typography>

			{/* Filters */}
			<Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				<TextField
					fullWidth
					label="Search services..."
					variant="outlined"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<TextField
					select
					fullWidth
					label="Select City"
					value={selectedCity}
					onChange={(e) => setSelectedCity(e.target.value)}
					variant="outlined">
					<MenuItem value="All">All Cities</MenuItem>
					{cities.map((city) => (
						<MenuItem
							key={city.id}
							value={city.name}>
							{city.name}, {city.country}
						</MenuItem>
					))}
				</TextField>
			</Box>

			{/* Services Grid */}
			<Grid
				container
				spacing={3}>
				{filteredServices.map((service) => (
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						key={service.id}>
						<Link
							to={`/cities/${service.cityId}/services/${service.id}`}
							className="no-underline">
							<Card className="h-full hover:shadow-lg transition-shadow duration-200">
								<CardContent>
									<Box className="flex items-center gap-2 mb-2">
										<BusinessIcon className="text-blue-500" />
										<Typography
											variant="h6"
											component="h2"
											noWrap>
											{service.name}
										</Typography>
									</Box>
									<Typography
										color="textSecondary"
										gutterBottom>
										{service.cityName} • {service.categoryName}
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										className="line-clamp-2">
										{service.description}
									</Typography>
									<Box className="mt-2 text-sm text-gray-500">
										<Typography
											variant="body2"
											noWrap>
											📍 {service.address}
										</Typography>
										<Typography
											variant="body2"
											noWrap>
											📞 {service.contactInfo}
										</Typography>
										<Typography
											variant="body2"
											noWrap>
											🕒 {service.operatingHours}
										</Typography>
									</Box>
								</CardContent>
							</Card>
						</Link>
					</Grid>
				))}
			</Grid>

			{filteredServices.length === 0 && (
				<Box className="text-center py-8">
					<Typography
						variant="h6"
						color="textSecondary">
						No services found matching your criteria
					</Typography>
				</Box>
			)}
		</div>
	);
};

export default ServiceList;
