import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from "react-pdf";

export function PDFCard({ pdfPath }: { pdfPath: string }) {
    const boxRef = useRef(null);
    const [pageWidth, setPageWidth] = useState(240);

	pdfjs.GlobalWorkerOptions.workerSrc = new URL(
		"pdfjs-dist/build/pdf.worker.min.mjs",
		import.meta.url
	).toString()

	const urlToPdf = `http://localhost:8000/documents/${pdfPath}`

    useEffect(() => {
		function updateWidth() {
			updateWidth();
			window.addEventListener("resize", updateWidth);
			if (boxRef.current) {
				setPageWidth(boxRef.current.clientWidth);
			}
		}
		return () => window.removeEventListener("resize", updateWidth);
    }, []);
	return (
		<div
			ref={boxRef}
			style={{
				width: "100%",
				maxWidth: 260,
				overflow: "hidden",
				borderRadius: 12,
			}}
		>
			<Document file={urlToPdf}>
				<Page pageNumber={1} width={pageWidth} />
			</Document>
		</div>
  );
}
