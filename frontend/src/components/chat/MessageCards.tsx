import { useState } from 'react'
import type { ChatMessageType, ToolMessageType } from '../../context/ChatContext.tsx'

export function ToolMessage({ message, agent }: { message: ToolMessageType, agent: "membot" | "resumebot" }) {
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
				<div className="tool-expanded">
					<div className="tool-message-part tool-name">{toolName}</div>
					<div className="tool-message-part tool-inputs">{JSON.stringify(inputs)}</div>
					<div className="tool-message-part tool-outputs">{JSON.stringify(outputs)}</div>
				</div>
			)
		}
		return <div className="tool-message-part tool-name">{toolName}</div>
	}

	function upOrDown() {
		return expanded ? "^" : "⌄"
	}

	const toolContainerClasses: string = `tool-message ${agent}`

	return (
		<div className={toolContainerClasses}>
			<p>Tool Use:</p>
			{conditionalExpandedRender()}
			<button onClick={() => toggleExpanded()}>{upOrDown()}</button>
		</div>
	)
}

export function ChatMessage({ message }: { message: ChatMessageType }) {
	const { sender, message_content, _number, sentTimestamp } = {
		sender: message.sender,
		message_content: message.message,
		_number: message.number,
		sentTimestamp: message.sentTimestamp
	}
	console.log(`rendering message with sender: ${sender}, content: ${message_content.slice(0, 25)}..., number: ${message.number}, time: ${sentTimestamp}`)

	const className = [
		"div",
		sender === "USER" ? "user-message" : "ai-message",
	].filter(Boolean).join(" ")

	return (
		<div className={className}>
			<div className="chat-message-part sender">{sender}</div>
			<div className="chat-message-part content">{message_content.replace(/^['"]|['"]$/g, "")}</div>
			<div className="chat-message-part timestamp">{sentTimestamp}</div>
		</div>
	)
}
