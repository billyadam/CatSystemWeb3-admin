"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import Button from "@/components/ui/button/Button";
import Typography from "@/components/ui/Typography";
import { useGetRequest } from "@/hooks/useGetRequest";
import { usePatchRequest } from "@/hooks/usePatchRequest";

interface ReviewBreederPageProps {
	id: string;
}

export default function ReviewBreederPage({ id }: ReviewBreederPageProps) {
	const router = useRouter();
	const { data: requestData, isLoading: isRequestLoading, error } = useGetRequest(id);
	const { mutateAsync: patchRequest, isPending: isPatching } = usePatchRequest();

	const handleAction = async (action: "approved" | "rejected") => {
		try {
			await patchRequest({ id, action });
			alert(`Request successfully ${action}`);
			router.push("/"); // Or wherever it should go back to
		} catch (error: any) {
			alert(`Failed to ${action} request: ${error?.response?.data?.message || error.message}`);
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

	// Try to get wallet address from standard places in Sequelize response
	const walletAddress =
		requestData?.wallet_address ||
		requestData?.User?.wallet_address ||
		requestData?.user_wallet ||
		requestData?.requester?.wallet_address ||
		"Wallet Address Unavailable";

	return (
		<div className="mx-auto w-full max-w-4xl p-6 md:p-12">
			<Typography variant="h1" font="Poppins" weight="semibold" className="mb-6 text-2xl">
				Review Breeder Request
			</Typography>

			{/* PDF Placeholder / Wallet Address Card */}
			<div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border-2 border-blue-400 bg-white p-8 shadow-sm">
				<Typography font="Poppins" weight="medium" className="mb-4 text-lg text-gray-500">
					PDF Not Set Up Yet. Showing Wallet Address:
				</Typography>
				<Typography font="Poppins" weight="bold" className="text-xl md:text-2xl text-blue-600 break-all text-center">
					{walletAddress}
				</Typography>
			</div>

			{/* Action Buttons */}
			<div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8">
				<Button
					variant="outline"
					size="lg"
					className="w-full max-w-[200px] rounded-2xl border-blue-500 text-blue-500 hover:bg-blue-50 focus-visible:ring-blue-400"
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
			
			{/* Status Info */}
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
