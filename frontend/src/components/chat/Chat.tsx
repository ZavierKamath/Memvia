import { useState, useEffect } from 'react';
import { invokeJob, createEventListenersForJob } from '../../api/jobs.ts';
import { useChat } from '../../hooks/useChat.tsx';
import type { ChatMessageType } from '../../context/ChatContext.tsx';
import { Screen, ResumeScreen } from './Screens.tsx';

export function Chat() {
	const chatContext = useChat();
	const [inputText, setInputText] = useState("");

	useEffect(() => {
		if (!chatContext.sessionId) return
		return createEventListenersForJob(
			chatContext.sessionId,
			chatContext.messageNumber,
			chatContext.setSessionId,
			chatContext.addMessage,
			chatContext.addToolMessage,
			chatContext.setResumeBotView,
			chatContext.addResumeBotToolMessage,
			chatContext.setResumePDFPath
		)
	}, [chatContext.sessionId, chatContext.messageNumber]);

	async function handleSend() {
		const query: string = inputText;
		const nextMessageNumber: number = (chatContext.messageNumber == 0) ? chatContext.messageNumber : chatContext.messageNumber + 1

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
			chatContext.setSessionId, chatContext.setMessageNumber, query, chatContext.sessionId, nextMessageNumber
		)

		setInputText("")
	}

	function conditionalScreenRender() {
		if (chatContext.resumeBotView) {
			return (
				<div className="screens-container">	
					<Screen />
					<ResumeScreen />
				</div>	
			)
		} else {
			return (
				<div className="screens-container">	
					<Screen />	
				</div>	
			)
		}
	}

	return (
		<div className="chat-screen">
			{conditionalScreenRender()}
			<div className="sendbar">
				<input
					value={inputText}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
					placeholder="Type your question"
				/>
				<button
					onClick={handleSend}
				>
					Send
				</button>
			</div>
		</div>
	);
}
