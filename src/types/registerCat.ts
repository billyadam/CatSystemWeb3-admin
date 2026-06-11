import type { CatGender } from "./cat";

/* ================================================================
   Step 1 – Basic Information
   ================================================================ */
export interface BasicInfoData {
	catName: string;
	dateOfBirth: string; // ISO date string
	gender: CatGender;
	photo: File | null;
	photoPreview: string | null;
	photo2: File | null;
	photo2Preview: string | null;
}

/* ================================================================
   Step 2 – Bio Profile
   ================================================================ */
export interface BioProfileData {
	breed: string;
	coatColor: string;
	coatLength: "Long Hair" | "Medium Hair" | "Short Hair" | "";
	eyeColor: string;
	earType: "Pointed" | "Rounded" | "Folded" | "";
	bodySize: "Small" | "Medium" | "Large" | "";
	personalityTraits: string[];
	additionalNotes: string;
}

/* ================================================================
   Step 3 – DNA Profile (optional)
   ================================================================ */
export interface BreedComposition {
	name: string;
	percentage: number;
}

export interface GeneticMarker {
	name: string;
	variant: string;
}

export interface DnaProfileData {
	breedComposition: BreedComposition[];
	purityScore: number;
	geneticTraits: string[];
	geneticMarkers: GeneticMarker[];
}

/* ================================================================
   Step 4 – Health Report
   ================================================================ */
export interface Vaccination {
	id: string;
	name: string;
	date: string;
}

export interface HealthReportData {
	vaccinations: Vaccination[];
	medicalHistory: string[];
	healthRisks: string[];
	lastCheckup: {
		date: string;
		veterinarian: string;
		weight: string;
		healthStatus: string;
	};
}

/* ================================================================
   Step 5 – Owner Data
   ================================================================ */
export interface OwnerDataData {
	ownerName: string;
	email: string;
	phone: string;
	countryCode: string;
	country: string;
	city: string;
	address: string;
	ownerType: "Individual Cat Lover" | "Individual Breeder" | "";
	breederRegistration: {
		registrationNumber: string;
		organization: string;
		status: string;
		certificate: File | null;
	};
	ownershipProof: {
		documentType: string;
		document: File | null;
	};
}

/* ================================================================
   Step 6 – Family Tree
   ================================================================ */
export interface Sibling {
	id: string;
	name: string;
	gender: CatGender;
	dateOfBirth: string;
	imageUrl?: string;
}

export interface ParentInfo {
	name: string;
	id: string;
	breed: string;
	dateOfBirth: string;
	color: string;
}

export interface Offspring {
	id: string;
	name: string;
	gender: CatGender;
	dateOfBirth: string;
	imageUrl?: string;
}

export interface FamilyTreeData {
	mother: ParentInfo | null;
	father: ParentInfo | null;
	siblings: Sibling[];
	maternalGrandfather: string;
	maternalGrandmother: string;
	paternalGrandfather: string;
	paternalGrandmother: string;
	offspring: Offspring[];
	pedigreeDocument: {
		file: File | null;
		generations: string;
	};
}

/* ================================================================
   Combined form state
   ================================================================ */
export interface RegisterCatFormData {
	basicInfo: BasicInfoData;
	bioProfile: BioProfileData;
	dnaProfile: DnaProfileData;
	healthReport: HealthReportData;
	ownerData: OwnerDataData;
	familyTree: FamilyTreeData;
}

/* ================================================================
   Step configuration
   ================================================================ */
export const REGISTER_STEPS = [
	{ key: "basicInfo", number: 1, title: "Basic Information", subtitle: "Tell us about your cat" },
	{ key: "bioProfile", number: 2, title: "Bio Profile", subtitle: "Tell us more about your cat" },
	{ key: "dnaProfile", number: 3, title: "DNA Profile", subtitle: "Genetic information (optional)" },
	{ key: "healthReport", number: 4, title: "Health Report", subtitle: "Help us keep your cat healthy and safe" },
	{ key: "ownerData", number: 5, title: "Owner Data", subtitle: "Your contact & ownership info" },
	{ key: "familyTree", number: 6, title: "Family Tree", subtitle: "Build your cat's family lineage" },
] as const;

export const TOTAL_STEPS = REGISTER_STEPS.length;

export type StepKey = (typeof REGISTER_STEPS)[number]["key"];

/* ================================================================
   Empty defaults
   ================================================================ */
export const EMPTY_BASIC_INFO: BasicInfoData = {
	catName: "",
	dateOfBirth: "",
	gender: "Male",
	photo: null,
	photoPreview: null,
	photo2: null,
	photo2Preview: null,
};

export const EMPTY_BIO_PROFILE: BioProfileData = {
	breed: "",
	coatColor: "",
	coatLength: "",
	eyeColor: "",
	earType: "",
	bodySize: "",
	personalityTraits: [],
	additionalNotes: "",
};

export const EMPTY_DNA_PROFILE: DnaProfileData = {
	breedComposition: [],
	purityScore: 0,
	geneticTraits: [],
	geneticMarkers: [],
};

export const EMPTY_HEALTH_REPORT: HealthReportData = {
	vaccinations: [],
	medicalHistory: [],
	healthRisks: [],
	lastCheckup: {
		date: "",
		veterinarian: "",
		weight: "",
		healthStatus: "",
	},
};

export const EMPTY_OWNER_DATA: OwnerDataData = {
	ownerName: "",
	email: "",
	phone: "",
	countryCode: "+1",
	country: "",
	city: "",
	address: "",
	ownerType: "",
	breederRegistration: {
		registrationNumber: "",
		organization: "",
		status: "",
		certificate: null,
	},
	ownershipProof: {
		documentType: "",
		document: null,
	},
};

export const EMPTY_FAMILY_TREE: FamilyTreeData = {
	mother: null,
	father: null,
	siblings: [],
	maternalGrandfather: "",
	maternalGrandmother: "",
	paternalGrandfather: "",
	paternalGrandmother: "",
	offspring: [],
	pedigreeDocument: {
		file: null,
		generations: "",
	},
};

export const EMPTY_REGISTER_FORM: RegisterCatFormData = {
	basicInfo: EMPTY_BASIC_INFO,
	bioProfile: EMPTY_BIO_PROFILE,
	dnaProfile: EMPTY_DNA_PROFILE,
	healthReport: EMPTY_HEALTH_REPORT,
	ownerData: EMPTY_OWNER_DATA,
	familyTree: EMPTY_FAMILY_TREE,
};
