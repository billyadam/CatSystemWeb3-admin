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
				protocol:"https",
				hostname:"catsystemweb3-backend-staging.up.railway.app",
				pathname: "/uploads/**",
			}
		],
	},
};

export default nextConfig;
