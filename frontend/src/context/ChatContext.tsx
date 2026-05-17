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
	resumeBotChat: ChatItemType[];
	resumeBotView: boolean;
	sessionId: string;
	resumePdfPath: string;
	messageNumber: number;
	resumeBotMessageNumber: number;
	addMessage: (message: ChatMessageType) => void;
	setSessionId: (sessionId: string) => void;
	setMessageNumber: (messageNumber: number) => void;
	setResumeBotMessageNumber: (messageNumber: number) => void;
	addToolMessage: (toolMessage: ToolMessageType) => void;
	setResumeBotView: (value: boolean) => void;
	addResumeBotToolMessage: (toolMessage: ToolMessageType) => void;
	setResumePDFPath: (pdfPath: string) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
	const [chat, setChat] = useState<ChatItemType[]>([]);
	const [resumeBotChat, setResumeBotChat] = useState<ChatItemType[]>([]);
	const [resumePdfPath, setResumeChatPDFPath] = useState("");
	const [resumeBotView, setResumeBotChatView] = useState(false);
	const [resumeBotMessageNumber, setResumeBotChatMessageNumber] = useState(0);
	const [sessionId, setChatSessionId] = useState("START");
	const [messageNumber, setChatMessageNumber] = useState(0);

	function addMessage(message: ChatMessageType) {
		setChat((current) => ([...current, message]));
	}

	function setSessionId(sessionId: string) {
		setChatSessionId(sessionId);
	}

	function setResumePDFPath(pdfPath: string) {
		setResumeChatPDFPath(pdfPath);
	}

	function setMessageNumber(messageNumber: number) {
		setChatMessageNumber(messageNumber);
	}
	
	function setResumeBotMessageNumber(messageNumber: number) {
		setResumeBotChatMessageNumber(messageNumber);
	}

	function addToolMessage(toolMessage: ToolMessageType) {
		setChat((current) => ([...current, toolMessage]))
	}

	function addResumeBotToolMessage(toolMessage: ToolMessageType) {
		setResumeBotChat((current) => ([...current, toolMessage]))
	}

	function setResumeBotView(value: boolean) {
		setResumeBotChatView(value)
	}

	return (
		<ChatContext.Provider value={{
			chat,
			resumeBotChat,
			resumeBotView,
			sessionId,
			resumePdfPath,
			messageNumber,
			resumeBotMessageNumber,
			addMessage,
			setSessionId,
			setMessageNumber,
			setResumeBotMessageNumber,
			addToolMessage,
			setResumeBotView,
			addResumeBotToolMessage,
			setResumePDFPath
		}}>
			{children}
		</ChatContext.Provider>
	)
}
