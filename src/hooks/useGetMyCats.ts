"use client";
import { useQuery } from "@tanstack/react-query";
import { useWallets } from "@privy-io/react-auth/solana";

import { createReadOnlyCatProgram } from "@/lib/solana/catSystem";
import type { Cat } from "@/types/cat";

const FALLBACK_IMAGE =
	"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&auto=format&fit=crop";

const ACCENT_COLORS = ["#7C5CFC", "#3B82F6", "#F59E0B", "#10B981", "#EC4899"];
const CARD_BGS = ["#F0EDFF", "#EDF6FF", "#FEF3C7", "#D1FAE5", "#FCE7F3"];

const API_BASE =
	process.env.NEXT_PUBLIC_RUN_MODE === "development"
		? process.env.NEXT_PUBLIC_API_URL_DEV
		: process.env.NEXT_PUBLIC_API_URL_PROD;

function resolveImageUrl(url: string | undefined | null): string {
	if (!url) return FALLBACK_IMAGE;
	if (url.startsWith("http")) return url;
	return `${API_BASE ?? ""}${url}`;
}

function fromGender(val: any): "Male" | "Female" {
	if ("female" in val) return "Female";
	return "Male";
}

function fromCoatLength(val: any): string {
	if ("long" in val) return "Long Hair";
	if ("medium" in val) return "Medium Hair";
	if ("short" in val) return "Short Hair";
	return "Unknown";
}

function fromEarType(val: any): string {
	if ("pointed" in val) return "Pointed";
	if ("rounded" in val) return "Rounded";
	if ("folded" in val) return "Folded";
	return "Unknown";
}

function fromBodySize(val: any): string {
	if ("small" in val) return "Small";
	if ("medium" in val) return "Medium";
	if ("large" in val) return "Large";
	return "Unknown";
}

function parseDescription(description: string | undefined): { personality: string[], about: string | undefined } {
	if (!description) return { personality: [], about: undefined };
	// Supports format: "Traits: Friendly, Curious, Playful. some note"
	const traitsMatch = description.match(/Traits?:\s*([^.]+)(?:\.\s*(.*))?/i);
	if (traitsMatch) {
		const personality = traitsMatch[1].split(",").map((t) => t.trim()).filter(Boolean);
		const about = traitsMatch[2] ? traitsMatch[2].trim() : undefined;
		return { personality, about };
	}
	return { personality: [], about: description };
}

async function fetchMyCats(walletAddress: string): Promise<Cat[]> {
	// biome-ignore lint/suspicious/noExplicitAny: Generic Anchor Idl type doesn't expose account names
	const program = createReadOnlyCatProgram() as any;
	const accounts: { publicKey: { toBase58(): string }; account: unknown }[] =
		await program.account.cat.all([
			{
				memcmp: {
					offset: 8,
					bytes: walletAddress,
				},
			},
		]);

	return accounts.map((acc, i) => {
		// biome-ignore lint/suspicious/noExplicitAny: Anchor decoded account, not strongly typed
		const d = acc.account as any;
		const ownerPubkey = d.owner?.toBase58?.() ?? walletAddress;
		const description = d.description as string | undefined;
		const { personality, about } = parseDescription(description);

		return {
			id: acc.publicKey.toBase58() as string,
			name: d.name as string,
			breed: d.breed as string,
			gender: fromGender(d.gender),
			eyeColor: d.eyeColor as string,
			about: about,
			// DNA profile – populated from on-chain data
			dnaProfile: {
				breed: d.breed as string,
				coatColor: (d.coatColor as string) || "",
				coatLength: fromCoatLength(d.coatLength as number),
				earType: fromEarType(d.earType as number),
				bodySize: fromBodySize(d.bodySize as number),
				eyeColor: (d.eyeColor as string) || "",
			},
			// Bio
			bio: personality.length > 0 ? {
				dateOfBirth: "",
				color: d.coatColor as string || "",
				personality,
				vaccinated: false,
				neutered: false,
				indoor: false,
				diet: "",
				favoriteFood: "",
			} : undefined,
			owner: {
				name: "Owner",
				walletAddress: ownerPubkey,
				registeredDate: "",
				location: "",
				totalCats: 0,
				verificationStatus: "Verified" as const,
			},
			ageLabel: "Unknown",
			registeredAt: "May 10, 2026",
			tokenId: `#${String(i + 1).padStart(4, "0")}`,
			verified: true,
			identification: { hasPaw: false, hasDNA: false, hasAncestry: false },
			accentColor: ACCENT_COLORS[i % ACCENT_COLORS.length],
			cardBg: CARD_BGS[i % CARD_BGS.length],
			imageUrl: resolveImageUrl(d.imageUrl1 as string | undefined),
		};
	});
}

export function useGetMyCats() {
	const { wallets } = useWallets();
	const wallet = wallets[0];

	return useQuery({
		queryKey: ["my-cats", wallet?.address],
		queryFn: () => fetchMyCats(wallet!.address),
		enabled: !!wallet,
	});
}
