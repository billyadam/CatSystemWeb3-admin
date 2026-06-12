"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Request, RequestStatus } from "@/types/request";

async function fetchRequests(status?: RequestStatus) {
  const res = await api.get<{ data: Request[] }>("/requests", {
    params: status ? { status } : undefined,
  });
  return res.data.data;
}

export function useGetRequests(status?: RequestStatus) {
  return useQuery({
    queryKey: ["requests", status],
    queryFn: () => fetchRequests(status),
  });
}
