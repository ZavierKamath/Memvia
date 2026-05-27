import { useState } from "react"
import { useChat } from "../../hooks/useChat";
import type { CopyableTextType } from "../../context/ChatContext";
import { ClipboardList, Copy, CopyCheck } from "lucide-react"

export function CopyboxElement(
	{ copyboxElement }:
	{ copyboxElement: CopyableTextType }
) {
	const chatContext = useChat()
	const [copied, setCopied] = useState<boolean>(false)

	async function copyMessage() {
		await navigator.clipboard.writeText(copyboxElement.copyableText)
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}

	function conditionalClass() {
		if (copyboxElement.order === chatContext.copybox.length - 1) {
			return 'border-primary w-[90%] px-8 py-4 mb-2'
		} else {
			return 'border-border-muted w-[80%] px-4 py-2'
		}
	}

	const buttonIcon = !copied ? <Copy size={16}/> : <CopyCheck size={16}/>

	return (
		<div className={`flex items-end justify-between bg-bg border-2 rounded-xl ${conditionalClass()}`}>
			<code className="bg-bg-light px-2 py-1 rounded-xl w-[80%]">{copyboxElement.copyableText}</code>
			<button type="button"
				onClick={copyMessage}
				className={`bg-bg-light px-2 py-2 rounded-xl hover:-motion-translate-y-loop-[10%] hover:motion-duration-700 hover:cursor-pointer ${copied ? "text-success" : "text-text-muted hover:text-text"}`}
			>
				{buttonIcon}
			</button>
		</div>
	)
}

export function Copybox() {
	const chatContext = useChat()
	const [active, setActive] = useState<boolean>(false)

	function conditionalClass() {
		return chatContext.copybox.length === 0 ? 'empty' : 'full'
	}

	function conditionalRender() {
			if (conditionalClass() === 'full') {
				return (
					<>
						<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[50] rounded-xl bg-bg-dark border-2 border-primary text-text px-6 py-3 w-[56rem] h-[36rem] shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)] overflow-y-auto">
							<div className="motion-translate-y-in-25 motion-opacity-in-0 motion-duration-300 flex flex-col gap-4 items-center">
								<h2 className="text-text mb-2 px-1 py-[0.5] border-b-2 border-secondary text-lg font-semibold mr-auto ml-2">Copybox</h2>
								{[...chatContext.copybox].reverse().map((copyboxElementValue) => (
									<CopyboxElement key={copyboxElementValue.order} copyboxElement={copyboxElementValue} />
								))}
							</div>
						</div>
					</>
				)
			} else {
				return (
					<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[50] rounded-xl bg-bg-dark border-2 border-primary text-text-muted px-6 py-3">
						<div className="motion-translate-y-in-25 motion-opacity-in-0 motion-duration-300">
							<p>No copyable content yet</p>
						</div>
					</div>
				)
			}
		}

	function toggleActive() {
		const nextActive = !active
		setActive(nextActive)
	}

	return (
		<>
			{active && (
				<div onClick={() => setActive(false)} id="blur-layer" className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xl"></div>
			)}
			<button
				id="copy-button"
				className={`rounded-xl px-4 py-2 bg-bg-light border-2 hover:text-text hover:border-primary shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)] hover:-motion-translate-y-loop-[10%] hover:motion-duration-700 hover:cursor-pointer ${active ? "text-text border-primary" : "border-border-muted text-text-muted"}`}
				onClick={toggleActive}
			>
				<ClipboardList size={20}/>
			</button>
			{active && conditionalRender()}
		</>
	)
}
