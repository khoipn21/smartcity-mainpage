import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@api/api";
import ServiceCategoryFilter from "./ServiceCategoryFilter";
import { Link } from "react-router-dom";

interface City {
	id: number;
	name: string;
	country: string;
}

interface ServiceCategory {
	id: number;
	name: string;
}

interface Service {
	id: number;
	name: string;
	description: string;
	categoryName?: string;
}

const CityDetail: React.FC = () => {
	const { cityId } = useParams<{ cityId: string }>();
	const [city, setCity] = useState<City | null>(null);
	const [services, setServices] = useState<Service[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>("All");
	const [searchQuery, setSearchQuery] = useState<string>("");

	useEffect(() => {
		const fetchCity = async () => {
			const response = await api.get(`/cities/${cityId}`);
			setCity(response.data);
		};

		const fetchServices = async () => {
			const response = await api.get(`/cities/${cityId}/services`);
			setServices(response.data);
		};

		fetchCity();
		fetchServices();
	}, [cityId]);

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
	};

	// First filter services by search query
	const searchFilteredServices = services.filter(
		(service) =>
			service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			service.description.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Get categories from search-filtered services
	const availableCategories = [
		"All",
		...new Set(
			searchFilteredServices.map((service) => service.categoryName || ""),
		),
	];

	// Then filter by category if not "All"
	const filteredServices = searchFilteredServices.filter(
		(service) =>
			selectedCategory === "All" || service.categoryName === selectedCategory,
	);

	// Reset category selection if current category is not in available categories
	useEffect(() => {
		if (
			selectedCategory !== "All" &&
			!availableCategories.includes(selectedCategory)
		) {
			setSelectedCategory("All");
		}
	}, [searchQuery]);

	return (
		<div className="p-4">
			{city && (
				<h2 className="text-2xl mb-4">
					{city.name}, {city.country}
				</h2>
			)}

			{/* Search Bar */}
			<div className="mb-4">
				<input
					type="text"
					placeholder="Search services..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full p-2 border rounded"
				/>
			</div>

			<ServiceCategoryFilter
				categories={availableCategories}
				selected={selectedCategory}
				onSelect={handleCategoryChange}
			/>

			<div className="mt-4">
				{filteredServices.length > 0 ? (
					filteredServices.map((service) => (
						<div
							key={service.id}
							className="mb-2 p-4 border rounded">
							<Link
								to={`/cities/${cityId}/services/${service.id}`}
								className="text-blue-500">
								<h3 className="text-xl">{service.name}</h3>
							</Link>
							<p>{service.description}</p>
							<p className="text-sm text-gray-600">
								Category: {service.categoryName}
							</p>
						</div>
					))
				) : (
					<p className="text-gray-500">
						No services found matching your criteria.
					</p>
				)}
			</div>
		</div>
	);
};

export default CityDetail;
