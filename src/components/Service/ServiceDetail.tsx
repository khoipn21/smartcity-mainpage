import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@api/api";
import { useStore } from "@store/useStore";
import { Box, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

interface Review {
	id: number;
	rating: number;
	comment: string;
	userName: string;
	createdAt: string;
}

interface Service {
	id: number;
	name: string;
	description: string;
	location: string;
	address: string;
	contactInfo: string;
	operatingHours: string;
	createdAt: string;
	imageUrls: string[];
}

interface Visit {
	id: number;
	userId: number;
	userName: string;
	serviceId: number;
	serviceName: string;
	visitDate: string;
}

interface VisitResponse {
	averageRating: number;
	listVisit: Visit[];
}

const labels: { [index: string]: string } = {
	0.5: "Useless",
	1: "Useless+",
	1.5: "Poor",
	2: "Poor+",
	2.5: "Ok",
	3: "Ok+",
	3.5: "Good",
	4: "Good+",
	4.5: "Excellent",
	5: "Excellent+",
};

function getLabelText(value: number) {
	return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const ServiceDetail: React.FC = () => {
	const { cityId, serviceId } = useParams<{
		cityId: string;
		serviceId: string;
	}>();
	const { user } = useStore();

	const [service, setService] = useState<Service | null>(null);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [hasVisited, setHasVisited] = useState<boolean>(false);
	const [rating, setRating] = useState<number>(0);
	const [comment, setComment] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [averageRating, setAverageRating] = useState<number>(0);
	const [visitDate, setVisitDate] = useState<string>("");
	const [userReview, setUserReview] = useState<Review | null>(null);
	const [hover, setHover] = React.useState(-1);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch service details
				const serviceResponse = await api.get(
					`/cities/${cityId}/services/${serviceId}`,
				);
				const fetchedService: Service = {
					...serviceResponse.data,
					imageUrls: Array.isArray(serviceResponse.data.imageUrls)
						? serviceResponse.data.imageUrls
						: [],
				};
				setService(fetchedService);

				// Fetch reviews separately
				const reviewsResponse = await api.get(`/services/${serviceId}/reviews`);
				const fetchedReviews = reviewsResponse.data;

				// If user is logged in, check for their review
				if (user) {
					const userExistingReview = fetchedReviews.find(
						(review: Review) => review.userName === user.username,
					);
					if (userExistingReview) {
						setUserReview(userExistingReview);
					}
				}

				// Filter out user's review from general reviews list
				const otherReviews = fetchedReviews.filter(
					(review: Review) => review.userName !== user?.username,
				);
				setReviews(otherReviews);

				// Fetch visit data
				const visitsResponse = await api.get<VisitResponse>(
					`/services/${serviceId}/visits`,
				);
				const { averageRating, listVisit } = visitsResponse.data;

				// Check if current user has visited and get visit date
				if (user) {
					console.log(user.id);
					const userVisit = listVisit.find(
						(visit) => visit.userName === user.username,
					);
					if (userVisit) {
						setHasVisited(true);
						setVisitDate(userVisit.visitDate);
					}
				}

				setAverageRating(averageRating);
			} catch (error: any) {
				console.error("Error fetching data:", error);
				setError("Failed to load service details or reviews.");
			}
		};

		fetchData();
	}, [cityId, serviceId, user]);

	const handleMarkVisit = async () => {
		try {
			await api.post(`/services/${serviceId}/visit`);

			// Update visit status and date immediately
			setHasVisited(true);
			// Set the current date as the visit date
			setVisitDate(new Date().toISOString());
		} catch (err: any) {
			setError(err.response?.data?.error || "Failed to mark visit");
		}
	};

	const handleSubmitReview = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// Submit the review
			const response = await api.post(`/services/${serviceId}/reviews`, {
				rating,
				comment,
			});

			// Create the new review object
			const newReview = {
				id: response.data.id,
				rating,
				comment,
				userName: user!.username,
				createdAt: new Date().toISOString(),
			};

			// Set the new review as the user's review
			setUserReview(newReview);

			// Clear the form
			setRating(0);
			setComment("");

			// Clear any existing errors
			setError(null);
		} catch (err: any) {
			setError(err.response?.data?.error || "Failed to submit review");
		}
	};

	return (
		<div className="max-w-7xl mx-auto p-4">
			{error && <div className="text-red-600 mb-4">{error}</div>}
			{service ? (
				<>
					{/* Main Content Section */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
						{/* Left Column - Images */}
						<div className="space-y-4">
							<div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
								{service.imageUrls.length > 0 ? (
									<img
										src={`${import.meta.env.VITE_API_URL}/api/images/${
											service.imageUrls[0]
										}`}
										alt={service.name}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-gray-400">
										No image available
									</div>
								)}
							</div>
							{/* Thumbnail Images */}
							<div className="flex gap-2 overflow-x-auto">
								{service.imageUrls.map((img, index) => (
									<img
										key={index}
										src={`${import.meta.env.VITE_API_URL}/api/images/${img}`}
										alt={`${service.name} ${index + 1}`}
										className="w-20 h-20 object-cover rounded cursor-pointer"
									/>
								))}
							</div>
						</div>

						{/* Right Column - Service Info */}
						<div className="space-y-4">
							<h1 className="text-3xl font-bold">{service.name}</h1>

							{/* Rating Summary */}
							<div className="flex items-center gap-2">
								<div className="flex items-center">
									<span className="text-2xl font-bold">
										{averageRating.toFixed(1)}
									</span>
									<span className="text-yellow-400 text-2xl ml-1">★</span>
								</div>
								<span className="text-gray-500">
									({reviews.length} reviews)
								</span>
							</div>

							{/* Service Details */}
							<div className="space-y-2 border-t border-b py-4">
								<p className="text-gray-700">
									<strong>Description:</strong> {service.description}
								</p>
								<p className="text-gray-700">
									<strong>Address:</strong> {service.address}
								</p>
								<p className="text-gray-700">
									<strong>Contact:</strong> {service.contactInfo}
								</p>
								<p className="text-gray-700">
									<strong>Operating Hours:</strong> {service.operatingHours}
								</p>
							</div>

							{/* Visit Button */}
							{user && (
								<div className="mt-6">
									{hasVisited ? (
										<div className="bg-green-50 p-4 rounded-lg">
											<p className="text-green-700">
												You visited this service on{" "}
												{new Date(visitDate).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</p>
										</div>
									) : (
										<button
											onClick={handleMarkVisit}
											className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
											Mark as Visited
										</button>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Review Section */}
					<div className="mt-12">
						<h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

						{/* Review Form */}
						{user && hasVisited && !userReview && (
							<div className="bg-gray-50 p-6 rounded-lg mb-8">
								<h3 className="text-xl font-semibold mb-4">Write a Review</h3>
								<form
									onSubmit={handleSubmitReview}
									className="space-y-4">
									<div>
										<label className="block text-gray-700 mb-2">Rating</label>
										{/* <select
											value={rating}
											onChange={(e) => setRating(Number(e.target.value))}
											required
											className="w-full p-2 border rounded-lg">
											<option value={0}>Select Rating</option>
											{[1, 2, 3, 4, 5].map((num) => (
												<option
													key={num}
													value={num}>
													{num} -{" "}
													{num === 1
														? "Poor"
														: num === 2
														? "Fair"
														: num === 3
														? "Good"
														: num === 4
														? "Very Good"
														: "Excellent"}
												</option>
											))}
										</select> */}
										<Rating
											name="hover-feedback"
											value={rating}
											precision={0.5}
											getLabelText={getLabelText}
											onChange={(event, newValue) => {
												setRating(newValue ?? 0);
											}}
											onChangeActive={(event, newHover) => {
												setHover(newHover);
											}}
											emptyIcon={
												<StarIcon
													style={{ opacity: 0.55 }}
													fontSize="inherit"
												/>
											}
										/>
										{rating !== null && (
											<Box sx={{ ml: 2 }}>
												{labels[hover !== -1 ? hover : rating]}
											</Box>
										)}
									</div>
									<div>
										<label className="block text-gray-700 mb-2">
											Your Review
										</label>
										<textarea
											value={comment}
											onChange={(e) => setComment(e.target.value)}
											required
											className="w-full p-3 border rounded-lg min-h-[120px]"
											placeholder="Share your experience with this service..."
										/>
									</div>
									<button
										type="submit"
										className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
										Submit Review
									</button>
								</form>
							</div>
						)}

						{/* User's Review */}
						{userReview && (
							<div className="mb-8">
								<h3 className="text-xl font-semibold mb-4">Your Review</h3>
								<div className="bg-blue-50 p-6 rounded-lg">
									<div className="flex justify-between items-center mb-2">
										<span className="font-semibold">{userReview.userName}</span>
										<div className="flex items-center">
											<span className="text-yellow-400 text-xl">
												{"★".repeat(userReview.rating)}
											</span>
											<span className="text-gray-300 text-xl">
												{"★".repeat(5 - userReview.rating)}
											</span>
										</div>
									</div>
									<p className="text-gray-700 mb-2">{userReview.comment}</p>
									<p className="text-sm text-gray-500">
										{new Date(userReview.createdAt).toLocaleDateString()}
									</p>
								</div>
							</div>
						)}

						{/* Other Reviews */}
						<div>
							<h3 className="text-xl font-semibold mb-4">Other Reviews</h3>
							{reviews.length > 0 ? (
								<div className="space-y-4">
									{reviews.map((review) => (
										<div
											key={review.id}
											className="border p-6 rounded-lg">
											<div className="flex justify-between items-center mb-2">
												<span className="font-semibold">{review.userName}</span>
												<div className="flex items-center">
													<span className="text-yellow-400 text-xl">
														{"★".repeat(review.rating)}
													</span>
													<span className="text-gray-300 text-xl">
														{"★".repeat(5 - review.rating)}
													</span>
												</div>
											</div>
											<p className="text-gray-700 mb-2">{review.comment}</p>
											<p className="text-sm text-gray-500">
												{new Date(review.createdAt).toLocaleDateString()}
											</p>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-500">No reviews yet.</p>
							)}
						</div>
					</div>
				</>
			) : (
				<div className="flex justify-center items-center min-h-[400px]">
					<p className="text-gray-500">Loading...</p>
				</div>
			)}
		</div>
	);
};

export default ServiceDetail;
