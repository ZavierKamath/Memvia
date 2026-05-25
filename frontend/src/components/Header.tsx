import { ChatContext } from "../context/ChatContext"
import { useChat } from "../hooks/useChat"
import { useMemories } from "../hooks/useMemories"
import { PDFCard } from "./chat/PDFCard.tsx"
import { Copybox } from "./copy/CopyBox"
import { Eye, Power } from "lucide-react"
import { useState } from "react"

function OpenPDF() {
	const [opened, setOpened] = useState(false)
	const chatContext = useChat()

	function toggleOpened() {
		setOpened(!opened)
	}

	return (
		<div>
			<div>
				<button
					className={`border-2 bg-bg-light px-4 py-2 rounded-xl shadow-[inset_0_0.25rem_0.5rem_rgba(0,0,0,0.2)] hover:border-primary hover:text-text ${opened ? "border-primary text-text" : "border-border-muted text-text-muted"}`}
					onClick={toggleOpened}
				>
					<Eye />
				</button>
			</div>
			{opened ?
				<div className="fixed top-16 right-20 px-6 py-6 border-2 border-highlight shadow-md shadow-black/100 rounded-xl bg-bg-dark flex items-center flex-col gap-2">
					<h2 className="text-text mb-2 px-1 py-[0.5] border-b-2 border-secondary text-lg font-semibold mr-auto ml-2">Resume Preview</h2>
					<PDFCard pdfPath={chatContext.resumePdfPath}/>
				</div> :
			<></>}
		</div>
	)

}

export function Header() {
	const memoryContext = useMemories()
	const chatContext = useChat()
	const [theme, setTheme] = useState(false)

	function toggleTheme() {
		const next = !theme
		setTheme(next)
		document.body.classList.toggle("light", next)
	}

	return (
		<header className="px-8 py-4 col-span-2 bg-bg text-text flex justify-between items-center">
			<h1 className="text-xl border-b-2 border-primary px-1"> 
				<span className="text-text font-normal">MEM</span><span className="font-bold text-secondary italic">VIA</span>
			</h1>	
			<div className="flex gap-4">
				<Copybox />
				{chatContext.resumePdfPath === "" ? <></> : <OpenPDF />}
				<p className="flex gap-2 px-4 py-2 border-2 rounded-xl border-border-muted bg-bg-light shadow-[inset_0_0.25rem_0.5rem_rgba(0,0,0,0.2)]">
					<span className="text-text-muted">Memories Loaded:</span><span className="text-primary font-semibold">{memoryContext.memories.length}</span>
				</p>
				<button
					onClick={toggleTheme}
					className="border-2 rounded-xl border-border-muted px-4 py-2 text-text-muted hover:text-text hover:border-primary bg-bg-light"
				>
					<Power size={20}/>
				</button>
			</div>
		</header>
	)
}
