import React from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "@store/useStore";

interface Props {
	children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
	const { user } = useStore();
	return user ? (
		children
	) : (
		<Navigate
			to="/login"
			replace
		/>
	);
};

export default ProtectedRoute;
