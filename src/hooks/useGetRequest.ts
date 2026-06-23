"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Request, RequestStatus } from "@/types/request";

async function fetchRequest(id: string) {
	const res = await api.get(`/requests/${id}`);
	return res.data;
}

export function useGetRequest(id: string) {
	return useQuery({
		queryKey: ["request", id],
		queryFn: () => fetchRequest(id),
		enabled: !!id,
	});
}

async function fetchListRequest(status?: RequestStatus) {
  const res = await api.get<{ data: Request[] }>("/requests", {
    params: status ? { status } : undefined,
  });
  return res.data.data;
}

export function useGetListRequest(status?: RequestStatus) {
  return useQuery({
    queryKey: ["requests", status],
    queryFn: () => fetchListRequest(status),
  });
}
