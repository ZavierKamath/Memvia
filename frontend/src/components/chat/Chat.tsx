import { useEffect } from 'react';
import { createEventListenersForJob } from '../../api/jobs.ts';
import { useChat } from '../../hooks/useChat.tsx';
import { Screen, ResumeScreen } from './Screens.tsx';
import { Sendbar } from './Sendbar.tsx';

export function Chat() {
	const chatContext = useChat();

	useEffect(() => {
		if (!chatContext.sessionId) return
		return createEventListenersForJob(
			chatContext.sessionId,
			chatContext.messageNumber,
			chatContext.setSessionId,
			chatContext.addMessage,
			chatContext.addToolMessage,
			chatContext.setResumeBotView,
			chatContext.addResumeBotToolMessage,
			chatContext.setResumePDFPath,
			chatContext.addCopyboxElement
		)
	}, [chatContext.sessionId, chatContext.messageNumber]);

	function conditionalScreenRender() {
		return (
			<div className="flex gap-2 flex-col sm:flex-row sm:justify-center sm:items-center w-full">	
				<Screen />
				{chatContext.resumeBotView ? <ResumeScreen /> : (<></>)}
			</div>	
		)
	}

	return (
		<div className="flex flex-col gap-2 w-full"> 
			{conditionalScreenRender()}
			<Sendbar />
		</div>
	);
}
