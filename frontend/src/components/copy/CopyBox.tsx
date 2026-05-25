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
				className="text-text-muted hover:text-text bg-bg-light px-2 py-2 rounded-xl"
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
		if (active) {
			if (conditionalClass() === 'full') {
				return (
					<>
						<div className="fixed top-16 right-36 rounded-xl bg-bg-dark border-2 border-highlight text-text px-6 py-3 flex flex-col gap-4 items-center w-[56rem] h-[36rem] shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)] overflow-y-auto">
							<h2 className="text-text mb-2 px-1 py-[0.5] border-b-2 border-secondary text-lg font-semibold mr-auto ml-2">Copybox</h2>
							{[...chatContext.copybox].reverse().map((copyboxElementValue) => (
								<CopyboxElement key={copyboxElementValue.order} copyboxElement={copyboxElementValue} />
							))}
						</div>
					</>
				)
			} else {
				return (
					<div className="fixed top-16 right-58 rounded-xl bg-bg-dark border-2 border-border text-text-muted px-6 py-3">
						<p>No copyable content yet</p>
					</div>
				)
			}
		} else {
			return
		}
	}

	function toggleActive() {
		setActive(active ? false : true)
	}

	return (
		<>
			<button
				className={`rounded-xl px-4 py-2 bg-bg-light border-2  hover:text-text hover:border-primary shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)] ${active ? "text-text border-primary" : "border-border-muted text-text-muted"}`}
				onClick={toggleActive}
			>
				<ClipboardList size={20}/>
			</button>
			{conditionalRender()}
		</>
	)
}
