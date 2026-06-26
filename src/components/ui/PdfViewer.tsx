"use client";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, ZoomIn, ZoomOut } from "lucide-react";

interface PdfViewerProps {
	/** Blob URL dari URL.createObjectURL(blob) */
	blobUrl: string;
}

export default function PdfViewer({ blobUrl }: PdfViewerProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const renderTaskRef = useRef<{ cancel: () => void } | null>(null);

	const [pdfDoc, setPdfDoc] = useState<import("pdfjs-dist").PDFDocumentProxy | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [scale, setScale] = useState(1.2);
	const [isRendering, setIsRendering] = useState(false);
	const [loadError, setLoadError] = useState<string | null>(null);

	// Load PDF document from blobUrl
	useEffect(() => {
		if (!blobUrl) return;

		let cancelled = false;

		const loadPdf = async () => {
			setLoadError(null);
			setPdfDoc(null);
			setCurrentPage(1);
			setTotalPages(0);

			try {
				// Dynamic import so pdf.js is only loaded client-side
				const pdfjsLib = await import("pdfjs-dist");

				// Point to the bundled worker from pdfjs-dist using a URL string
				pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
					"pdfjs-dist/build/pdf.worker.mjs",
					import.meta.url,
				).toString();

				const doc = await pdfjsLib.getDocument({ url: blobUrl }).promise;
				if (cancelled) {
					(doc as unknown as { destroy(): void }).destroy();
					return;
				}

				setPdfDoc(doc);
				setTotalPages(doc.numPages);
			} catch (err: unknown) {
				if (cancelled) return;
				const msg = err instanceof Error ? err.message : "Failed to load PDF document";
				setLoadError(msg);
			}
		};

		loadPdf();
		return () => {
			cancelled = true;
		};
	}, [blobUrl]);

	// Render current page onto <canvas>
	useEffect(() => {
		if (!pdfDoc || !canvasRef.current) return;

		let cancelled = false;

		const renderPage = async () => {
			// Cancel any in-flight render
			if (renderTaskRef.current) {
				renderTaskRef.current.cancel();
				renderTaskRef.current = null;
			}

			setIsRendering(true);

			try {
				const page = await pdfDoc.getPage(currentPage);
				if (cancelled) return;

				const canvas = canvasRef.current;
				if (!canvas) return;

				const viewport = page.getViewport({ scale });
				const context = canvas.getContext("2d");
				if (!context) return;

				canvas.height = viewport.height;
				canvas.width = viewport.width;

				const task = page.render({ canvasContext: context, viewport, canvas });
				renderTaskRef.current = task;

				await task.promise;

				if (!cancelled) {
					setIsRendering(false);
				}
			} catch (err: unknown) {
				if (cancelled) return;
				// RenderingCancelledException is expected — ignore it
				const errName = (err as { name?: string })?.name;
				if (errName !== "RenderingCancelledException") {
					setLoadError("Failed to render PDF page.");
					setIsRendering(false);
				}
			}
		};

		renderPage();
		return () => {
			cancelled = true;
		};
	}, [pdfDoc, currentPage, scale]);

	const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
	const goToNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
	const zoomIn = () => setScale((s) => Math.min(3, +(s + 0.2).toFixed(1)));
	const zoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.2).toFixed(1)));

	if (loadError) {
		return (
			<div className="flex flex-col items-center justify-center gap-3 py-12 text-red-500">
				<AlertCircle size={32} />
				<p className="text-sm font-medium">{loadError}</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-4 w-full">
			{/* Toolbar */}
			<div className="flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-700 shadow-sm select-none">
				<button
					type="button"
					onClick={zoomOut}
					title="Zoom out"
					className="rounded p-1 hover:bg-gray-200 transition-colors disabled:opacity-40"
					disabled={scale <= 0.5}
				>
					<ZoomOut size={16} />
				</button>
				<span className="min-w-[3rem] text-center font-mono">{Math.round(scale * 100)}%</span>
				<button
					type="button"
					onClick={zoomIn}
					title="Zoom in"
					className="rounded p-1 hover:bg-gray-200 transition-colors disabled:opacity-40"
					disabled={scale >= 3}
				>
					<ZoomIn size={16} />
				</button>

				<div className="h-4 w-px bg-gray-300 mx-1" />

				<button
					type="button"
					onClick={goToPrev}
					title="Previous page"
					className="rounded p-1 hover:bg-gray-200 transition-colors disabled:opacity-40"
					disabled={currentPage <= 1}
				>
					<ChevronLeft size={16} />
				</button>
				<span className="min-w-[5rem] text-center">
					{totalPages > 0 ? `${currentPage} / ${totalPages}` : "—"}
				</span>
				<button
					type="button"
					onClick={goToNext}
					title="Next page"
					className="rounded p-1 hover:bg-gray-200 transition-colors disabled:opacity-40"
					disabled={currentPage >= totalPages}
				>
					<ChevronRight size={16} />
				</button>
			</div>

			{/* Canvas container */}
			<div className="relative w-full overflow-auto rounded-xl border border-gray-200 bg-gray-50 shadow-inner">
				{isRendering && (
					<div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
						<Loader2 size={32} className="animate-spin text-blue-500" />
					</div>
				)}
				<div className="flex justify-center p-4">
					<canvas
						ref={canvasRef}
						className="max-w-full rounded shadow-md"
						style={{ display: totalPages > 0 ? "block" : "none" }}
					/>
					{totalPages === 0 && !isRendering && (
						<div className="flex items-center justify-center py-16">
							<Loader2 size={28} className="animate-spin text-blue-400" />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
