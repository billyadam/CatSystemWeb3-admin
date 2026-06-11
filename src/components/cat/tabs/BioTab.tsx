import { Calendar, Check, Heart, PawPrint, Utensils, X } from "lucide-react";
import type { Cat } from "@/types/cat";

function BoolBadge({
	value,
	labelTrue,
	labelFalse,
}: {
	value: boolean;
	labelTrue: string;
	labelFalse: string;
}) {
	return value ? (
		<span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full text-[11px] font-semibold">
			<Check size={12} /> {labelTrue}
		</span>
	) : (
		<span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full text-[11px] font-semibold">
			<X size={12} /> {labelFalse}
		</span>
	);
}

export default function BioTab({ cat }: { cat: Cat }) {
	const bio = cat.bio;

	return (
		<div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
			{/* About */}
			<div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
				<h2 className="text-[16px] font-bold text-gray-900 mb-2 flex items-center gap-2">
					<PawPrint size={18} className="text-purple-500" />
					About {cat.name}
				</h2>
				<p className="text-[14px] text-gray-700 leading-relaxed mb-3">
					{cat.about ||
						`${cat.name} is a beautiful ${cat.ageLabel} old ${cat.gender.toLowerCase()} ${cat.breed}.`}
				</p>
				<p className="text-[13px] text-gray-500">
					Registered on the OLPaw platform on{" "}
					<span className="font-medium text-gray-700">
						{cat.registeredAt || "Unknown"}
					</span>
					, ensuring full authenticity.
				</p>
			</div>

			{/* Bio Details */}
			{bio && (
				<div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
					<h3 className="font-bold text-[15px] text-gray-900 flex items-center gap-2">
						<Calendar size={16} className="text-[#4359ea]" />
						Details
					</h3>

					<div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[13px]">
						<div>
							<span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
								Date of Birth
							</span>
							<span className="font-medium text-gray-800">
								{bio.dateOfBirth}
							</span>
						</div>
						<div>
							<span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
								Color
							</span>
							<span className="font-medium text-gray-800">{bio.color}</span>
						</div>
						<div className="col-span-2">
							<span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold mb-1">
								Personality
							</span>
							<div className="flex flex-wrap gap-1.5">
								{bio.personality.map((p) => (
									<span
										key={p}
										className="bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
									>
										{p}
									</span>
								))}
							</div>
						</div>
					</div>

					{/* Status badges */}
					<div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
						<BoolBadge
							value={bio.vaccinated}
							labelTrue="Vaccinated"
							labelFalse="Not Vaccinated"
						/>
						<BoolBadge
							value={bio.neutered}
							labelTrue="Neutered"
							labelFalse="Not Neutered"
						/>
						<BoolBadge
							value={bio.indoor}
							labelTrue="Indoor"
							labelFalse="Outdoor"
						/>
					</div>
				</div>
			)}

			{/* Diet & Preferences */}
			{bio && (
				<div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 shadow-sm">
					<h3 className="font-bold text-[15px] text-gray-900 flex items-center gap-2 mb-3">
						<Utensils size={16} className="text-amber-600" />
						Diet & Preferences
					</h3>
					<div className="space-y-2 text-[13px]">
						<div className="flex justify-between">
							<span className="text-gray-500">Diet</span>
							<span className="font-medium text-gray-800">{bio.diet}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-500">Favorite Food</span>
							<span className="font-medium text-gray-800 flex items-center gap-1">
								<Heart size={12} className="text-red-400" />
								{bio.favoriteFood}
							</span>
						</div>
					</div>
					{bio.specialNotes && (
						<div className="mt-3 pt-3 border-t border-amber-100">
							<span className="text-gray-400 text-[11px] uppercase tracking-wider font-semibold block mb-1">
								Special Notes
							</span>
							<p className="text-[13px] text-gray-600 italic">
								{bio.specialNotes}
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
