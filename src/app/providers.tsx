"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import {
	QueryClient,
	QueryClientProvider,
	type QueryOptions,
} from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "react-hot-toast";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";

import api from "@/lib/api";

const defaultQueryFn = async ({ queryKey }: QueryOptions) => {
	const { data } = await api.get(`${queryKey?.[0]}`);
	return data;
};
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: defaultQueryFn,
		},
	},
});

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		// biome-ignore lint/complexity/noUselessFragments: Prevent unvalid react child if modules are removed
		<>
			<PrivyProvider
				appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
				config={{
					solana: {
						rpcs: {
							"solana:devnet": {
								rpc: createSolanaRpc(
									"https://api.devnet.solana.com",
								) as any,
								rpcSubscriptions: createSolanaRpcSubscriptions(
									"wss://api.devnet.solana.com",
								),
							},
							"solana:mainnet": {
								rpc: createSolanaRpc(
									"https://api.devnet.solana.com",
								) as any,
								rpcSubscriptions: createSolanaRpcSubscriptions(
									"wss://api.devnet.solana.com",
								),
							},
						},
					},
					appearance: {
						theme: "light",
						accentColor: "#6366f1",
						logo: "/assets/Logo Biru.png",
						landingHeader: "Welcome to OLPaw Admin",
						walletChainType: "solana-only",
					},
					loginMethods: ["wallet"],
					embeddedWallets: {
						solana: {
							createOnLogin: "users-without-wallets",
						},
					},
					externalWallets: {
						solana: {
							connectors: toSolanaWalletConnectors(), // For detecting EOA browser wallets
						},
					},
				}}
			>
				<QueryClientProvider client={queryClient}>
					<Toaster position="top-center" />
					<NuqsAdapter>{children}</NuqsAdapter>
				</QueryClientProvider>
			</PrivyProvider>
		</>
	);
}
