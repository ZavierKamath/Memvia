import { createContext, useState } from "react";
import type { ReactNode } from "react";

export type ThinkingMessageType = {
	message_type: 'thinking'
	message: string
}

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

export type CopyableTextType = {
	copyableText: string
	order: number
}

export type ChatItemType = ChatMessageType | ToolMessageType | ThinkingMessageType;

type ChatContextType = {
	chat: ChatItemType[];
	resumeBotChat: ChatItemType[];
	resumeBotView: boolean;
	sessionId: string;
	resumePdfPath: string;
	messageNumber: number;
	resumeBotMessageNumber: number;
	copybox: CopyableTextType[];
	addMessage: (message: ChatItemType) => void;
	setSessionId: (sessionId: string) => void;
	setMessageNumber: (messageNumber: number) => void;
	setResumeBotMessageNumber: (messageNumber: number) => void;
	addToolMessage: (toolMessage: ToolMessageType) => void;
	setResumeBotView: (value: boolean) => void;
	addResumeBotToolMessage: (toolMessage: ToolMessageType) => void;
	setResumePDFPath: (pdfPath: string) => void;
	addCopyboxElement: (copyableTextValue: string) => void;
	replaceLastThinkingMessage: (nextThinkingMessage: ChatItemType) => void;
	model: string;
	setModel: (modelString: string) => void;
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
	const [copybox, setCopybox] = useState<CopyableTextType[]>([]);
	const [model, setModel] = useState<string>("deepseek/deepseek-v4-pro")

	function addMessage(message: ChatItemType) {
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

	function replaceLastThinkingMessage(nextThinkingMessage: ChatItemType) {
		setChat(current => [...current.filter(item => !("message_type" in item)), nextThinkingMessage])
	}

	function addCopyboxElement(copyableTextValue: string) {
		if (copybox.length !== 0) {
			setCopybox((current) => {
				const nextOrder = current.length === 0 ? 0 : current[current.length - 1].order + 1
				return [...current, { copyableText: copyableTextValue, order: nextOrder }]
			})
		} else {
			const newCopyboxElement: CopyableTextType = {
				copyableText: copyableTextValue,
				order: 0
			}
			setCopybox((current) => ([newCopyboxElement]))
		}
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
			copybox,
			addMessage,
			setSessionId,
			setMessageNumber,
			setResumeBotMessageNumber,
			addToolMessage,
			setResumeBotView,
			addResumeBotToolMessage,
			setResumePDFPath,
			addCopyboxElement,
			replaceLastThinkingMessage,
			model,
			setModel
		}}>
			{children}
		</ChatContext.Provider>
	)
}
