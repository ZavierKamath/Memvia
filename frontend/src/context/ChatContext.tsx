import { createContext, useState } from "react";
import type { ReactNode } from "react";

export type ChatMessageType = {
	sender: 'AI' | 'USER'
	message: string
	sentTimestamp: string,
}

type ChatContextType = {
	chat: ChatMessageType[];
	sessionId: string;
	addMessage: (message: ChatMessageType) => void;
	setSessionId: (sessionId: string) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
	const [chat, setChat] = useState<ChatMessageType[]>([]);
	const [sessionId, setChatSessionId] = useState("START");

	function addMessage(message: ChatMessageType) {
		setChat((current) => ([...current, message]));
	}

	function setSessionId(sessionId: string) {
		setChatSessionId(sessionId);
	}

	return (
		<ChatContext.Provider value={{ chat, sessionId, addMessage, setSessionId }}>
			{children}
		</ChatContext.Provider>
	)
}
