import { useState } from "react"
import { useChat } from "../../hooks/useChat";
import type { CopyableTextType } from "../../context/ChatContext";

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
			return 'big'
		} else {
			return 'small'
		}
	}

	const containerClassName = `copybox-element-container ${conditionalClass()}`
	const buttonText = copied ? "Copied!" : "Copy"

	return (
		<div className={containerClassName}>
			<code>{copyboxElement.copyableText}</code>
			<button type="button" onClick={copyMessage}>{buttonText}</button>
		</div>
	)
}

export function Copybox() {
	const chatContext = useChat()
	const [active, setActive] = useState<boolean>(false)

	function conditionalClass() {
		return chatContext.copybox.length === 0 ? 'empty' : 'full'
	}

	const copyboxClassName = `copybox ${conditionalClass()}`

	function conditionalRender() {
		if (active) {
			if (conditionalClass() === 'full') {
				return (
					<>
						<div className={copyboxClassName}>
						<h2>Copybox</h2>
							{[...chatContext.copybox].reverse().map((copyboxElementValue) => (
								<CopyboxElement key={copyboxElementValue.order} copyboxElement={copyboxElementValue} />
							))}
						</div>
					</>
				)
			} else {
				return (
					<div className="empty-copybox-container">
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
			<button className="copybox-button" onClick={toggleActive}>▣</button>
			{conditionalRender()}
		</>
	)
}
