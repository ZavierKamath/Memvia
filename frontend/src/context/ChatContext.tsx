import { createContext, useState } from "react";
import type { ReactNode } from "react";

export type ToolMessageType = {
	toolName: string
	inputs: Record<string, unknown>
	outputs: Record<string, unknown>
}

export type ChatMessageType = {
	sender: 'AI' | 'USER'
	message: string
	number: number
	sentTimestamp: string,
}

export type ChatItemType = ChatMessageType | ToolMessageType;

type ChatContextType = {
	chat: ChatItemType[];
	sessionId: string;
	messageNumber: number;
	addMessage: (message: ChatMessageType) => void;
	setSessionId: (sessionId: string) => void;
	setMessageNumber: (messageNumber: number) => void;
	addToolMessage: (toolMessage: ToolMessageType) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
	const [chat, setChat] = useState<ChatItemType[]>([]);
	const [sessionId, setChatSessionId] = useState("START");
	const [messageNumber, setChatMessageNumber] = useState(0);

	function addMessage(message: ChatMessageType) {
		setChat((current) => ([...current, message]));
	}

	function setSessionId(sessionId: string) {
		setChatSessionId(sessionId);
	}

	function setMessageNumber(messageNumber: number) {
		setChatMessageNumber(messageNumber);
	}

	function addToolMessage(toolMessage: ToolMessageType) {
		setChat((current) => ([...current, toolMessage]))

	}

	return (
		<ChatContext.Provider value={{ chat, sessionId, messageNumber, addMessage, setSessionId, setMessageNumber, addToolMessage }}>
			{children}
		</ChatContext.Provider>
	)
}
