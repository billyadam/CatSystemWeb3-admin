"use client";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";
import useAuthStore from "@/app/stores/useAuthStore";

interface CountMyCatsResponse {
	count: number;
}

async function fetchCountMyCats(): Promise<number> {
	const { data } = await api.get<CountMyCatsResponse>("/cats/count");
	return data.count;
}

export function useCountMyCats() {
	const user = useAuthStore.useUser();

	return useQuery({
		queryKey: ["my-cats-count", user?.wallet],
		queryFn: fetchCountMyCats,
		enabled: !!user?.wallet,
	});
}
