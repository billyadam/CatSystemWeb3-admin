"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

async function fetchRequest(id: string) {
	const res = await api.get(`/admin/requests/${id}`);
	return res.data;
}

export function useGetRequest(id: string) {
	return useQuery({
		queryKey: ["request", id],
		queryFn: () => fetchRequest(id),
		enabled: !!id,
	});
}
