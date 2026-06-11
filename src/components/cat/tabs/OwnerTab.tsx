import {
	CheckCircle2,
	Clock,
	Copy,
	Mail,
	MapPin,
	ShieldCheck,
	User,
	Wallet,
	XCircle,
} from "lucide-react";
import type { Cat } from "@/types/cat";

const VERIFICATION_CFG = {
	Verified: {
		icon: CheckCircle2,
		color: "text-emerald-600",
		bg: "bg-emerald-50",
		border: "border-emerald-100",
		label: "Verified",
	},
	Pending: {
		icon: Clock,
		color: "text-amber-600",
		bg: "bg-amber-50",
		border: "border-amber-100",
		label: "Pending",
	},
	Unverified: {
		icon: XCircle,
		color: "text-red-500",
		bg: "bg-red-50",
		border: "border-red-100",
		label: "Unverified",
	},
} as const;

export default function OwnerTab({ cat }: { cat: Cat }) {
	const owner = cat.owner;

	if (!owner) {
		return (
			<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
				<div className="bg-[#4359ea]/5 border border-[#4359ea]/10 rounded-2xl p-5">
					<p className="text-[14px] text-gray-600">
						Currently owned by you. Registered on Solana Network.
					</p>
					<div className="mt-4 pt-4 border-t border-[#4359ea]/10">
						<p className="text-[12px] font-semibold text-[#4359ea] uppercase tracking-wider mb-1">
							Contract Address
						</p>
						<p className="text-[13px] font-mono bg-white px-2 py-1 rounded border border-[#4359ea]/10 break-all">
							0x1234567890abcdef1234567890abcdef12345678
						</p>
					</div>
				</div>
			</div>
		);
	}

	const vcfg = VERIFICATION_CFG[owner.verificationStatus];

	return (
		<div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
			{/* Owner Card */}
			<div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-12 h-12 rounded-full bg-[#4359ea]/10 flex items-center justify-center">
						<User size={22} className="text-[#4359ea]" />
					</div>
					<div>
						<h3 className="font-bold text-[16px] text-gray-900">
							{owner.name}
						</h3>
						<div
							className={`inline-flex items-center gap-1 ${vcfg.bg} ${vcfg.border} border ${vcfg.color} px-2 py-0.5 rounded-full mt-0.5`}
						>
							<vcfg.icon size={12} />
							<span className="text-[10px] font-bold uppercase tracking-wide">
								{vcfg.label}
							</span>
						</div>
					</div>
				</div>

				<div className="space-y-3 text-[13px]">
					<div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
						<Wallet size={16} className="text-gray-400 flex-shrink-0" />
						<div className="flex-1 min-w-0">
							<span className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold block">
								Wallet Address
							</span>
							<span className="font-mono text-[12px] text-gray-700 break-all">
								{owner.walletAddress}
							</span>
						</div>
						<Copy
							size={14}
							className="text-[#4359ea] cursor-pointer flex-shrink-0"
						/>
					</div>

					<div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
						<MapPin size={16} className="text-gray-400 flex-shrink-0" />
						<div>
							<span className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold block">
								Location
							</span>
							<span className="font-medium text-gray-800">
								{owner.location}
							</span>
						</div>
					</div>

					{owner.contactEmail && (
						<div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
							<Mail size={16} className="text-gray-400 flex-shrink-0" />
							<div>
								<span className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold block">
									Email
								</span>
								<span className="font-medium text-gray-800">
									{owner.contactEmail}
								</span>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Registration Info */}
			<div className="bg-[#4359ea]/5 border border-[#4359ea]/10 rounded-2xl p-5 shadow-sm">
				<div className="flex items-center gap-2 mb-3">
					<ShieldCheck size={18} className="text-[#4359ea]" />
					<h3 className="font-bold text-[15px] text-[#4359ea]">Registration</h3>
				</div>
				<div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[13px]">
					<div>
						<span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
							Registered
						</span>
						<span className="font-medium text-gray-800">
							{owner.registeredDate}
						</span>
					</div>
					<div>
						<span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
							Total Cats
						</span>
						<span className="font-medium text-gray-800">{owner.totalCats}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
