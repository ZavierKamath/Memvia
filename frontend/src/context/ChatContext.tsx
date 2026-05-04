import { createContext, useState } from "react";
import type { ReactNode } from "react";

export type ChatMessageType = {
	sender: 'AI' | 'USER'
	message: string
	number: number
	sentTimestamp: string,
}

type ChatContextType = {
	chat: ChatMessageType[];
	sessionId: string;
	messageNumber: number;
	addMessage: (message: ChatMessageType) => void;
	setSessionId: (sessionId: string) => void;
	setMessageNumber: (messageNumber: number) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
	const [chat, setChat] = useState<ChatMessageType[]>([]);
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

	return (
		<ChatContext.Provider value={{ chat, sessionId, messageNumber, addMessage, setSessionId, setMessageNumber }}>
			{children}
		</ChatContext.Provider>
	)
}
