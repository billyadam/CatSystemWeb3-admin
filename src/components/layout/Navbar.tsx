"use client";

import Image from "next/image";
import Link from "next/link";
import { NavItemButton } from "@/components/layout/NavItemButton";
import type { NavItem } from "@/types/cat";

interface NavbarProps {
	/** Navigation items to render. Defaults to NAV_ITEMS from config if not provided. */
	items: NavItem[];
	/** App name displayed next to the logo in the expanded sidebar. */
	appName?: string;
	/** Logo image path relative to /public. */
	logoSrc?: string;
}

/**
 * Responsive navigation:
 * - md+ → fixed left sidebar (72px collapsed / 220px expanded on xl)
 * - mobile → fixed bottom bar
 */
export default function Navbar({
	items,
	appName = "OLPaw Admin",
	logoSrc = "/assets/Logo Biru.png",
}: NavbarProps) {
	return (
		<>
			{/* ══════════════ DESKTOP SIDEBAR (xl+) ══════════════ */}
			<aside className="hidden xl:flex flex-col fixed left-0 top-0 h-full w-[220px] bg-white border-r border-gray-100 shadow-sm z-50 py-6 items-start px-4">
				{/* Brand logo */}
				<Link
					href="/"
					className="flex items-center gap-3 mb-8 px-0 flex-shrink-0"
				>
					<Image
						src={logoSrc}
						alt={`${appName} logo`}
						width={40}
						height={40}
						className="w-10 h-10 object-contain flex-shrink-0"
						priority
					/>
					<span
						className="block text-[17px] font-bold text-gray-800 whitespace-nowrap"
						style={{ fontFamily: "Arial, sans-serif" }}
					>
						{appName}
					</span>
				</Link>

				{/* Nav items */}
				<nav className="flex flex-col gap-1 w-full">
					{items.map((item) => (
						<NavItemButton key={item.href} item={item} variant="sidebar" />
					))}
				</nav>
			</aside>

			{/* ══════════════ MOBILE / TABLET BOTTOM NAV ══════════════ */}
			<nav className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
				<div className="flex items-center justify-around px-2 py-2">
					{items.map((item) => (
						<NavItemButton key={item.href} item={item} variant="bottom" />
					))}
				</div>
			</nav>
		</>
	);
}
