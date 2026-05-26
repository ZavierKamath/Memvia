import { useRef } from 'react'
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { ExternalLink } from 'lucide-react';

export function PDFCard({ pdfPath }: { pdfPath: string }) {
    const boxRef = useRef(null);

	pdfjs.GlobalWorkerOptions.workerSrc = new URL(
		"pdfjs-dist/build/pdf.worker.min.mjs",
		import.meta.url
	).toString()

	const urlToPdf = `http://localhost:8000/documents/${pdfPath}`

	return (
		<div
			ref={boxRef}
			className="rounded-xl relative"
		>
			<div className="absolute top-4 right-4 z-10">
				<button
					onClick={() => window.open(urlToPdf, "_blank")}
					className="text-text hover:text-primary"
				>
					<ExternalLink />
				</button>
			</div>
			<Document file={urlToPdf}>
				<Page
					pageNumber={1}
					width={500}
					onLoadSuccess={(page) => {
						const viewport = page.getViewport({ scale: 1 })
						console.log(viewport.width, viewport.height)
					}}
					className="rounded-xl overflow-hidden shadow-[inset_0_0.25rem_0.5rem_rgba(0,0,0,0.2)]"
				/>
			</Document>
		</div>
  );
}
