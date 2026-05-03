import { useState } from 'react';
import { createJob, createEventListenersForJob } from '../api/jobs.ts';
import { useChat } from '../hooks/useChat.tsx';
import type { ChatMessageType } from '../context/ChatContext.tsx'

function ChatMessage({ message }: { message: ChatMessageType }) {
	return (
		<>
			<div>{message.sender}</div>
			<div>{message.message}</div>
			<div>{message.sentTimestamp}</div>
		</>
	)
}

function Screen() {
	const chatContext = useChat();
	const chat = chatContext.chat;
	return (
		<>
			{chat.map((message: ChatMessageType) => (
				<ChatMessage
					key={message.message}
					message={message}
				/>
			))}
		</>
	)
}

export default function Chat() {
	const chatContext = useChat();
	const [inputText, setInputText] = useState("");

	async function handleSend() {
		const query: string = inputText;
		const jobId: string = await createJob(chatContext.setSessionId)
		createEventListenersForJob(jobId, chatContext.setSessionId, chatContext.addMessage)
	}

	return (
		<div>
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
