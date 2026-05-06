import { useState, useEffect } from 'react';
import { invokeJob, createEventListenersForJob } from '../api/jobs.ts';
import { useChat } from '../hooks/useChat.tsx';
import type { ChatMessageType } from '../context/ChatContext.tsx'

function ChatMessage({ message }: { message: ChatMessageType }) {
	const { sender, message_content, number, sentTimestamp } = {
		sender: message.sender,
		message_content: message.message,
		number: message.number,
		sentTimestamp: message.sentTimestamp
	}
	console.log(`rendering message with sender: ${sender}, content: ${message_content.slice(0, 25)}..., number: ${message.number}, time: ${sentTimestamp}`)

	const className = [
		"div",
		sender === "USER" ? "user-message" : "ai-message",
	].filter(Boolean).join(" ")

	return (
		<div className={className}>
			<div>{sender}</div>
			<div>{message_content.replace(/^['"]|['"]$/g, "")}</div>
			<div>{sentTimestamp}</div>
		</div>
	)
}

function Screen() {
	const chatContext = useChat();
	const chat = chatContext.chat;

	return (
		<>
			{chat.map((message: ChatMessageType) => (
				<ChatMessage
					key={message.number}
					message={message}
				/>
			))}
		</>
	)
}

export default function Chat() {
	const chatContext = useChat();
	const [inputText, setInputText] = useState("");

	useEffect(() => {
		if (!chatContext.sessionId) return
		return createEventListenersForJob(chatContext.sessionId, chatContext.messageNumber, chatContext.setSessionId, chatContext.addMessage)
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
	}

	return (
		<div>
			<h1>Chat</h1>
			<Screen />
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
	);
}
