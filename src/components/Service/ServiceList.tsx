import React, { useEffect, useState } from "react";
import api from "@api/api";
import { Link } from "react-router-dom";
import { TextField, MenuItem, Grid } from "@mui/material";
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
	imageUrls: string[];
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
		<div className="min-h-[calc(100vh-64px)]">
			{/* Search and Filter Section */}
			<div className="mb-8 backdrop-blur-md bg-white/30 p-6 rounded-xl border border-white/50 shadow-lg">
				<div className="flex flex-col md:flex-row gap-4">
					<TextField
						fullWidth
						label="Search services..."
						variant="outlined"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						sx={{
							"& .MuiOutlinedInput-root": {
								backgroundColor: "rgba(255, 255, 255, 0.3)",
								backdropFilter: "blur(8px)",
								"& fieldset": {
									borderColor: "rgba(0, 0, 0, 0.23)",
									borderWidth: "2px",
								},
								"&:hover fieldset": {
									borderColor: "rgba(0, 0, 0, 0.4)",
								},
								"&.Mui-focused fieldset": {
									borderColor: "rgba(0, 0, 0, 0.7)",
									borderWidth: "2px",
								},
							},
							"& .MuiInputLabel-root": {
								color: "rgba(0, 0, 0, 0.7)",
								"&.Mui-focused": {
									color: "rgba(0, 0, 0, 0.9)",
								},
							},
							"& .MuiInputBase-input": {
								color: "rgba(0, 0, 0, 0.9)",
								"&::placeholder": {
									color: "rgba(0, 0, 0, 0.5)",
									opacity: 1,
								},
							},
						}}
					/>
					<TextField
						select
						fullWidth
						label="Select City"
						value={selectedCity}
						onChange={(e) => setSelectedCity(e.target.value)}
						variant="outlined"
						sx={{
							"& .MuiOutlinedInput-root": {
								backgroundColor: "rgba(255, 255, 255, 0.3)",
								backdropFilter: "blur(8px)",
								"& fieldset": {
									borderColor: "rgba(0, 0, 0, 0.23)",
									borderWidth: "2px",
								},
								"&:hover fieldset": {
									borderColor: "rgba(0, 0, 0, 0.4)",
								},
								"&.Mui-focused fieldset": {
									borderColor: "rgba(0, 0, 0, 0.7)",
									borderWidth: "2px",
								},
							},
							"& .MuiInputLabel-root": {
								color: "rgba(0, 0, 0, 0.7)",
								"&.Mui-focused": {
									color: "rgba(0, 0, 0, 0.9)",
								},
							},
							"& .MuiSelect-select": {
								color: "rgba(0, 0, 0, 0.9)",
							},
						}}>
						<MenuItem value="All">All Cities</MenuItem>
						{cities.map((city) => (
							<MenuItem
								key={city.id}
								value={city.name}>
								{city.name}, {city.country}
							</MenuItem>
						))}
					</TextField>
				</div>
			</div>

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
						lg={3}
						key={service.id}>
						<Link
							to={`/cities/${service.cityId}/services/${service.id}`}
							className="block h-[360px]">
							<div
								className="h-full backdrop-blur-md bg-white/30 rounded-xl overflow-hidden 
								transition-all duration-300 hover:-translate-y-1 hover:shadow-xl 
								border border-white/50 hover:border-white/70 flex flex-col">
								<div className="aspect-video relative overflow-hidden h-[180px]">
									{service.imageUrls && service.imageUrls.length > 0 ? (
										<img
											src={`${import.meta.env.VITE_API_URL}/api/images/${
												service.imageUrls[0]
											}`}
											alt={service.name}
											className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center bg-black/5">
											<BusinessIcon
												sx={{ fontSize: 48, color: "rgba(0, 0, 0, 0.5)" }}
											/>
										</div>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent" />
								</div>
								<div className="p-4 backdrop-blur-md bg-white/30 flex-1 flex flex-col">
									<h3 className="text-xl font-bold text-gray-900 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
										{service.name}
									</h3>
									<p
										className="text-gray-700 mb-2 flex-1 overflow-hidden relative"
										style={{
											display: "-webkit-box",
											WebkitLineClamp: 3,
											WebkitBoxOrient: "vertical",
										}}>
										{service.description}
									</p>
									<div className="flex items-center justify-between mt-auto">
										<span
											className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
											bg-gray-200/50 text-gray-800 border border-gray-300/50">
											{service.categoryName}
										</span>
										<span className="text-gray-600 text-sm font-medium">
											{service.cityName}
										</span>
									</div>
								</div>
							</div>
						</Link>
					</Grid>
				))}
			</Grid>

			{filteredServices.length === 0 && (
				<div className="text-center py-8 text-gray-800 font-medium">
					No services found matching your criteria
				</div>
			)}
		</div>
	);
};

export default ServiceList;
