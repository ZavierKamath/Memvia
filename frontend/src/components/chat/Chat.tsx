import { useEffect } from 'react';
import { createEventListenersForJob } from '../../api/jobs.ts';
import { useChat } from '../../hooks/useChat.tsx';
import { Screen } from './Screens.tsx';
import { Sendbar } from './Sendbar.tsx';

export function Chat() {
	const chatContext = useChat();

	useEffect(() => {
		if (!chatContext.sessionId) return
		return createEventListenersForJob(
			chatContext.sessionId,
			chatContext.messageNumber,
			chatContext.setSessionId,
			chatContext.addToolMessage,
			chatContext.setResumeBotView,
			chatContext.addResumeBotToolMessage,
			chatContext.setResumePDFPath,
			chatContext.addCopyboxElement,
			chatContext.replaceLastThinkingMessage
		)
	}, [chatContext.sessionId, chatContext.messageNumber]);


	return (
		<>
			<Screen />
			<Sendbar />
		</>
	);
}
