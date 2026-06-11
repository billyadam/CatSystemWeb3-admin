import Navbar from "@/components/layout/Navbar";
import { NAV_ITEMS } from "@/config/nav";

interface LayoutProps {
	children: React.ReactNode;
	withNavbar?: boolean;
	className?: string;
}

export default function Layout({
	children,
	withNavbar = true,
	className,
}: LayoutProps) {
	return (
		<div className="flex min-h-screen bg-gray-50">
			{withNavbar && (
				<Navbar
					items={NAV_ITEMS}
					appName="OLPaw Admin"
					logoSrc="/assets/Logo Biru.png"
				/>
			)}

			<main
				className={[
					"flex-1 w-full min-w-0",
					withNavbar ? "xl:ml-[220px]" : "",
					withNavbar ? "pb-[68px] xl:pb-0" : "",
					className ?? "",
				]
					.filter(Boolean)
					.join(" ")}
			>
				{children}
			</main>
		</div>
	);
}
