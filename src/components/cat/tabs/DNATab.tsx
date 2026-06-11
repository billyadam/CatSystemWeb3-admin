import { CheckCircle2, ChevronRight, Shield } from "lucide-react";
import Image from "next/image";
import type { Cat } from "@/types/cat";

/** Colour map for breed composition – converts Tailwind classes to hex for pie chart */
const COLOR_MAP: Record<string, string> = {
	"bg-blue-500": "#3B82F6",
	"bg-purple-500": "#8B5CF6",
	"bg-green-500": "#22C55E",
	"bg-gray-500": "#6B7280",
};

/** Builds a conic-gradient string from breed composition data */
function buildConicGradient(data: { percentage: number; color: string }[]) {
	let cumulative = 0;
	const stops: string[] = [];
	for (const item of data) {
		const hex = COLOR_MAP[item.color] || "#6B7280";
		const start = cumulative;
		cumulative += item.percentage;
		stops.push(`${hex} ${start}% ${cumulative}%`);
	}
	return `conic-gradient(${stops.join(", ")})`;
}

export default function DNATab({ cat }: { cat: Cat }) {
	return (
		<div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
			{/* ─── Card 1: Genetic Profile ─────────────────────────── */}
			<div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
				<div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-3">
					<Image
						src="/assets/Identification DNA simbol.png"
						alt="DNA"
						width={22}
						height={22}
						className="object-contain"
					/>
					<h3 className="font-bold text-[#4359ea] text-[15px]">
						Genetic Profile
					</h3>
				</div>
				<div className="space-y-3">
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Breed</span>
						<span className="font-semibold text-gray-900">
							{cat.dnaProfile?.breed || "Unknown"}
						</span>
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Eye Color</span>
						<span className="font-semibold text-gray-900">
							{cat.dnaProfile?.eyeColor || "Unknown"}
						</span>
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Coat Color</span>
						<span className="font-semibold text-gray-900">
							{cat.dnaProfile?.coatColor || "Unknown"}
						</span>
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Coat Length</span>
						<span className="font-semibold text-gray-900">
							{cat.dnaProfile?.coatLength || "Unknown"}
						</span>
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Ear Type</span>
						<span className="font-semibold text-gray-900">
							{cat.dnaProfile?.earType || "Unknown"}
						</span>
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Body Size</span>
						<span className="font-semibold text-gray-900">
							{cat.dnaProfile?.bodySize || "Unknown"}
						</span>
					</div>
				</div>
				<div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between cursor-pointer group">
					<span className="text-[#4359ea] text-[13px] font-bold group-hover:underline">
						View Full DNA Report
					</span>
					<ChevronRight size={16} className="text-[#4359ea]" />
				</div>
			</div>

			{/* ─── Card 2: Breed Composition (Pie Chart) ────────────── */}
			{cat.breedComposition && cat.breedComposition.length > 0 && (
				<div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
					<div className="flex items-center gap-2 mb-4">
						<div className="w-6 h-6 rounded-full bg-[#4359ea]/10 flex items-center justify-center">
							<div className="w-3 h-3 rounded-full bg-[#4359ea]" />
						</div>
						<h3 className="font-bold text-gray-900 text-[15px]">
							Breed Composition
						</h3>
					</div>

					<div className="flex items-center gap-8">
						{/* Pie Chart */}
						<div className="relative w-[140px] h-[140px] flex-shrink-0">
							<div
								className="w-full h-full rounded-full"
								style={{
									background: buildConicGradient(cat.breedComposition),
								}}
							/>
							{/* Center label overlay */}
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-[70px] h-[70px] rounded-full bg-white flex items-center justify-center shadow-sm">
									<span className="text-[16px] font-bold text-gray-800">
										{cat.breedComposition[0]?.percentage}%
									</span>
								</div>
							</div>
							{/* Percentage labels around the chart */}
							{cat.breedComposition.map((item, i) => {
								const positions = [
									{ top: "38%", left: "22%" },
									{ top: "8%", left: "20%" },
									{ top: "18%", left: "68%" },
									{ top: "78%", left: "12%" },
								];
								const pos = positions[i] || positions[0];
								if (i === 0) return null; // main % shown in center
								return (
									<span
										key={item.breed}
										className="absolute text-[10px] font-bold text-white drop-shadow-md"
										style={{ top: pos.top, left: pos.left }}
									>
										{item.percentage}%
									</span>
								);
							})}
						</div>

						{/* Legend */}
						<div className="space-y-2.5 flex-1">
							{cat.breedComposition.map((item) => {
								const hex = COLOR_MAP[item.color] || "#6B7280";
								return (
									<div key={item.breed} className="flex items-center gap-2.5">
										<span
											className="w-3 h-3 rounded-full flex-shrink-0"
											style={{ backgroundColor: hex }}
										/>
										<span className="text-[13px] font-bold text-gray-800 min-w-[36px]">
											{item.percentage}%
										</span>
										<span className="text-[13px] text-gray-600">
											{item.breed}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}

			{/* ─── Card 3: Genetic Traits ──────────────────────────── */}
			{cat.geneticTraits && cat.geneticTraits.length > 0 && (
				<div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
					<div className="flex items-center gap-2 mb-4">
						<div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
							<CheckCircle2 size={14} className="text-emerald-600" />
						</div>
						<h3 className="font-bold text-gray-900 text-[15px]">
							Genetic Traits
						</h3>
					</div>
					<div className="grid grid-cols-2 gap-3">
						{cat.geneticTraits.map((trait) => (
							<div key={trait.label} className="flex items-center gap-2">
								<CheckCircle2
									size={18}
									className={
										trait.present ? "text-emerald-500" : "text-gray-300"
									}
								/>
								<span
									className={`text-[13px] ${
										trait.present
											? "text-gray-800 font-medium"
											: "text-gray-400 line-through"
									}`}
								>
									{trait.label}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* ─── Card 4: Genetic Markers ─────────────────────────── */}
			{cat.geneticMarkers && cat.geneticMarkers.length > 0 && (
				<div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
					<div className="flex items-center gap-2 mb-4">
						<div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
							<Shield size={14} className="text-purple-600" />
						</div>
						<h3 className="font-bold text-gray-900 text-[15px]">
							Genetic Markers
						</h3>
					</div>

					{/* Table header */}
					<div className="grid grid-cols-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-100">
						<span>Marker (SNP)</span>
						<span>Genotype</span>
						<span>Chromosome</span>
						<span className="text-right">Position</span>
						<span className="text-right">Value</span>
					</div>

					{/* Table rows */}
					{cat.geneticMarkers.map((m) => (
						<div
							key={m.marker}
							className="grid grid-cols-5 text-[13px] py-2.5 border-b border-gray-50 last:border-0"
						>
							<span className="font-semibold text-gray-800">{m.marker}</span>
							<span className="text-gray-600">{m.genotype}</span>
							<span className="text-gray-600">{m.chromosome}</span>
							<span className="text-gray-600 text-right">
								{m.position.toLocaleString()}
							</span>
							<span className="text-gray-800 font-semibold text-right">
								{m.value.toFixed(2)}
							</span>
						</div>
					))}
				</div>
			)}

			{/* ─── Card 5: Traits & Markers (legacy card) ──────────── */}
			<div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-4 shadow-sm">
				<div className="flex items-center gap-2 mb-3 border-b border-purple-200 pb-3">
					<Image
						src="/assets/Identification paw simbol.png"
						alt="Paw"
						width={22}
						height={22}
						className="object-contain"
					/>
					<h3 className="font-bold text-purple-700 text-[15px]">
						Traits & Markers
					</h3>
				</div>
				<div className="space-y-3">
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Fur Length Gene</span>
						<span className="font-semibold text-gray-900">
							{cat.traits?.furLengthGene || "Unknown"}
						</span>
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Dilution Gene</span>
						<span className="font-semibold text-gray-900">
							{cat.traits?.dilutionGene || "Unknown"}
						</span>
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">White Spotting</span>
						<span className="font-semibold text-gray-900">
							{cat.traits?.whiteSpotting || "Unknown"}
						</span>
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Brachycephalic Gene</span>
						<span className="font-semibold text-gray-900">
							{cat.traits?.brachycephalicGene || "Unknown"}
						</span>
					</div>
				</div>
				<div className="mt-4 pt-3 border-t border-purple-200 flex items-center justify-between cursor-pointer group">
					<span className="text-purple-700 text-[13px] font-bold group-hover:underline">
						View All Genetic Traits
					</span>
					<ChevronRight size={16} className="text-purple-700" />
				</div>
			</div>

			{/* ─── Card 6: Blockchain Verification ─────────────────── */}
			{cat.blockchainVerification && (
				<div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
					<div className="flex items-center gap-2 mb-4">
						<div className="w-6 h-6 rounded-full bg-[#4359ea]/10 flex items-center justify-center">
							<Shield size={14} className="text-[#4359ea]" />
						</div>
						<h3 className="font-bold text-gray-900 text-[15px]">
							Blockchain Verification
						</h3>
					</div>
					<div className="space-y-3">
						<div className="flex justify-between items-start text-[13px]">
							<span className="text-gray-500 flex-shrink-0">
								Transaction Hash (ID)
							</span>
							<span className="font-mono text-[11px] text-gray-700 text-right break-all ml-4 max-w-[260px]">
								{cat.blockchainVerification.transactionHash}
							</span>
						</div>
						<div className="flex justify-between items-center text-[13px] border-t border-gray-50 pt-3">
							<span className="text-gray-500">Timestamp (UTC)</span>
							<span className="font-semibold text-gray-800">
								{cat.blockchainVerification.timestamp}
							</span>
						</div>
						<div className="flex justify-between items-center text-[13px] border-t border-gray-50 pt-3">
							<span className="text-gray-500">Verified By</span>
							<span className="flex items-center gap-1.5 font-semibold text-gray-800">
								<CheckCircle2 size={14} className="text-emerald-500" />
								{cat.blockchainVerification.verifiedBy}
							</span>
						</div>
					</div>
				</div>
			)}

			{/* ─── Card 7: DNA Ancestry ────────────────────────────── */}
			<div className="bg-cyan-50/50 border border-cyan-100 rounded-2xl p-4 shadow-sm">
				<div className="flex items-center gap-2 mb-3 border-b border-cyan-100 pb-3 opacity-70">
					<Image
						src="/assets/Identification ancestry simbol.png"
						alt="Ancestry"
						width={22}
						height={22}
						className="object-contain grayscale"
					/>
					<h3 className="font-bold text-cyan-800 text-[15px]">DNA Ancestry</h3>
				</div>
				<div className="space-y-3 opacity-80">
					{cat.ancestry && cat.ancestry.length > 0 ? (
						cat.ancestry.map((ancestry) => (
							<div
								key={ancestry.region}
								className="flex items-center justify-between text-[13px]"
							>
								<div className="flex items-center gap-2 w-32">
									<span
										className={`w-2 h-2 rounded-full ${ancestry.color || "bg-gray-400"}`}
									></span>
									<span className="text-gray-600 truncate">
										{ancestry.region}
									</span>
								</div>
								<div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
									<div
										className={`h-full ${ancestry.color || "bg-gray-400"} rounded-full`}
										style={{ width: `${ancestry.percentage}%` }}
									></div>
								</div>
								<span className="font-medium text-gray-500 w-8 text-right">
									{ancestry.percentage}%
								</span>
							</div>
						))
					) : (
						<div className="text-[13px] text-gray-500 text-center py-2">
							Ancestry data is being analyzed.
						</div>
					)}
				</div>
				<div className="mt-4 pt-3 border-t border-cyan-100 flex items-center justify-between cursor-pointer group opacity-60">
					<span className="text-cyan-800 text-[13px] font-bold">
						View Ancestry Map
					</span>
					<ChevronRight size={16} className="text-cyan-800" />
				</div>
			</div>
		</div>
	);
}
