"use client";

import Image from "next/image";
import type { Cat } from "@/types/cat";

interface CatCardProps {
	cat: Cat;
	onViewDetails?: (cat: Cat) => void;
}

export default function CatCard({ cat, onViewDetails }: CatCardProps) {
	return (
		<button
			type="button"
			className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow duration-200 cursor-pointer w-full text-left"
			onClick={() => onViewDetails?.(cat)}
		>
			{/* Avatar area */}
			<div
				className="w-20 h-20 rounded-[16px] flex-shrink-0 flex items-center justify-center relative overflow-hidden"
				style={{ backgroundColor: cat.cardBg }}
			>
				{cat.imageUrl ? (
					<Image
						src={cat.imageUrl}
						alt={cat.name}
						fill
						className="object-cover"
					/>
				) : (
					<Image
						src="/assets/Identification paw simbol.png"
						alt="paw watermark"
						width={40}
						height={40}
						className="opacity-25 object-contain select-none"
					/>
				)}
			</div>

			{/* Info */}
			<div className="flex-1 min-w-0">
				<h3 className="font-bold text-gray-900 text-[18px] leading-tight mb-1">
					{cat.name}
				</h3>

				<div className="flex items-center gap-2 mb-1">
					<span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border border-gray-100 text-gray-500">
						{cat.gender === "Female" ? (
							<>
								<svg
									aria-hidden="true"
									className="w-3 h-3"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="12" cy="9" r="6" />
									<path d="M12 15v6M9 18h6" />
								</svg>
								Female
							</>
						) : (
							<>
								<svg
									aria-hidden="true"
									className="w-3 h-3"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M16 3h5v5" />
									<path d="m21 3-5 5" />
									<circle cx="10" cy="14" r="6" />
								</svg>
								Male
							</>
						)}
					</span>
				</div>

				<p className="text-[13px] text-gray-600 mb-0.5 truncate">{cat.breed}</p>
				<p className="text-[11px] text-gray-400 truncate">
					Registered on {cat.registeredAt || "Unknown"}
				</p>
			</div>

			{/* Chevron Right */}
			<div className="flex-shrink-0 text-gray-400 pl-2">
				<svg
					aria-hidden="true"
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</div>
		</button>
	);
}
