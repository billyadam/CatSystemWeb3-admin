import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { produce } from "immer";
import { create } from "zustand";

import { removeToken, setToken } from "@/lib/cookies";
import type { User, WithToken } from "@/types/user";

type AuthStoreType = {
	user: User | null;
	isAuthed: boolean;
	isLoading: boolean;
	login: (user: User & WithToken) => void;
	logout: () => void;
	stopLoading: () => void;
	updateUser: (patch: Partial<User>) => void;
};

const useAuthStoreBase = create<AuthStoreType>((set) => ({
	user: null,
	isAuthed: false,
	isLoading: true,
	login: (user) => {
		setToken(user.token);
		set(
			produce<AuthStoreType>((state) => {
				state.isAuthed = true;
				state.user = user;
			}),
		);
	},
	logout: () => {
		removeToken();
		set(
			produce<AuthStoreType>((state) => {
				state.isAuthed = false;
				state.user = null;
			}),
		);
	},
	stopLoading: () => {
		set(
			produce<AuthStoreType>((state) => {
				state.isLoading = false;
			}),
		);
	},
	updateUser: (patch) => {
		set(
			produce<AuthStoreType>((state) => {
				if (state.user) Object.assign(state.user, patch);
			}),
		);
	},
}));

const useAuthStore = createSelectorHooks(useAuthStoreBase);

export default useAuthStore;
