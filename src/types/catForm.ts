import type { CatGender } from "./cat";

/**
 * Shape of the cat form data – used for both Add and Edit flows.
 * All fields are optional strings so the form can be partially filled.
 */
export type CatFormData = {
	/* ── Basic Info ────────────────────────────── */
	name: string;
	breed: string;
	gender: CatGender;
	dateOfBirth: string; // ISO date string
	color: string;
	weight: string;
	eyeColor: string;
	microchip: string;

	/* ── Genetic Profile ─────────────────────── */
	breedPredisposition: string;
	coatPattern: string;
	eyeColorGene: string;
	bloodType: string;
	geneticDiversity: string;
	inbreedingCoefficient: string;

	/* ── Traits & Markers ────────────────────── */
	furLengthGene: string;
	dilutionGene: string;
	whiteSpotting: string;
	brachycephalicGene: string;

	/* ── DNA Ancestry ────────────────────────── */
	ancestryEuropean: string;
	ancestryAsian: string;
	ancestryAfrican: string;
	ancestryMiddleEastern: string;
};

/** Helper – empty form defaults */
export const EMPTY_CAT_FORM: CatFormData = {
	name: "",
	breed: "",
	gender: "Male",
	dateOfBirth: "",
	color: "",
	weight: "",
	eyeColor: "",
	microchip: "",
	breedPredisposition: "",
	coatPattern: "",
	eyeColorGene: "",
	bloodType: "",
	geneticDiversity: "",
	inbreedingCoefficient: "",
	furLengthGene: "",
	dilutionGene: "",
	whiteSpotting: "",
	brachycephalicGene: "",
	ancestryEuropean: "",
	ancestryAsian: "",
	ancestryAfrican: "",
	ancestryMiddleEastern: "",
};
