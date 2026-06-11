import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "@/lib/api";
import { setToken } from "@/lib/cookies";
import type { AuthWeb3Response } from "@/types/api";

export const useAuthLogin = () => {
	return useMutation({
		mutationFn: async (privyToken: string) => {
			const { data } = await api.post<AuthWeb3Response>("/admin/web3", {
				token: privyToken,
			});
			return data;
		},
		onSuccess: (data) => {
			setToken(data.accessToken);
			toast.success("Welcome to OLPaw Admin");
		},
		onError: () => {
			toast.error("Login failed. Please try again.");
		},
	});
};
