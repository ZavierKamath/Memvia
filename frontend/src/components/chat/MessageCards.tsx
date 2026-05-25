import { useState } from 'react'
import type { ChatMessageType, ToolMessageType } from '../../context/ChatContext.tsx'
import { ChevronUp, ChevronDown, Wrench } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function ToolSet({ toolMessages }: { toolMessages: ToolMessageType[]}) {
	const [expanded, setExpanded] = useState(false)

	function toggleExpanded() {
		if (toolMessages.length > 0) {
			setExpanded(expanded ? false : true)
		}
	}

	if (expanded) {
		return (
			<div className="flex flex-col">
				<div
					className="text-sm shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)] border-2 border-border flex gap-4 justify-between items-center px-4 py-2 bg-bg-dark rounded-xl rounded-b-none border-b-1 text-text-muted"
					onClick={toggleExpanded}
				>
					<p className="flex gap-2 text-text">
						<Wrench size={16}/>
						<span className="text-text">Tools Used:</span><span className="text-primary font-bold">{toolMessages.length}</span>
					</p>
					<button
						className="text-text-muted hover:text-text font-bold"
						onClick={toggleExpanded}
					>
						<ChevronUp size={20}/>
					</button>
				</div>		
				<div
					className="text-xs flex flex-col border-2 border-border border-t-1 gap-2 justify-between items-center px-4 py-2 bg-bg-dark rounded-xl rounded-t-none shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)] motion-translate-y-in-25 motion-opacity-in-0 motion-duration-300 hover:border-primary"
				>
					{toolMessages.map((message) => {
						return <ToolMessage key={JSON.stringify(message.outputs)} message={message} agent="membot"/>
					})}
				</div>
			</div>
		)
	} else {
		return (
			<div
				className="text-sm shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)] border-2 border-border flex gap-4 justify-between items-center px-4 py-2 bg-bg-dark rounded-xl text-text-muted hover:-motion-translate-y-loop-[10%] hover:motion-duration-700 hover:border-primary"
				onClick={toggleExpanded}
			>
				<p className="flex gap-2 text-text">
					<Wrench size={16}/>
					<span>Tools Used:</span><span className="text-primary font-bold">{toolMessages.length}</span>
				</p>
				<button
					className="text-text-muted hover:text-text font-bold"
				>
					<ChevronDown size={20}/>
				</button>
			</div>		
		)
	}
}

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

	const codeClasses = "bg-bg text-text-muted px-2 py-1 rounded-xl border-bg-light max-w-full min-w-0 overflow-hidden"
	const preClasses = "max-w-full overflow-x-auto whitespace-pre-wrap break-words px-2 py-1 text-[0.6rem]"

	function conditionalExpandedRender() {
		if (expanded) {
			return (
				<div
					className="flex flex-col gap-1 px-2 py-1 rounded-xl bg-bg-dark motion-translate-y-in-25 motion-opacity-in-0 motion-duration-300"
				>
					<div className={`${codeClasses} rounded-b-none`}>
						<pre className={preClasses}>
							<code className="w-150">{JSON.stringify(inputs, null, 2)}</code>
						</pre>
					</div>
					<div className={`${codeClasses} rounded-t-none`}>
						<pre className={preClasses}>
							<code className="w-150">{JSON.stringify(outputs, null, 2)}</code>
						</pre>
					</div>
				</div>
			)
		}
		return <></>
	}

	function upOrDown() {
		return expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>
	}

	return (
		<div className="flex flex-col gap-[0.5] w-full">
			<div className="text-xs text-text-muted flex justify-between items-center bg-bg-dark rounded-xl px-2 py-1">
				<div className="text-text">{toolName}</div>
				<button
					className="text-text-muted hover:text-text"
					onClick={() => toggleExpanded()}
				>{upOrDown()}</button>
			</div>
			{conditionalExpandedRender()}
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

	const cleanedMessage = message_content.replace(/^['"]|['"]$/g, "")

	return (
		<div
			className={`flex flex-col gap-4 rounded-xl border-2 line-height-1 px-4 py-2 break-words motion-opacity-in-0 motion-translate-y-in-2 motion-scale-in-95 motion-duration-300 motion-ease-out ${sender === "USER" ? "min-w-0 max-w-160 shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)] text-left ml-auto rounded-br-none border-border bg-bg text-text" : "text-left rounded-bl-none bg-none text-text border-none [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1"}`}
		>
			<div>
				{sender === "AI" ? (
					<ReactMarkdown remarkPlugins={[remarkGfm]}>
						{cleanedMessage}
					</ReactMarkdown>
				) : (
					cleanedMessage
				)
				}
			</div>
		</div>
	)
}
