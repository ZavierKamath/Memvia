import type { ToolMessageType } from "../context/ChatContext"
import { useChat } from "../hooks/useChat"
import { ToolSet } from "../components/chat/MessageCards"
import { MemoryManager } from "./memory/MemoryManager"

export function Sidebar() {
	const chatContext = useChat()
	const toolMessages: ToolMessageType[] = []

	for (const message of chatContext.chat) {
		if ("toolName" in message) {
			toolMessages.push(message)
		}	
	}

	return (
		<div className="flex flex-col gap-8 p-6 bg-bg-light h-full">
			<ToolSet toolMessages={toolMessages}/>
			<MemoryManager />
		</div>
	)
}
