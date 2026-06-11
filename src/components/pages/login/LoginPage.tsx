"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useCreateWallet } from "@privy-io/react-auth/solana";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useAuthLogin } from "@/hooks/useAuthLogin";
import { getToken } from "@/lib/cookies";

export default function LoginPage() {
	const { user, ready, authenticated, getAccessToken, logout } = usePrivy();
	const authLogin = useAuthLogin();
	const [isSyncing, setIsSyncing] = useState(false);

	const { createWallet } = useCreateWallet();

	// ── Privy login hooks ──
	useEffect(() => {
		const syncWithBackend = async () => {
			// 1. Wait until Privy is ready and user is authenticated
			if (!ready || !authenticated || !user || isSyncing) return;

			// 2. If we already have a backend token, don't do anything
			if (getToken()) return;

			// 3. Check for the Solana Wallet
			const solanaWallet = user.linkedAccounts.find(
				(acc: any) => acc.type === 'wallet' && acc.chainType === 'solana'
			);

			// 4. Provisioning Gate: If no Solana wallet, create it first
			if (!solanaWallet) {
				try {
					setIsSyncing(true);
					console.log("Provisioning Solana wallet...");
					await createWallet();
					// We STOP here. When the wallet is created, Privy updates the 'user' object.
					// React will re-run this useEffect automatically because 'user' is a dependency.
					return;
				} catch (err) {
					console.error("Provisioning failed:", err);
					return;
				} finally {
					setIsSyncing(false);
				}
			}

			// 5. Backend Gate: Only hit the backend if the wallet is confirmed to exist
			try {
				setIsSyncing(true);
				const token = await getAccessToken();
				if (token) {
					console.log("Wallet confirmed. Syncing with backend...");
					await authLogin.mutateAsync(token);
				}
			} catch (err) {
				console.error("Backend sync failed:", err);
				// If the backend rejects, clear the session so they can try again
				logout();
			} finally {
				setIsSyncing(false);
			}
		};

		syncWithBackend();
	}, [ready, authenticated, user]);

	const { login: openWalletLogin } = useLogin({
		onComplete: async () => {
			const token = await getAccessToken();
			if (token) {
				authLogin.mutate(token);
			}
		},
		onError: (error) => {
			console.error("[login] Wallet login error:", error);
		},
	});

	// ── Redirect after successful login or if already logged in ──
	useEffect(() => {
		if (authLogin.isSuccess) {
			window.location.replace("/");
		} else if (getToken()) {
			const sessionExpired = new URLSearchParams(window.location.search).get("sessionExpired");
			if (sessionExpired !== "true") {
				window.location.replace("/");
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authLogin.isSuccess]);

	// ── Handle "sessionExpired" query param ──
	useEffect(() => {
		if (!ready || !authenticated) return;
		const sessionExpired = new URLSearchParams(window.location.search).get("sessionExpired");
		if (sessionExpired === "true") {
			logout();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ready, authenticated]);

	const isLoading = authLogin.isPending;

	const handleWalletLogin = () => {
		openWalletLogin();
	};

	// ── Loading state while Privy initializes ──
	if (!ready) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
				<div className="flex flex-col items-center gap-3">
					<Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
					<p className="text-sm text-gray-400">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 lg:flex">
			{/* ═══════════════ LEFT: Hero Section (desktop) / Top (mobile) ═══════════════ */}
			<section className="relative overflow-hidden lg:w-[55%] lg:min-h-screen flex flex-col items-center justify-center px-6 pt-12 pb-8 lg:py-0">
				{/* Decorative paw prints background */}
				<div className="paw-bg absolute inset-0 opacity-30 pointer-events-none" />

				{/* Floating decorative blobs */}
				<div className="absolute top-10 left-8 w-32 h-32 bg-indigo-200/30 rounded-full blur-2xl animate-float-slow" />
				<div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl animate-float-slow animation-delay-200" />

				{/* ── Feature cards floating around ── */}
				<div className="relative z-10 w-full max-w-md mx-auto">
					{/* Family Tree card */}
					<div className="animate-fadeIn animate-float animation-delay-100 absolute -top-2 left-2 lg:left-4 lg:-top-4">
						<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 border border-indigo-100/60">
							<div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
								<svg
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#6366f1"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<title>Family Tree</title>
									<path d="M12 3v6" />
									<path d="M6 9h12" />
									<path d="M6 9v6" />
									<path d="M18 9v6" />
									<circle cx="6" cy="18" r="3" />
									<circle cx="18" cy="18" r="3" />
									<circle cx="12" cy="3" r="2" />
								</svg>
							</div>
							<div>
								<p className="text-xs font-semibold text-gray-800">
									Family Tree
								</p>
								<div className="flex items-center gap-1 mt-0.5">
									<span className="w-3.5 h-3.5 rounded-full bg-green-400 flex items-center justify-center">
										<svg width="8" height="8" viewBox="0 0 12 12" fill="white">
											<title>Check</title>
											<path
												d="M10 3L4.5 8.5 2 6"
												stroke="white"
												strokeWidth="2"
												fill="none"
											/>
										</svg>
									</span>
									<span className="text-[10px] text-green-600 font-medium">
										Verified
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* DNA Profile card */}
					<div className="animate-fadeIn animate-float animation-delay-300 absolute top-32 -left-4 lg:-left-8 lg:top-28">
						<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 border border-purple-100/60">
							<div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
								<svg
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#a855f7"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<title>DNA</title>
									<path d="M2 15c6.667-6 13.333 0 20-6" />
									<path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
									<path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
									<path d="M17 6l-2.5 2.5" />
									<path d="M14 8l-1 1" />
									<path d="M7 18l2.5-2.5" />
									<path d="M3.5 14.5l.5-.5" />
									<path d="M20 9l.5-.5" />
									<path d="M6.5 12.5l1-1" />
									<path d="M16.5 10.5l1-1" />
								</svg>
							</div>
							<div>
								<p className="text-xs font-semibold text-gray-800">
									DNA Profile
								</p>
								<div className="flex items-center gap-1 mt-0.5">
									<span className="w-3.5 h-3.5 rounded-full bg-green-400 flex items-center justify-center">
										<svg width="8" height="8" viewBox="0 0 12 12" fill="white">
											<title>Check</title>
											<path
												d="M10 3L4.5 8.5 2 6"
												stroke="white"
												strokeWidth="2"
												fill="none"
											/>
										</svg>
									</span>
									<span className="text-[10px] text-green-600 font-medium">
										Verified
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Health Report card */}
					<div className="animate-fadeIn animate-float animation-delay-500 absolute top-8 -right-2 lg:-right-6">
						<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 border border-emerald-100/60">
							<p className="text-xs font-semibold text-gray-800 mb-2">
								Health Report
							</p>
							<div className="space-y-1.5">
								<div className="flex items-center justify-between text-[10px]">
									<span className="text-gray-500">Genetic Health</span>
									<span className="text-green-600 font-semibold">Good</span>
								</div>
								<div className="flex items-center justify-between text-[10px]">
									<span className="text-gray-500">Traits</span>
									<span className="text-indigo-600 font-semibold">
										Verified
									</span>
								</div>
								<div className="flex items-center justify-between text-[10px]">
									<span className="text-gray-500">Wellness</span>
									<span className="text-green-600 font-semibold">Good</span>
								</div>
							</div>
						</div>
					</div>

					{/* ── Cat Avatar ── */}
					<div className="relative flex justify-center mt-20 mb-6 lg:mt-24 lg:mb-10">
						<div className="relative animate-fadeInUp">
							<div className="w-36 h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-indigo-200/40 animate-pulse-ring">
								<Image
									src="/assets/login/cat-avatar.png"
									alt="OLPaw Cat"
									width={176}
									height={176}
									className="w-full h-full object-cover"
									priority
								/>
							</div>
							{/* Paw badge */}
							<div className="absolute -bottom-1 -right-1 w-10 h-10 lg:w-12 lg:h-12 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg border-3 border-white">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="white">
									<title>Paw</title>
									<path d="M12 17.5c-1.5 0-2.8-.8-3.5-2-.4-.7-.5-1.5-.3-2.2.2-.8.7-1.4 1.3-1.8.3-.2.5-.5.5-.8 0-.4-.3-.8-.7-1.1-.6-.4-1-1.1-1-1.8 0-1.2 1-2.2 2.2-2.2.5 0 1 .2 1.4.5.4-.3.9-.5 1.4-.5 1.2 0 2.2 1 2.2 2.2 0 .7-.4 1.4-1 1.8-.4.3-.7.7-.7 1.1 0 .3.2.6.5.8.6.4 1.1 1 1.3 1.8.2.7.1 1.5-.3 2.2-.7 1.2-2 2-3.5 2z" />
								</svg>
							</div>
						</div>
					</div>

					{/* ── Title & Tagline ── */}
					<div className="text-center animate-fadeInUp animation-delay-200">
						<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
							OLPaw
						</h1>
						<p className="text-sm lg:text-base font-medium text-indigo-600 mt-1">
							Pet Identity & DNA Verification Platform
						</p>
						<p className="text-xs lg:text-sm text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
							Secure your cat&apos;s identity, verify lineage, and unlock a
							healthier future with blockchain.
						</p>
					</div>
				</div>
			</section>

			{/* ═══════════════ RIGHT: Login Form ═══════════════ */}
			<section className="lg:w-[45%] lg:min-h-screen flex items-center justify-center px-6 pb-10 pt-6 lg:py-0">
				<div className="w-full max-w-sm mx-auto animate-fadeInUp animation-delay-300">
					{/* Heading */}
					<div className="text-center mb-6">
						<h2 className="text-lg font-bold text-gray-800">
							Admin Panel
						</h2>
					</div>

					{/* ── Connect Wallet Button ── */}
					<button
						type="button"
						id="login-wallet-btn"
						onClick={handleWalletLogin}
						disabled={isLoading}
						className="w-full group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 text-gray-800 font-semibold py-3.5 px-6 flex items-center justify-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
					>
						{isLoading ? (
							<Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
						) : (
							<>
								{/* Wallet icon */}
								<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-teal-400 rounded-lg flex items-center justify-center shadow-sm">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="white">
										<title>Wallet</title>
										<path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" />
									</svg>
								</div>
								<div className="text-left">
									<span className="text-sm font-semibold">Connect Wallet</span>
									<span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-normal -mt-0.5">
										<Image
											src="/assets/solana-logo-on-transparent-removebg.png"
											alt="Solana"
											width={20}
											height={20}
											className="object-contain opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
										/>
										Solana Wallet
									</span>
								</div>
							</>
						)}
					</button>

					{/* ── Footer ── */}
					<div className="mt-8 text-center space-y-2 animate-fadeIn animation-delay-600">
						<div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Shield</title>
								<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
								<path d="M9 12l2 2 4-4" />
							</svg>
							<span>Your data is secure and privacy is our priority.</span>
						</div>
						<p className="text-[10px] text-gray-400 leading-relaxed">
							By continuing, you agree to our{" "}
							<a
								href="/terms"
								className="text-indigo-500 hover:text-indigo-600 underline underline-offset-2"
							>
								Terms of Service
							</a>{" "}
							and{" "}
							<a
								href="/privacy"
								className="text-indigo-500 hover:text-indigo-600 underline underline-offset-2"
							>
								Privacy Policy
							</a>
							.
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}