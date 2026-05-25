import { useRef, useEffect } from 'react'
import { useChat } from '../../hooks/useChat.tsx';
import type { ChatItemType } from '../../context/ChatContext.tsx'
import { ChatMessage } from './MessageCards.tsx'

export function Screen() {
	const chatContext = useChat();
	const chat = chatContext.chat;
	const screenRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		screenRef.current?.scrollTo({
			top: screenRef.current.scrollHeight,
			behavior: "smooth",
		})
	}, [chatContext.chat])

	function conditionalMessageRender(message: ChatItemType) {
		if ("toolName" in message) {
			return <></>
		}

		return <ChatMessage key={message.number} message={message} />
	}

	return (
		<div
			ref={screenRef}
			className="w-full min-h-0 flex-1 overflow-y-scroll bg-bg-light px-8 py-8 rounded-b-none rounded-tr-none flex flex-col gap-8 mb-28 shadow-[inset_0_0.25rem_0.5rem_rgba(0,0,0,0.2)]"
		>
			{chat.map((message: ChatItemType) => (
				conditionalMessageRender(message)
			))}
		</div>
	)
}
