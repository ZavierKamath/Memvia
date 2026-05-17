import { useState } from 'react'
import type { ChatMessageType, ToolMessageType } from '../../context/ChatContext.tsx'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

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
					<div className="tool-message-part tool-inputs">
						<pre>
							<code>{JSON.stringify(inputs, null, 2)}</code>
						</pre>
					</div>
					<div className="tool-message-part tool-outputs">
						<pre>
							<code>{JSON.stringify(outputs, null, 2)}</code>
						</pre>
					</div>
				</div>
			)
		}
		return 
	}

	function upOrDown() {
		return expanded ? "^" : "⌄"
	}

	const toolContainerClasses: string = `tool-message ${agent} ${expanded ? "expanded" : "collapsed"}`

	return (
		<div className={toolContainerClasses}>
			<div className="collapsed-content">
				<p>Tool Use:</p>
				<div className="tool-message-part tool-name">{toolName}</div>
				<button
					className="expansion-button"
					onClick={() => toggleExpanded()}
				>{upOrDown()}</button>
			</div>
			<div className="expanded-content">
				{conditionalExpandedRender()}
			</div>
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
