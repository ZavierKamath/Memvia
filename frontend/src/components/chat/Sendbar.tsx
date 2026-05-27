import { useEffect, useRef, useState } from 'react'
import { invokeJob } from '../../api/jobs.ts';
import { useChat } from '../../hooks/useChat.tsx';
import type { ChatMessageType } from '../../context/ChatContext.tsx';
import { SendHorizontal } from "lucide-react"

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

	useEffect(() => {
		resize()
	}, [inputText])


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
			className="text-text-muted bg-sendbar-bg rounded-xl border-2 border-primary px-4 py-2 pt-[0.4rem] w-150 line-height-1 min-h-10 max-h-30 hover:border-primary focus:outline-none focus:border-primary resize-none scrollbar-hidden shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)] focus:text-text hover:shadow-[0_0_1.5rem_theme(var(--primary))] hover:-motion-translate-y-loop-[10%] hover:motion-duration-700 focus:animate-none"
		/>
	)
}

export function Sendbar() {
	const [inputText, setInputText] = useState("");
	const chatContext = useChat()

	async function handleSend() {
		const query: string = inputText.trim();
		if (!query) return

		setInputText("")

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

	}

	return (
		<div className="fixed bottom-10 right-50 flex gap-4 justify-center">
			<Chatbar
				inputText={inputText}
				setInputText={setInputText}
				handleSend={handleSend}
			/>
			<button
				onClick={handleSend}
				className="h-10 text-text-muted flex justify-center items-center bg-sendbar-bg rounded-xl border-2 border-primary px-4 py-2 w-20 hover:border-primary hover:text-text focus:outline-none focus:border-highlight focus:ring-1 focus:ring-primary/10 shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)] focus:ring-b-2 hover:-motion-translate-y-loop-[10%] hover:motion-duration-700 hover:cursor-pointer"
			>
				<SendHorizontal size={18}/>
			</button>
		</div>
	)
}
