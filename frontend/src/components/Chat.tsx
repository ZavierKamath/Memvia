import { useState, useEffect } from 'react';
import { invokeJob, createEventListenersForJob } from '../api/jobs.ts';
import { useChat } from '../hooks/useChat.tsx';
import type { ChatItemType, ChatMessageType, ToolMessageType } from '../context/ChatContext.tsx'

function ToolMessage({ message, agent }: { message: ToolMessageType, agent: "membot" | "resumebot" }) {
	const [expanded, setExpanded] = useState(false)

	function toggleExpanded() {
		setExpanded(expanded ? false : true)
	}

	const { toolName, inputs, outputs } = {
		toolName: message.toolName,
		inputs: message.inputs,
		outputs: message.outputs
	}

	function conditionalExpandedRender() {
		if (expanded) {
			return (
				<>
					<div>{toolName}</div>
					<div>{JSON.stringify(inputs)}</div>
					<div>{JSON.stringify(outputs)}</div>
				</>
			)
		}
		return <div>{toolName}</div>
	}

	function upOrDown() {
		return expanded ? "^" : "⌄"
	}

	const toolContainerClasses: string = `tool-message ${agent}`

	return (
		<div className={toolContainerClasses}>
			<p>Tool Use</p>
			{conditionalExpandedRender()}
			<button onClick={() => toggleExpanded()}>{upOrDown()}</button>
		</div>
	)
}

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

function ResumeScreen() {
	const chatContext = useChat();
	const resumeChat = chatContext.resumeBotChat

	function conditionalMessageRender(message: ChatItemType) {
		if ("toolName" in message) {
			return <ToolMessage key={JSON.stringify(message.outputs)} message={message} agent="membot" />
		}

		return <ChatMessage key={message.number} message={message} />
	}

	return (
		<>
			{resumeChat.map((message: ChatItemType) => (
				conditionalMessageRender(message)
			))}
		</>
	)
}

function Screen() {
	const chatContext = useChat();
	const chat = chatContext.chat;

	function conditionalMessageRender(message: ChatItemType) {
		if ("toolName" in message) {
			return <ToolMessage key={JSON.stringify(message.outputs)} message={message} agent="membot" />
		}

		return <ChatMessage key={message.number} message={message} />
	}

	return (
		<>
			{chat.map((message: ChatItemType) => (
				conditionalMessageRender(message)
			))}
		</>
	)
}

export default function Chat() {
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
			return <Screen />	
		}
	}

	return (
		<div>
			<h1>Chat</h1>
			{conditionalScreenRender()}
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
