import { Shield } from "lucide-react";
import Image from "next/image";
import type { Cat, CatFamilyMember } from "@/types/cat";

/** Small circular avatar used throughout the tree */
function Avatar({
	member,
	size = 64,
}: {
	member: CatFamilyMember;
	size?: number;
}) {
	return (
		<div className="flex flex-col items-center gap-1">
			<div
				className="rounded-full border-[2.5px] border-purple-200 overflow-hidden bg-gray-100 flex-shrink-0"
				style={{ width: size, height: size }}
			>
				{member.imageUrl ? (
					<Image
						src={member.imageUrl}
						alt={member.name}
						width={size}
						height={size}
						className="object-cover w-full h-full"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-purple-400 font-bold text-lg">
						{member.name[0]}
					</div>
				)}
			</div>
			<span className="font-bold text-[13px] text-gray-900 text-center leading-tight">
				{member.name}
			</span>
			{member.breed && (
				<span className="text-[11px] text-gray-500 text-center leading-tight">
					{member.breed}
				</span>
			)}
			<span className="text-[10px] text-gray-400 font-medium">
				ID: {member.pawId || member.tokenId}
			</span>
		</div>
	);
}

/** The cat itself shown in the centre of the tree */
function CatAvatar({ cat }: { cat: Cat }) {
	return (
		<div className="flex flex-col items-center gap-1">
			<div className="w-[80px] h-[80px] rounded-full border-[3px] border-purple-300 overflow-hidden bg-gray-100 shadow-md">
				{cat.imageUrl ? (
					<Image
						src={cat.imageUrl}
						alt={cat.name}
						width={80}
						height={80}
						className="object-cover w-full h-full"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-purple-500 font-bold text-2xl">
						{cat.name[0]}
					</div>
				)}
			</div>
			<span className="font-bold text-[15px] text-gray-900">{cat.name}</span>
			<span className="text-[11px] text-gray-400 font-medium">
				ID:{" "}
				{cat.tokenId === "#0012"
					? "PAW-7K8D"
					: `PAW-${cat.id.slice(-4).toUpperCase()}`}
			</span>
		</div>
	);
}

export default function FamilyTab({ cat }: { cat: Cat }) {
	if (!cat.family || cat.family.length === 0) {
		return (
			<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
				<div className="bg-green-50 border border-green-100 rounded-2xl p-5">
					<p className="text-[14px] text-gray-600">
						Ancestry tree is currently being analyzed and verified on-chain.
					</p>
				</div>
			</div>
		);
	}

	const parents = cat.family.filter(
		(m) => m.relation === "Sire" || m.relation === "Dam",
	);
	const grandparents = cat.family.filter((m) => m.relation === "Grandparent");

	return (
		<div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-0">
			{/* ── Visual Family Tree ──────────────────────────────── */}
			<div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
				{/* ── Parents ───────────────────────── */}
				{parents.length > 0 && (
					<>
						<p className="text-center text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
							Parents
						</p>

						<div className="flex justify-center gap-6">
							{parents.map((p) => (
								<div
									key={p.id}
									className="bg-purple-50/60 border border-purple-100 rounded-2xl px-4 py-3"
								>
									<Avatar member={p} size={56} />
								</div>
							))}
						</div>

						{/* Connecting lines: parents → cat */}
						<div className="flex justify-center my-0">
							<div className="flex flex-col items-center">
								{/* Horizontal connector between parents */}
								<div className="w-[180px] border-t-2 border-dashed border-purple-200" />
								{/* Vertical line down */}
								<div className="h-6 border-l-2 border-dashed border-purple-200" />
							</div>
						</div>
					</>
				)}

				{/* ── Current Cat ───────────────────── */}
				<div className="flex justify-center">
					<CatAvatar cat={cat} />
				</div>

				{/* ── Grandparents ──────────────────── */}
				{grandparents.length > 0 && (
					<>
						{/* Connecting lines: cat → grandparents */}
						<div className="flex justify-center my-0">
							<div className="flex flex-col items-center">
								<div className="h-6 border-l-2 border-dashed border-purple-200" />
								<div className="w-[260px] border-t-2 border-dashed border-purple-200" />
							</div>
						</div>

						<p className="text-center text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-1">
							Grandparents
						</p>

						<div className="flex justify-center gap-3 flex-wrap">
							{grandparents.map((gp) => (
								<div key={gp.id} className="flex flex-col items-center">
									<Avatar member={gp} size={48} />
								</div>
							))}
						</div>
					</>
				)}
			</div>

			{/* ── Pedigree Verified Banner ────────────────────────── */}
			<div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-center gap-3 mt-4">
				<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
					<Shield size={20} className="text-purple-600" />
				</div>
				<div>
					<p className="font-bold text-[14px] text-purple-800">
						Pedigree Verified
					</p>
					<p className="text-[12px] text-gray-500">
						All lineage data is stored on blockchain
					</p>
				</div>
			</div>
		</div>
	);
}
