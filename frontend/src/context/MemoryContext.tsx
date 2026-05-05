import { createContext, useState } from "react";
import type { ReactNode } from "react";

export type MemoryKind = "experience" | "skills" | "education" | "project" | "other"

export type MemoryType = {
	id: string
	kind: MemoryKind
    title: string
    content: string
	embedding: null | number[]
}

type MemoryContextType = {
	chat: MemoryType[];
	sessionId: string;
	messageNumber: number;
	addMessage: (message: MemoryType) => void;
	setSessionId: (sessionId: string) => void;
	setMessageNumber: (messageNumber: number) => void;
}

export const MemoryContext = createContext<MemoryContextType | null>(null)

export function MemoryProvider({ children }: { children: ReactNode }) {
	const [chat, setChat] = useState<MemoryType[]>([]);
	const [sessionId, setChatSessionId] = useState("START");
	const [messageNumber, setChatMessageNumber] = useState(0);

	function addMessage(message: MemoryType) {
		setChat((current) => ([...current, message]));
	}

	function setSessionId(sessionId: string) {
		setChatSessionId(sessionId);
	}

	function setMessageNumber(messageNumber: number) {
		setChatMessageNumber(messageNumber);
	}

	return (
		<MemoryContext.Provider value={{ chat, sessionId, messageNumber, addMessage, setSessionId, setMessageNumber }}>
			{children}
		</MemoryContext.Provider>
	)
}
