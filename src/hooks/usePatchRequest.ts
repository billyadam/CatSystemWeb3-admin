"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

type PatchRequestPayload = {
	id: string;
	action: "approved" | "rejected";
};

async function patchRequest({ id, action }: PatchRequestPayload) {
	const res = await api.patch(`/requests/${id}/accept`, { action });
	return res.data;
}

export function usePatchRequest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: patchRequest,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["request", variables.id] });
		},
	});
}
