import { create } from "zustand";

interface AuthState {
	user: User | null;
	token: string | null;
	setUser: (user: User | null, token: string | null) => void;
	logout: () => void;
}

interface User {
	id: number;
	username: string;
	email: string;
	role: string;
}

// Load initial state from localStorage
const getInitialState = () => {
	const storedUser = localStorage.getItem("user");
	const storedToken = localStorage.getItem("token");
	return {
		user: storedUser ? JSON.parse(storedUser) : null,
		token: storedToken,
	};
};

export const useStore = create<AuthState>((set) => ({
	...getInitialState(),
	setUser: (user, token) => {
		// Store in localStorage
		if (user && token) {
			localStorage.setItem("user", JSON.stringify(user));
			localStorage.setItem("token", token);
		}
		set({ user, token });
	},
	logout: () => {
		// Clear localStorage
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		set({ user: null, token: null });
	},
}));
