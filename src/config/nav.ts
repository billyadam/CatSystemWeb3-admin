import type { NavItem } from "@/types/cat";

/**
 * Central navigation config consumed by the Navbar component.
 * Icons reference files inside /public/assets.
 */
export const NAV_ITEMS: NavItem[] = [
	{
		href: "/",
		label: "Home",
		iconActive: "/assets/simbol home.png",
		iconInactive: "/assets/Simbol home abu.png",
	},
{
		href: "/account",
		label: "Account",
		iconActive: "/assets/simbol profile.png",
		iconInactive: "/assets/simbol profile abu.png",
	},
];
