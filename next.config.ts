import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "i.pravatar.cc",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "8000",
				pathname: "/uploads/**",
			},
			{
				protocol: "https",
				hostname: "catsystemweb3-backend-staging.up.railway.app",
				pathname: "/uploads/**",
			},
		],
	},
	webpack: (config) => {
		// Allow Next.js to resolve .mjs files from pdfjs-dist (worker)
		config.resolve.extensions = [
			...(config.resolve.extensions ?? []),
			".mjs",
		];
		return config;
	},
};

export default nextConfig;
