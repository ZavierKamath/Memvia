import { useRef, useEffect } from 'react'
import { useChat } from '../../hooks/useChat.tsx';
import type { ChatItemType, ToolMessageType } from '../../context/ChatContext.tsx'
import { ToolMessage, ChatMessage } from './MessageCards.tsx'
import { PDFCard } from './PDFCard.tsx';
import { X, PanelLeftOpen } from "lucide-react";
import { ToolSet } from './MessageCards.tsx';

const screenContainerClass = "h-[75vh] w-[84.9vw] border border-border flex flex-col rounded-xl"
const screenHeaderContainerClass = "border-b border-border rounded-t-xl text-text flex justify-between items-center px-4 py-2 font-bold bg-gradient-to-b from-bg-light via-bg to-bg"
const screenHeaderClass = "text-text font-normal"
const screenHeaderButtonClass = "text-text-muted hover:text-text"
const screenContentContainerClass = "flex-1 flex flex-col min-h-0 overflow-y-scroll bg-bg rounded-xl rounded-t-none gap-5 py-6 px-6"

export function ResumeScreen() {
	const chatContext = useChat();
	const resumeChat = chatContext.resumeBotChat
	const resumeScreenRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		resumeScreenRef.current?.scrollTo({
			top: resumeScreenRef.current.scrollHeight,
			behavior: "smooth",
		})
	}, [chatContext.resumeBotChat])

	function conditionalMessageRender(message: ChatItemType) {
		if ("toolName" in message) {
			return <ToolMessage key={JSON.stringify(message.outputs)} message={message} agent="resumebot" />
		}

		return <ChatMessage key={message.number} message={message} />
	}

	function conditionalPdfRender() {
		if (chatContext.resumePdfPath !== "") {
			return <PDFCard pdfPath={chatContext.resumePdfPath} />
		} else {
			return
		}
	}

	return (
		<div className={`${screenContainerClass} min-w-[30vw]`}>
			<div className={screenHeaderContainerClass}>
				<h2 className={screenHeaderClass}>ResumeBot</h2>
				<button onClick={() => chatContext.setResumeBotView(false)}
					className={screenHeaderButtonClass}
				>
					<X size={20}/>
				</button>
			</div>
			<div ref={resumeScreenRef} className={screenContentContainerClass}>
				{resumeChat.map((message: ChatItemType) => (
					conditionalMessageRender(message)
				))}
				{conditionalPdfRender()}
			</div>
		</div>
	)
}

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
			// return <ToolMessage key={JSON.stringify(message.outputs)} message={message} agent="membot" />
		}

		return <ChatMessage key={message.number} message={message} />
	}

	function showArrow() {
		if (chatContext.resumeBotView) {
			return	
		} else {
			return (
				<button onClick={() => chatContext.setResumeBotView(true)}
					className={screenHeaderButtonClass}>
					<PanelLeftOpen />
				</button>
			)
		}
	
	}

	const toolMessages: ToolMessageType[] = []
	for (const message of chatContext.chat) {
		if ("toolName" in message) {
			toolMessages.push(message)
		}	
	}

	return (
		<div className={`${screenContainerClass} ${chatContext.resumeBotView ? 'min-w-[59.25vw]' : 'w-[90vw]'}`}>
			<div className={screenHeaderContainerClass}>
				<h2 className={screenHeaderClass}>MemBot</h2>
				{showArrow()}
			</div>
			<div ref={screenRef} className={screenContentContainerClass}>
				{toolMessages.length ? <ToolSet toolMessages={toolMessages}/> : <></>}
				{chat.map((message: ChatItemType) => (
					conditionalMessageRender(message)
				))}
			</div>
		</div>
	)
}
