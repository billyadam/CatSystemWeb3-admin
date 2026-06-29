"use client";
import { useEffect, useRef, useState } from "react";
import { baseURL } from "@/lib/api";
import { getToken } from "@/lib/cookies";

type PdfBlobState = {
	blobUrl: string | null;
	isLoading: boolean;
	error: string | null;
};

/**
 * Fetch a PDF from `GET /requests/:id/pdf` with Bearer token auth,
 * convert to a Blob URL, and revoke it automatically on unmount.
 *
 * @param id       - Request ID
 * @param enabled  - Pass `false` to skip fetching (e.g. when document_url is null)
 */
export function usePdfBlob(id: string, enabled = true): PdfBlobState {
	const [state, setState] = useState<PdfBlobState>({
		blobUrl: null,
		isLoading: false,
		error: null,
	});

	const blobUrlRef = useRef<string | null>(null);

	useEffect(() => {
		if (!enabled || !id) return;

		let cancelled = false;

		const fetchPdf = async () => {
			setState({ blobUrl: null, isLoading: true, error: null });

			try {
				const token = getToken();
				const response = await fetch(`${baseURL}/requests/${id}/pdf`, {
					headers: {
						Authorization: token ? `Bearer ${token}` : "",
					},
				});

				if (!response.ok) {
					throw new Error(
						`Failed to load PDF (HTTP ${response.status}: ${response.statusText})`,
					);
				}

				const blob = await response.blob();

				if (cancelled) return;

				// Revoke any previous Blob URL before creating a new one
				if (blobUrlRef.current) {
					URL.revokeObjectURL(blobUrlRef.current);
				}

				const url = URL.createObjectURL(blob);
				blobUrlRef.current = url;

				setState({ blobUrl: url, isLoading: false, error: null });
			} catch (err: unknown) {
				if (cancelled) return;
				const message =
					err instanceof Error ? err.message : "Unknown error fetching PDF";
				setState({ blobUrl: null, isLoading: false, error: message });
			}
		};

		fetchPdf();

		return () => {
			cancelled = true;
		};
	}, [id, enabled]);

	// Cleanup Blob URL when the component unmounts
	useEffect(() => {
		return () => {
			if (blobUrlRef.current) {
				URL.revokeObjectURL(blobUrlRef.current);
				blobUrlRef.current = null;
			}
		};
	}, []);

	return state;
}
