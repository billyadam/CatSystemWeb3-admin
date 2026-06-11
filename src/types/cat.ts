export type CatGender = "Male" | "Female";

export type CatIdentification = {
	hasPaw: boolean;
	hasDNA: boolean;
	hasAncestry: boolean;
};

export type CatDNAProfile = {
	breed: string;
	coatColor: string;
	coatLength: string;
	earType: string;
	bodySize: string;
	eyeColor: string;
};

export type CatTraits = {
	furLengthGene: string;
	dilutionGene: string;
	whiteSpotting: string;
	brachycephalicGene: string;
};

export type CatAncestry = {
	region: string;
	percentage: number;
	color: string;
}[];

/* ── New DNA sub-types ──────────────────────────────────── */

export type CatBreedComposition = {
	breed: string;
	percentage: number;
	/** Tailwind bg-color class or hex for the pie segment */
	color: string;
}[];

export type CatGeneticTrait = {
	label: string;
	present: boolean;
};

export type CatGeneticMarker = {
	marker: string; // e.g. "FCA677"
	genotype: string; // e.g. "A/A"
	chromosome: string; // e.g. "A1"
	position: number; // e.g. 23411872
	value: number; // e.g. 0.98
};

export type CatBlockchainVerification = {
	transactionHash: string;
	timestamp: string; // e.g. "May 20, 2025 · 10:42:18 AM"
	verifiedBy: string; // e.g. "PawChain Network"
};

/* ── Bio extended fields ────────────────────────────────── */

export type CatBio = {
	dateOfBirth: string;
	color: string;
	personality: string[];
	vaccinated: boolean;
	neutered: boolean;
	indoor: boolean;
	diet: string;
	favoriteFood: string;
	specialNotes?: string;
};

/* ── Owner ──────────────────────────────────────────────── */

export type CatOwner = {
	name: string;
	walletAddress: string;
	registeredDate: string;
	location: string;
	contactEmail?: string;
	totalCats: number;
	verificationStatus: "Verified" | "Pending" | "Unverified";
};

/* ── Medical ────────────────────────────────────────────── */

export type CatMedicalRecord = {
	id: string;
	title: string;
	date: string;
	description: string;
	clinic?: string;
	doctor?: string;
	type: "vaccine" | "checkup" | "surgery" | "other";
};

export type CatHealthSummary = {
	status: "Healthy" | "Needs Attention" | "Critical";
	lastCheckup: string;
	nextCheckup: string;
	weight: string;
	allergies: string[];
	conditions: string[];
};

/* ── Family ─────────────────────────────────────────────── */

export type CatFamilyMember = {
	id: string;
	relation: "Sire" | "Dam" | "Sibling" | "Offspring" | "Grandparent";
	name: string;
	breed: string;
	tokenId: string;
	pawId?: string;
	imageUrl?: string;
	verified?: boolean;
};

/* ── Main Cat type ──────────────────────────────────────── */

export type Cat = {
	id: string;
	name: string;
	breed: string;
	ageLabel: string; // e.g. "2 yrs", "8 months"
	gender: CatGender;
	tokenId: string; // e.g. "#0012"
	verified: boolean;
	identification: CatIdentification;
	/** accent color for the card – resolved from breed/owner preference */
	accentColor: string;
	/** light background tint for the card avatar area */
	cardBg: string;
	imageUrl?: string;
	registeredAt?: string;

	// Extended dynamic details
	weight?: string;
	eyeColor?: string;
	activityLevel?: string;
	microchip?: string;
	about?: string;

	// DNA tab
	dnaProfile?: CatDNAProfile;
	traits?: CatTraits;
	ancestry?: CatAncestry;
	breedComposition?: CatBreedComposition;
	geneticTraits?: CatGeneticTrait[];
	geneticMarkers?: CatGeneticMarker[];
	blockchainVerification?: CatBlockchainVerification;

	// Bio tab
	bio?: CatBio;

	// Health tab
	medicalRecords?: CatMedicalRecord[];
	healthSummary?: CatHealthSummary;

	// Owner tab
	owner?: CatOwner;

	// Family tab
	family?: CatFamilyMember[];
};

export type NavItem = {
	href: string;
	label: string;
	/** path to the active (coloured) icon under /public */
	iconActive: string;
	/** path to the inactive (grey) icon under /public */
	iconInactive: string;
};
