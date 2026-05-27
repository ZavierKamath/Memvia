import { ChatContext } from "../context/ChatContext"
import { useChat } from "../hooks/useChat"
import { useMemories } from "../hooks/useMemories"
import { PDFCard } from "./chat/PDFCard.tsx"
import { Copybox } from "./copy/CopyBox"
import { Eye, Power } from "lucide-react"
import { useState } from "react"

function OpenPDF() {
	const [opened, setOpened] = useState(false)
	const [beenOpenedBefore, setBeenOpenedbefore] = useState(false)
	const chatContext = useChat()

	function toggleOpened() {
		setBeenOpenedbefore(true)
		setOpened(!opened)
	}

	return (
		<div>
			{opened && (
				<div onClick={() => setOpened(false)} id="blur-layer" className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xl"></div>
			)}
			<div>
				<button
					className={`relative border-2 bg-bg-light px-4 py-2 rounded-xl shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)] hover:border-primary hover:text-text hover:-motion-translate-y-loop-[10%] hover:motion-duration-700 hover:cursor-pointer ${opened ? "border-primary text-text" : "border-border-muted text-text-muted"} `}
					onClick={toggleOpened}
				>
				{!beenOpenedBefore && (
					<span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center">
						<span className="absolute h-full w-full rounded-full bg-secondary motion-scale-loop-200/reset motion-opacity-loop-0/reset motion-duration-2000" />
						<span className="relative h-3 w-3 rounded-full bg-secondary" />
					</span>
				)}
					<Eye />
				</button>
			</div>
			{opened ?
				<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-6 border-2 border-primary shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)] rounded-xl bg-bg-dark z-[50]">
					<div className="motion-translate-y-in-25 motion-opacity-in-0 motion-duration-300 flex items-center flex-col gap-2">
						<h2 className="text-text mb-2 px-1 py-[0.5] border-b-2 border-secondary text-lg font-semibold mr-auto ml-2">Resume Preview</h2>
						<PDFCard pdfPath={chatContext.resumePdfPath}/>
					</div>
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
		<header className="border-2 border-border px-8 py-4 col-span-2 bg-bg text-text flex justify-between items-center">
			<h1 className="text-xl border-b-2 border-primary px-1"> 
				<span className="text-text font-normal">MEM</span><span className="font-bold text-secondary italic">VIA</span>
			</h1>	
			<div className="flex gap-4">
				<p className="flex gap-2 px-4 py-2 border-2 rounded-xl border-border-muted bg-bg-light shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)]">
					<span className="text-text-muted">Memories Loaded:</span><span className="text-primary font-semibold">{memoryContext.memories.length}</span>
				</p>
				<Copybox />
				{chatContext.resumePdfPath === "" ? <></> : <OpenPDF />}
				<button
					onClick={toggleTheme}
					className="border-2 rounded-xl border-border-muted px-4 py-2 text-text-muted hover:text-text hover:border-primary bg-bg-light shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)] hover:-motion-translate-y-loop-[10%] hover:motion-duration-700 hover:cursor-pointer"
				>
					<Power size={20}/>
				</button>
			</div>
		</header>
	)
}
