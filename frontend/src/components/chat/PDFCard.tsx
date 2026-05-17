import { useRef } from 'react'
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import './PDFCard.css'

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
			className="pdf-card"
		>
			<div className="pdf-actions">
				<button
					onClick={() => window.open(urlToPdf, "_blank")}
				>⛶</button>
			</div>
			<Document file={urlToPdf}>
				<Page
					pageNumber={1}
					width={240}
					onLoadSuccess={(page) => {
						const viewport = page.getViewport({ scale: 1 })
						console.log(viewport.width, viewport.height)
					}}
				/>
			</Document>
		</div>
  );
}
