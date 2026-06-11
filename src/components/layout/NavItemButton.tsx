"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types/cat";

interface NavItemButtonProps {
	item: NavItem;
	variant: "sidebar" | "bottom";
}

export function NavItemButton({ item, variant }: NavItemButtonProps) {
	const pathname = usePathname();
	const active =
		item.href === "/"
			? pathname === "/"
			: (pathname?.startsWith(item.href) ?? false);

	if (variant === "sidebar") {
		return (
			<Link
				href={item.href}
				className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 group
          ${active ? "bg-[#F0EDFF]" : "hover:bg-gray-50"}`}
			>
				{/* Icon */}
				<div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
					<Image
						src={active ? item.iconActive : item.iconInactive}
						alt={item.label}
						width={28}
						height={28}
						className="w-7 h-7 object-contain"
					/>
				</div>
				{/* Label */}
				<span
					className={`block text-[14px] font-medium whitespace-nowrap transition-colors
            ${active ? "text-[#7C5CFC]" : "text-gray-400 group-hover:text-gray-600"}`}
				>
					{item.label}
				</span>
			</Link>
		);
	}

	// bottom variant
	return (
		<Link
			href={item.href}
			className="flex flex-col items-center gap-[3px] px-3 py-1 min-w-0"
		>
			<div className="w-6 h-6 flex items-center justify-center">
				<Image
					src={active ? item.iconActive : item.iconInactive}
					alt={item.label}
					width={24}
					height={24}
					className="w-6 h-6 object-contain"
				/>
			</div>
			<span
				className={`text-[10px] font-medium leading-tight
          ${active ? "text-[#7C5CFC]" : "text-gray-400"}`}
			>
				{item.label}
			</span>
		</Link>
	);
}
