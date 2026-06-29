"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import * as React from "react";

import Button from "@/components/ui/button/Button";
import Typography from "@/components/ui/Typography";
import { useGetRequest } from "@/hooks/useGetRequest";
import { usePatchRequest } from "@/hooks/usePatchRequest";
import { usePdfBlob } from "@/hooks/usePdfBlob";

// Dynamically import PdfViewer (client-only, uses canvas + pdf.js worker)
const PdfViewer = dynamic(() => import("@/components/ui/PdfViewer"), {
	ssr: false,
	loading: () => (
		<div className="flex items-center justify-center py-16">
			<Loader2 size={28} className="animate-spin text-blue-400" />
		</div>
	),
});

interface ReviewBreederPageProps {
	id: string;
}

export default function ReviewBreederPage({ id }: ReviewBreederPageProps) {
	const router = useRouter();
	const { data: requestData, isLoading: isRequestLoading, error } = useGetRequest(id);
	const { mutateAsync: patchRequest, isPending: isPatching } = usePatchRequest();

	// Only fetch PDF when request data is loaded and document_url exists
	const hasPdf = !!requestData?.document_url;
	const {
		blobUrl: pdfBlobUrl,
		isLoading: isPdfLoading,
		error: pdfError,
	} = usePdfBlob(id, hasPdf);

	const handleAction = async (action: "approved" | "rejected") => {
		try {
			await patchRequest({ id, action });
			alert(`Request successfully ${action}`);
			router.push("/");
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } }; message?: string };
			alert(`Failed to ${action} request: ${err?.response?.data?.message || err?.message}`);
		}
	};

	if (isRequestLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Typography>Loading request data...</Typography>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Typography className="text-red-500">Failed to load request.</Typography>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-4xl p-6 md:p-12">
			<Typography variant="h1" font="Poppins" weight="semibold" className="mb-6 text-2xl">
				Review Breeder Request
			</Typography>

			{/* PDF Viewer Section */}
			<div className="w-full rounded-2xl border-2 border-blue-200 bg-white p-6 shadow-sm">
				{/* Header */}
				<div className="mb-4 flex items-center gap-2">
					<Typography font="Poppins" weight="semibold" className="text-gray-700">
						Breeder Document
					</Typography>
					{requestData?.user_name && (
						<span className="ml-auto text-sm text-gray-400 font-mono truncate max-w-[260px]">
							{requestData.user_name}
						</span>
					)}
				</div>

				{/* Content states */}
				{!hasPdf ? (
					/* document_url is null — no document uploaded */
					<div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400">
						<AlertCircle size={36} />
						<Typography font="Poppins" weight="medium" className="text-base">
							No document uploaded for this request.
						</Typography>
					</div>
				) : isPdfLoading ? (
					/* Fetching PDF binary from backend */
					<div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl bg-gray-50 text-blue-500">
						<Loader2 size={36} className="animate-spin" />
						<Typography font="Poppins" className="text-sm text-gray-500">
							Loading document...
						</Typography>
					</div>
				) : pdfError ? (
					/* Fetch failed (network error, 404, auth failure, etc.) */
					<div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-red-200 bg-red-50 text-red-500">
						<AlertCircle size={36} />
						<Typography font="Poppins" weight="medium" className="text-base text-center px-4">
							Failed to load document.
						</Typography>
						<p className="text-xs text-red-400 text-center px-6">{pdfError}</p>
					</div>
				) : pdfBlobUrl ? (
					/* PDF ready — render it */
					<PdfViewer blobUrl={pdfBlobUrl} />
				) : null}
			</div>

			{/* Action Buttons */}
			<div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8">
				<Button
					variant="outline"
					size="lg"
					className="w-full max-w-[200px] rounded-2xl border-red-400 text-red-500 hover:bg-red-50 focus-visible:ring-red-300"
					onClick={() => handleAction("rejected")}
					isLoading={isPatching}
					disabled={requestData?.status === "rejected" || requestData?.status === "approved"}
				>
					Rejected
				</Button>

				<Button
					variant="outline"
					size="lg"
					className="w-full max-w-[200px] rounded-2xl border-blue-500 text-blue-500 hover:bg-blue-50 focus-visible:ring-blue-400"
					onClick={() => handleAction("approved")}
					isLoading={isPatching}
					disabled={requestData?.status === "rejected" || requestData?.status === "approved"}
				>
					Accepted
				</Button>
			</div>

			{/* Status badge */}
			{requestData?.status && requestData.status !== "pending" && (
				<div className="mt-8 text-center">
					<Typography font="Poppins" weight="medium" className="text-gray-500">
						This request has already been {requestData.status}.
					</Typography>
				</div>
			)}
		</div>
	);
}
