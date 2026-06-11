"use client";

import { ArrowLeft, CheckCircle2, Copy, Pencil } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import BioTab from "@/components/cat/tabs/BioTab";
import DNATab from "@/components/cat/tabs/DNATab";
import FamilyTab from "@/components/cat/tabs/FamilyTab";
import HealthTab from "@/components/cat/tabs/HealthTab";
import OwnerTab from "@/components/cat/tabs/OwnerTab";
import type { Cat } from "@/types/cat";

interface CatIdentityViewProps {
	cat: Cat;
	onBack: () => void;
	/** Called when the user taps the Edit button */
	onEdit?: (cat: Cat) => void;
}

export default function CatIdentityView({
	cat,
	onBack,
	onEdit,
}: CatIdentityViewProps) {
	const [activeTab, setActiveTab] = useState("dna");

	const tabs = [
		{
			id: "dna",
			label: "DNA",
			icon: "🧬",
			activeColor: "text-[#4359ea]",
			activeBorder: "border-[#4359ea]",
		},
		{
			id: "bio",
			label: "Bio",
			icon: "🐱",
			activeColor: "text-purple-600",
			activeBorder: "border-purple-600",
		},
		{
			id: "health",
			label: "Health",
			icon: "⚕️",
			activeColor: "text-emerald-600",
			activeBorder: "border-emerald-600",
		},
		{
			id: "owner",
			label: "Owner",
			icon: "👤",
			activeColor: "text-[#4359ea]",
			activeBorder: "border-[#4359ea]",
		},
		{
			id: "family",
			label: "Family",
			icon: "👨‍👩‍👧",
			activeColor: "text-green-500",
			activeBorder: "border-green-500",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col w-full">
			{/* ══════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════ */}
			<header className="bg-white px-5 md:px-8 py-3 flex items-center justify-between sticky top-0 z-40">
				<button
					type="button"
					onClick={onBack}
					className="border border-gray-200 rounded-lg p-2 text-gray-700 hover:bg-gray-50 transition-colors"
				>
					<ArrowLeft size={20} />
				</button>

				<div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
					<div className="flex items-center gap-2">
						<Image
							src="/assets/Logo Biru.png"
							alt="OLPaw Logo"
							width={24}
							height={24}
							className="object-contain"
						/>
						<span className="text-[16px] font-bold text-gray-900 tracking-tight">
							OLPaw{" "}
							<span className="font-medium text-gray-600">Cat Identity</span>
						</span>
					</div>
				</div>

				{/* Empty div for flex balance */}
				<div className="w-10"></div>
			</header>

			{/* ══════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════ */}
			<div className="px-4 md:px-8 py-4 w-full max-w-3xl xl:max-w-7xl mx-auto flex-1 flex flex-col gap-4">
				{/* ── Cat Profile Header ────────────────────────────────── */}
				<section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
					<div className="flex items-start justify-between">
						<div className="flex gap-4 items-center">
							{/* Circular Avatar */}
							<div className="w-[80px] h-[80px] rounded-full border-[3px] border-[#DDD6FE] relative overflow-hidden flex-shrink-0 bg-gray-100">
								<Image
									src={cat.imageUrl || "/assets/Logo Biru.png"}
									alt={cat.name}
									fill
									className="object-cover"
								/>
							</div>

							{/* Profile Info */}
							<div>
								<div className="flex items-center gap-1.5 mb-1">
									<h1 className="text-[22px] font-bold text-gray-900 leading-none">
										{cat.name}
									</h1>
									{cat.gender === "Female" ? (
										<span className="text-pink-500 font-bold text-[18px]">
											♀
										</span>
									) : (
										<span className="text-[#4359ea] font-bold text-[18px]">
											♂
										</span>
									)}
								</div>

								<p className="text-[12px] text-gray-400 mb-0.5">Cat ID</p>
								<div className="flex items-center gap-1.5 mb-2">
									<span className="text-[14px] font-bold text-gray-700 tracking-wide">
										{cat.tokenId === "#0012"
											? "PC-7K8D-9H2F"
											: `PC-${cat.id.substring(0, 4).toUpperCase()}`}
									</span>
									<Copy className="w-3.5 h-3.5 text-[#4359ea] cursor-pointer" />
								</div>

								{cat.verified && (
									<div className="inline-flex items-center gap-1 bg-[#F0FDF4] border border-[#BBF7D0] text-emerald-600 px-2 py-0.5 rounded-full">
										<CheckCircle2
											size={12}
											className="text-emerald-500"
											fill="white"
										/>
										<span className="text-[10px] font-bold uppercase tracking-wide">
											Identity Verified
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Edit Button */}
						<button
							type="button"
							onClick={() => onEdit?.(cat)}
							className="border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-[#4359ea] hover:bg-gray-50 transition-colors"
						>
							<Pencil size={14} />
							<span>Edit</span>
						</button>
					</div>
				</section>

				{/* ── Tabs Navigation ────────────────────────────────── */}
				<section className="bg-white rounded-t-2xl border border-gray-100 overflow-hidden shadow-sm">
					<div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 w-full">
						{tabs.map((tab) => {
							const isActive = activeTab === tab.id;
							return (
								<button
									type="button"
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`flex items-center justify-center min-w-[68px] sm:min-w-[80px] flex-1 gap-1 sm:gap-1.5 px-1 sm:px-3 py-3 text-[11px] sm:text-[13px] font-semibold transition-all relative ${
										isActive
											? tab.activeColor
											: "text-gray-500 hover:text-gray-800"
									}`}
								>
									<span className="text-[12px] sm:text-[16px] leading-none">
										{tab.icon}
									</span>
									<span className="truncate max-w-full">{tab.label}</span>
									{isActive && (
										<div
											className={`absolute bottom-0 left-0 right-0 h-[2.5px] ${tab.activeBorder} border-b-2`}
										></div>
									)}
								</button>
							);
						})}
					</div>

					{/* ── Tabs Content ────────────────────────────────── */}
					<div className="p-4 md:p-5 min-h-[400px] bg-white">
						{activeTab === "dna" && <DNATab cat={cat} />}
						{activeTab === "bio" && <BioTab cat={cat} />}
						{activeTab === "health" && <HealthTab cat={cat} />}
						{activeTab === "owner" && <OwnerTab cat={cat} />}
						{activeTab === "family" && <FamilyTab cat={cat} />}
					</div>
				</section>
			</div>
		</div>
	);
}
