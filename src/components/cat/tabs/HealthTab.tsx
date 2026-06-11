import {
	Activity,
	AlertTriangle,
	CheckCircle2,
	ClipboardList,
	Stethoscope,
	Syringe,
} from "lucide-react";
import type { Cat } from "@/types/cat";

const STATUS_MAP = {
	Healthy: {
		color: "text-emerald-700",
		bg: "bg-emerald-50",
		border: "border-emerald-100",
		icon: CheckCircle2,
	},
	"Needs Attention": {
		color: "text-amber-700",
		bg: "bg-amber-50",
		border: "border-amber-100",
		icon: AlertTriangle,
	},
	Critical: {
		color: "text-red-700",
		bg: "bg-red-50",
		border: "border-red-100",
		icon: AlertTriangle,
	},
} as const;

const RECORD_ICON = {
	vaccine: Syringe,
	checkup: Stethoscope,
	surgery: Activity,
	other: ClipboardList,
} as const;

export default function HealthTab({ cat }: { cat: Cat }) {
	const hs = cat.healthSummary;
	const statusCfg = hs ? STATUS_MAP[hs.status] : null;

	return (
		<div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
			{/* ── Health Summary ─────────────────────────────────── */}
			{hs && statusCfg && (
				<div
					className={`${statusCfg.bg} border ${statusCfg.border} rounded-2xl p-5 shadow-sm`}
				>
					<div className="flex items-center gap-2 mb-3">
						<statusCfg.icon size={18} className={statusCfg.color} />
						<h3 className={`font-bold text-[15px] ${statusCfg.color}`}>
							{hs.status}
						</h3>
					</div>
					<div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[13px]">
						<div>
							<span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
								Weight
							</span>
							<span className="font-medium text-gray-800">{hs.weight}</span>
						</div>
						<div>
							<span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
								Last Checkup
							</span>
							<span className="font-medium text-gray-800">
								{hs.lastCheckup}
							</span>
						</div>
						<div>
							<span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
								Next Checkup
							</span>
							<span className="font-medium text-gray-800">
								{hs.nextCheckup}
							</span>
						</div>
						<div>
							<span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
								Allergies
							</span>
							<span className="font-medium text-gray-800">
								{hs.allergies.join(", ")}
							</span>
						</div>
						{hs.conditions.length > 0 && hs.conditions[0] !== "None" && (
							<div className="col-span-2">
								<span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold mb-0.5">
									Conditions
								</span>
								<span className="font-medium text-amber-700">
									{hs.conditions.join(", ")}
								</span>
							</div>
						)}
					</div>
				</div>
			)}

			{/* ── Medical Records ────────────────────────────────── */}
			<h2 className="text-[16px] font-bold text-gray-900 flex items-center gap-2">
				<ClipboardList size={18} className="text-emerald-600" />
				Medical Records
			</h2>

			{cat.medicalRecords && cat.medicalRecords.length > 0 ? (
				<div className="space-y-3">
					{cat.medicalRecords.map((record) => {
						const Icon = RECORD_ICON[record.type] || ClipboardList;
						return (
							<div
								key={record.id}
								className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
							>
								<div className="flex justify-between items-start mb-2">
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
											<Icon size={14} className="text-emerald-600" />
										</div>
										<h3 className="font-bold text-[14px] text-gray-900">
											{record.title}
										</h3>
									</div>
									<span className="text-[11px] font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md flex-shrink-0">
										{record.date}
									</span>
								</div>
								<p className="text-[13px] text-gray-600 ml-10 mb-2">
									{record.description}
								</p>
								{(record.doctor || record.clinic) && (
									<p className="text-[11px] text-gray-400 font-medium ml-10">
										{record.doctor} {record.clinic && `• ${record.clinic}`}
									</p>
								)}
							</div>
						);
					})}
				</div>
			) : (
				<div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
					<p className="text-[14px] text-gray-600">
						No medical issues reported. Up to date on all vaccinations.
					</p>
				</div>
			)}
		</div>
	);
}
