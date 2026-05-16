import { useChat } from '../../hooks/useChat.tsx';
import type { ChatItemType } from '../../context/ChatContext.tsx'
import { ToolMessage, ChatMessage } from './MessageCards.tsx'
import { PDFCard } from './PDFCard.tsx';

export function ResumeScreen() {
	const chatContext = useChat();
	const resumeChat = chatContext.resumeBotChat

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
		<div className="resume-screen-container">
			<h2>ResumeBot</h2>
			<button onClick={() => chatContext.setResumeBotView(false)} className="floating-close-resume-chat">X</button>
			<div className="resume-screen-messages">
				{resumeChat.map((message: ChatItemType) => (
					conditionalMessageRender(message)
				))}
			</div>
			{conditionalPdfRender()}
		</div>
	)
}

export function Screen() {
	const chatContext = useChat();
	const chat = chatContext.chat;

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
			return <button onClick={() => chatContext.setResumeBotView(true)} className="floating-open-resume-chat">→</button>
		}
	
	}

	return (
		<div className="screen-container">
			<h2>MemBot</h2>
			<div className="screen-content">
				{showArrow()}
				{chat.map((message: ChatItemType) => (
					conditionalMessageRender(message)
				))}
			</div>
		</div>
	)
}
