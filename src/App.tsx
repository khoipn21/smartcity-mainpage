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
import EditProfile from "@components/Profile/EditProfile";

const App: React.FC = () => {
	return (
		<Router>
			<NavBar />
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
							<EditProfile />
						</ProtectedRoute>
					}
				/>
				{/* Add more routes as needed */}
			</Routes>
		</Router>
	);
};

export default App;
