import React from "react";
import EditProfile from "./EditProfile";
import VisitHistory from "./VisitHistory";

const Profile: React.FC = () => {
	return (
		<div className="container mx-auto p-4">
			<EditProfile />
			<VisitHistory />
		</div>
	);
};

export default Profile;
