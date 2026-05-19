import { useRef, useEffect } from 'react'
import { useChat } from '../../hooks/useChat.tsx';
import type { ChatItemType } from '../../context/ChatContext.tsx'
import { ToolMessage, ChatMessage } from './MessageCards.tsx'
import { PDFCard } from './PDFCard.tsx';
import './Screens.css'

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
		<div className="resume-screen-and-header">
			<div className="resume-screen-header">
				<h2>ResumeBot</h2>
				<button onClick={() => chatContext.setResumeBotView(false)} className="screen-header-button floating-close-resume-chat">X</button>
			</div>
			<div ref={resumeScreenRef} className="resume-screen-container">
				<div className="resume-screen-messages">
					{resumeChat.map((message: ChatItemType) => (
						conditionalMessageRender(message)
					))}
				</div>
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
			return <ToolMessage key={JSON.stringify(message.outputs)} message={message} agent="membot" />
		}

		return <ChatMessage key={message.number} message={message} />
	}

	function showArrow() {
		if (chatContext.resumeBotView) {
			return	
		} else {
			return <button onClick={() => chatContext.setResumeBotView(true)} className="screen-header-button floating-open-resume-chat">→</button>
		}
	
	}

	return (
		<div className='screen-and-header'>
			<div className="screen-header">
				<h2>MemBot</h2>
				{showArrow()}
			</div>
			<div ref={screenRef} className="screen-container">
				<div className="screen-content">
					{chat.map((message: ChatItemType) => (
						conditionalMessageRender(message)
					))}
				</div>
			</div>
		</div>
	)
}
