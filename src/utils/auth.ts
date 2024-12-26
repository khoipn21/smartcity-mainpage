import api from "@api/api";
import { useStore } from "@store/useStore";

export interface RegisterData {
	username: string;
	email: string;
	password: string;
}

export interface LoginData {
	username: string;
	password: string;
}

export const registerUser = async (data: RegisterData) => {
	const response = await api.post("/account/register", data);
	return response.data;
};

export const loginUser = async (data: LoginData) => {
	const response = await api.post("/account/login", data);
	const { token, ...user } = response.data;
	useStore.getState().setUser(user, token);
	return response.data;
};

export const logoutUser = async () => {
	try {
		await api.post("/account/logout");
	} catch (error) {
		console.error("Logout error:", error);
	} finally {
		useStore.getState().logout();
	}
};
