"use client";

import { ArrowLeft, Camera, Save, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { Cat } from "@/types/cat";
import { type CatFormData, EMPTY_CAT_FORM } from "@/types/catForm";

/* ================================================================
   Props
   ================================================================ */
interface CatFormViewProps {
	/** If provided the form starts in EDIT mode pre-filled with the cat data. */
	cat?: Cat;
	/** Called when the user taps ← or cancels. */
	onBack: () => void;
	/** Called with the validated form payload + optional image file. */
	onSave: (data: CatFormData, imageFile: File | null) => void;
}

/* ================================================================
   Helper – build initial form data from a Cat object (edit mode)
   ================================================================ */
function catToFormData(cat: Cat): CatFormData {
	return {
		name: cat.name,
		breed: cat.breed,
		gender: cat.gender,
		dateOfBirth: "",
		color: "",
		weight: cat.weight || "",
		eyeColor: cat.eyeColor || "",
		microchip: cat.microchip || "",
		breedPredisposition: cat.dnaProfile?.breed || "",
		coatPattern: cat.dnaProfile?.coatColor || "",
		eyeColorGene: cat.dnaProfile?.eyeColor || "",
		bloodType: "",
		geneticDiversity: "",
		inbreedingCoefficient: "",
		furLengthGene: cat.traits?.furLengthGene || "",
		dilutionGene: cat.traits?.dilutionGene || "",
		whiteSpotting: cat.traits?.whiteSpotting || "",
		brachycephalicGene: cat.traits?.brachycephalicGene || "",
		ancestryEuropean:
			cat.ancestry
				?.find((a) => a.region === "European Domestic")
				?.percentage.toString() || "",
		ancestryAsian:
			cat.ancestry
				?.find((a) => a.region === "Asian Domestic")
				?.percentage.toString() || "",
		ancestryAfrican:
			cat.ancestry
				?.find((a) => a.region === "African Wildcat")
				?.percentage.toString() || "",
		ancestryMiddleEastern:
			cat.ancestry
				?.find((a) => a.region === "Middle Eastern")
				?.percentage.toString() || "",
	};
}

/* ================================================================
   Component
   ================================================================ */
export default function CatFormView({ cat, onBack, onSave }: CatFormViewProps) {
	const isEdit = !!cat;
	const [form, setForm] = useState<CatFormData>(
		isEdit ? catToFormData(cat) : EMPTY_CAT_FORM,
	);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(
		cat?.imageUrl || null,
	);
	const fileInputRef = useRef<HTMLInputElement>(null);

	/* ── field updater ─────────────────────────────────────────── */
	const update = useCallback(
		(field: keyof CatFormData, value: string) =>
			setForm((prev) => ({ ...prev, [field]: value })),
		[],
	);

	/* ── image handlers ────────────────────────────────────────── */
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setImageFile(file);
		const reader = new FileReader();
		reader.onloadend = () => setImagePreview(reader.result as string);
		reader.readAsDataURL(file);
	};

	const removeImage = () => {
		setImageFile(null);
		setImagePreview(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	/* ── save ───────────────────────────────────────────────────── */
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(form, imageFile);
	};

	/* ── reusable input component ───────────────────────────────── */
	const Field = ({
		label,
		field,
		placeholder,
		type = "text",
	}: {
		label: string;
		field: keyof CatFormData;
		placeholder?: string;
		type?: string;
	}) => (
		<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
			<label
				htmlFor={`field-${field}`}
				className="text-[13px] font-medium text-gray-600 sm:w-[160px] shrink-0"
			>
				{label}
			</label>
			<input
				id={`field-${field}`}
				type={type}
				value={form[field]}
				onChange={(e) => update(field, e.target.value)}
				placeholder={placeholder || label}
				className="flex-1 h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-900 placeholder:text-gray-300
                           focus:outline-none focus:ring-2 focus:ring-[#4359ea]/30 focus:border-[#4359ea] transition-all"
			/>
		</div>
	);

	/* ── section heading component ──────────────────────────────── */
	const SectionTitle = ({
		title,
		color = "text-[#4359ea]",
	}: {
		title: string;
		color?: string;
	}) => (
		<h3
			className={`text-[15px] font-bold ${color} mb-3 flex items-center gap-2`}
		>
			<span className="w-1 h-5 rounded-full bg-current opacity-60" />
			{title}
		</h3>
	);

	return (
		<form
			onSubmit={handleSubmit}
			className="min-h-screen bg-gray-50 flex flex-col w-full"
		>
			{/* ══════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════ */}
			<header className="bg-white px-5 md:px-8 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-gray-100">
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
				<div className="w-10" />
			</header>

			{/* ══════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════ */}
			<div className="px-4 md:px-8 py-5 w-full max-w-3xl xl:max-w-4xl mx-auto flex-1 flex flex-col gap-5">
				{/* ── Photo Upload Section ──────────────────────────── */}
				<section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col items-center gap-4">
					<div className="relative group">
						{imagePreview ? (
							<div className="relative w-[180px] h-[180px] rounded-2xl overflow-hidden border-2 border-dashed border-[#4359ea]/30 bg-gray-50">
								<Image
									src={imagePreview}
									alt="Cat photo"
									fill
									className="object-cover"
								/>
								{/* Overlay on hover */}
								<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
									<button
										type="button"
										onClick={() => fileInputRef.current?.click()}
										className="bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
									>
										<Camera size={18} className="text-[#4359ea]" />
									</button>
									<button
										type="button"
										onClick={removeImage}
										className="bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
									>
										<X size={18} className="text-red-500" />
									</button>
								</div>
							</div>
						) : (
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="w-[180px] h-[180px] rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50
                                           hover:border-[#4359ea] hover:bg-[#4359ea]/5 transition-all duration-200
                                           flex flex-col items-center justify-center gap-2 cursor-pointer group"
							>
								<div className="w-12 h-12 rounded-full bg-[#4359ea]/10 flex items-center justify-center group-hover:bg-[#4359ea]/20 transition-colors">
									<Camera
										size={22}
										className="text-[#4359ea] group-hover:scale-110 transition-transform"
									/>
								</div>
								<span className="text-[13px] font-medium text-gray-400 group-hover:text-[#4359ea] transition-colors">
									Upload Foto
								</span>
							</button>
						)}

						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleImageChange}
						/>
					</div>

					{isEdit && !imageFile && imagePreview && (
						<p className="text-[11px] text-gray-400 text-center">
							Hover foto untuk mengganti atau menghapus
						</p>
					)}
				</section>

				{/* ── Form Title ────────────────────────────────────── */}
				<div className="px-1">
					<h2 className="text-[18px] font-bold text-gray-900">
						{isEdit ? "Edit Data Kucing" : "Buat Data Kucing Baru"}
					</h2>
					<p className="text-[13px] text-gray-400 mt-0.5">
						{isEdit
							? "Perbarui informasi kucing Anda di bawah ini."
							: "Isi informasi kucing Anda di bawah ini."}
					</p>
				</div>

				{/* ── Basic Info ────────────────────────────────────── */}
				<section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
					<SectionTitle title="Informasi Dasar" />

					<Field label="Nama" field="name" placeholder="Nama kucing" />

					{/* Gender radio */}
					<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
						<span className="text-[13px] font-medium text-gray-600 sm:w-[160px] shrink-0">
							Jenis Kelamin
						</span>
						<div className="flex gap-3">
							{(["Male", "Female"] as const).map((g) => (
								<button
									key={g}
									type="button"
									onClick={() => update("gender", g)}
									className={`px-4 py-2 rounded-xl text-[13px] font-semibold border transition-all ${
										form.gender === g
											? g === "Male"
												? "bg-[#4359ea]/10 border-[#4359ea] text-[#4359ea]"
												: "bg-pink-50 border-pink-400 text-pink-500"
											: "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
									}`}
								>
									{g === "Male" ? "♂ Male" : "♀ Female"}
								</button>
							))}
						</div>
					</div>

					<Field
						label="Breed"
						field="breed"
						placeholder="e.g. Domestic Shorthair"
					/>
					<Field
						label="Warna"
						field="color"
						placeholder="e.g. Kuning dan Hitam"
					/>
					<Field label="Tgl Lahir" field="dateOfBirth" type="date" />
					<Field label="Berat" field="weight" placeholder="e.g. 4.2 kg" />
					<Field label="Warna Mata" field="eyeColor" placeholder="e.g. Hazel" />
					<Field
						label="Microchip"
						field="microchip"
						placeholder="e.g. #982138901233"
					/>
				</section>

				{/* ── Genetic Profile ───────────────────────────────── */}
				<section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
					<SectionTitle title="Genetic Profile" />
					<Field
						label="Breed Predisposition"
						field="breedPredisposition"
						placeholder="e.g. Domestic Shorthair"
					/>
					<Field
						label="Coat Pattern"
						field="coatPattern"
						placeholder="e.g. Silver Tabby"
					/>
					<Field
						label="Eye Color Gene"
						field="eyeColorGene"
						placeholder="e.g. Green (G/D)"
					/>
					{/* Blood Type dropdown */}
					<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
						<label
							htmlFor="field-bloodType"
							className="text-[13px] font-medium text-gray-600 sm:w-[160px] shrink-0"
						>
							Blood Type
						</label>
						<select
							id="field-bloodType"
							value={form.bloodType}
							onChange={(e) => update("bloodType", e.target.value)}
							className="flex-1 h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-[#4359ea]/30 focus:border-[#4359ea] transition-all
                               appearance-none cursor-pointer"
							style={{
								backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
								backgroundRepeat: "no-repeat",
								backgroundPosition: "right 12px center",
							}}
						>
							<option value="" disabled>
								Pilih Blood Type
							</option>
							<option value="Type A">Type A</option>
							<option value="Type B">Type B</option>
							<option value="Type AB">Type AB</option>
						</select>
					</div>
					<Field
						label="Genetic Diversity"
						field="geneticDiversity"
						placeholder="Low / Medium / High"
					/>
					<Field
						label="Inbreeding Coeficient"
						field="inbreedingCoefficient"
						placeholder="e.g. 2.1% (Low)"
					/>
				</section>

				{/* ── Traits & Markers ──────────────────────────────── */}
				<section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
					<SectionTitle title="Traits & Markers" color="text-purple-700" />
					<Field
						label="Fur Length Gene"
						field="furLengthGene"
						placeholder="e.g. Short Hair (ss)"
					/>
					<Field
						label="Dilution Gene"
						field="dilutionGene"
						placeholder="e.g. Non-dilute (DD)"
					/>
					<Field
						label="White Spotting"
						field="whiteSpotting"
						placeholder="e.g. None (S/s)"
					/>
					<Field
						label="Brachycephalic Gene"
						field="brachycephalicGene"
						placeholder="e.g. Negative (N/N)"
					/>
				</section>

				{/* ── DNA Ancestry ─────────────────────────────────── */}
				<section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
					<SectionTitle title="DNA Ancestry" color="text-cyan-700" />
					<Field
						label="European Domestic"
						field="ancestryEuropean"
						placeholder="e.g. 62%"
					/>
					<Field
						label="Asian Domestic"
						field="ancestryAsian"
						placeholder="e.g. 23%"
					/>
					<Field
						label="African Wildcat"
						field="ancestryAfrican"
						placeholder="e.g. 10%"
					/>
					<Field
						label="Middle Eastern"
						field="ancestryMiddleEastern"
						placeholder="e.g. 5%"
					/>
				</section>

				{/* ── Save Button ───────────────────────────────────── */}
				<div className="sticky bottom-4 z-30 pt-2 pb-2">
					<button
						type="submit"
						className="w-full h-12 bg-[#4359ea] hover:bg-[#3348d4] active:scale-[0.98] text-white font-bold text-[15px] rounded-2xl
                                   flex items-center justify-center gap-2 shadow-lg shadow-[#4359ea]/25 transition-all duration-200"
					>
						<Save size={18} />
						{isEdit ? "Update Data Kucing" : "Simpan Data Kucing"}
					</button>
				</div>
			</div>
		</form>
	);
}
