import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "@components/Layout/NavBar";
import LandingPage from "@pages/LandingPage";
import CityList from "@components/City/CityList";
import CityDetail from "@components/City/CityDetail";
import ServiceList from "@components/Service/ServiceList";
import ServiceDetail from "@components/Service/ServiceDetail";
import Login from "@components/Auth/Login";
import Register from "@components/Auth/Register";
import ProtectedRoute from "@components/common/ProtectedRoute";
import Profile from "@components/Profile/Profile";

const App: React.FC = () => {
	return (
		<Router>
			<div className="min-h-screen bg-gray-50">
				<NavBar />
				<main className="pt-16">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
						<Routes>
							<Route
								path="/"
								element={<LandingPage />}
							/>
							<Route
								path="/cities"
								element={<CityList />}
							/>
							<Route
								path="/cities/:cityId"
								element={<CityDetail />}
							/>
							<Route
								path="/services"
								element={<ServiceList />}
							/>
							<Route
								path="/cities/:cityId/services/:serviceId"
								element={<ServiceDetail />}
							/>
							<Route
								path="/login"
								element={<Login />}
							/>
							<Route
								path="/register"
								element={<Register />}
							/>
							<Route
								path="/profile"
								element={
									<ProtectedRoute>
										<Profile />
									</ProtectedRoute>
								}
							/>
						</Routes>
					</div>
				</main>
			</div>
		</Router>
	);
};

export default App;
