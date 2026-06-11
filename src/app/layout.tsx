import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from 'next'
import Providers from "@/app/providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteConfig = {
	title: "OLPaw - Pet Identity & DNA Verification Platform",
	description:
		"Secure your cat's identity, verify lineage, and unlock a healthier future with blockchain.",
	url: process.env.SITE_URL || "https://example.com",
};

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.title,
		template: `%s - ${siteConfig.title}`,
	},
	description: siteConfig.description,
	twitter: {
		card: "summary_large_image",
	},
	robots: { index: true, follow: true },
	authors: [
		{
			name: siteConfig.title,
			url: siteConfig.url,
		},
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<meta name="apple-mobile-web-app-title" content={siteConfig.title} />
			{process.env.NEXT_PUBLIC_RUN_MODE === "production" && <GoogleAnalytics />}
			<body className={`${inter.className}`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
