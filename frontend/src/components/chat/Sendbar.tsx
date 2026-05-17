import { useRef, useState } from 'react'
import { invokeJob } from '../../api/jobs.ts';
import { useChat } from '../../hooks/useChat.tsx';
import type { ChatMessageType } from '../../context/ChatContext.tsx';

function Chatbar(
	{ inputText, setInputText, handleSend }:
	{
		inputText: string,
		setInputText: React.Dispatch<React.SetStateAction<string>>,
		handleSend: () => void
	}
) {
	const ref = useRef<HTMLTextAreaElement>(null)

	function resize() {
		const el = ref.current
		if (!el) return

		el.style.height = "auto"
		el.style.height = `${Math.min(el.scrollHeight,75)}px`
	}


	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}	
	}

	return (
		<textarea
			ref={ref}
			onInput={resize}
			onKeyDown={handleKeyDown}
			value={inputText}
			onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
			rows={1}
			placeholder="Input your prompt for MemBot..."
			className="chatbar"
		/>
	)
}

export function Sendbar() {
	const [inputText, setInputText] = useState("");
	const chatContext = useChat()

	async function handleSend() {
		const query: string = inputText;
		const nextMessageNumber: number =
			(chatContext.messageNumber == 0) ?
			chatContext.messageNumber :
			chatContext.messageNumber + 1

		const now = new Date()
		const userMessage: ChatMessageType = {
			sender: "USER",
			message: query,
			number: nextMessageNumber,
			sentTimestamp: new Intl.DateTimeFormat("en-US", {
				timeZone: "America/New_York",
				hour: "numeric",
				minute: "2-digit"
			}).format(now)
		}
		chatContext.addMessage(userMessage)
		chatContext.setMessageNumber(nextMessageNumber)

		await invokeJob(
			chatContext.setSessionId,
			chatContext.setMessageNumber,
			query,
			chatContext.sessionId,
			nextMessageNumber
		)

		setInputText("")
	}

	return (
		<div className="sendbar">
			<Chatbar
				inputText={inputText}
				setInputText={setInputText}
				handleSend={handleSend}
			/>
			<button
				onClick={handleSend}
			>
				Send
			</button>
		</div>
	)
}
