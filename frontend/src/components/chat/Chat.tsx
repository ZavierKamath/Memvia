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
			chatContext.setResumePDFPath
		)
	}, [chatContext.sessionId, chatContext.messageNumber]);

	function conditionalScreenRender() {
		if (chatContext.resumeBotView) {
			return (
				<div className="screens-container">	
					<Screen />
					<ResumeScreen />
				</div>	
			)
		} else {
			return (
				<div className="screens-container">	
					<Screen />	
				</div>	
			)
		}
	}

	return (
		<div className="chat-screen">
			{conditionalScreenRender()}
			<Sendbar />
		</div>
	);
}
