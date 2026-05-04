import type { ChatMessageType } from "../context/ChatContext.tsx"

export function createEventListenersForJob(jobId: string, messageNumber: number, setSessionId: (sessionId: string) => void, addMessage: (message: ChatMessageType) => void) {
	setSessionId(jobId);

	const es = new EventSource(`http://localhost:8000/jobs/${jobId}/stream`)
	console.log('event source created')

	es.addEventListener("status", (event) => {
		const data = JSON.parse(event.data)
		console.log(`status data: ${JSON.stringify(data)}`)
		// addMessage({
		// 	sender: "AI",
		// 	message: JSON.stringify(data),
		// 	number: messageNumber,
		// 	sentTimestamp: "testtime"
		// })
	})

	es.addEventListener("progress", (event) => {
		const data = JSON.parse(event.data)
		console.log(`progress data: ${JSON.stringify(data)}`)
		// addMessage({
		// 	sender: "AI",
		// 	message: JSON.stringify(data),
		// 	number: messageNumber,
		// 	sentTimestamp: "testtime"
		// })
	})

	es.addEventListener("agent", (event) => {
		const data = JSON.parse(event.data)
		switch (data.kind) {
			case "text_delta":
				console.log("assistant text chunk:", data.payload.delta)
				break
			case "tool_call":
				console.log("tool call:", data.payload.tool_name, data.payload.args)
				break
		}
	})

	es.addEventListener("done", (event) => {
		const data = JSON.parse(event.data)
		console.log(`done data: ${JSON.stringify(data)}`)

		const now = new Date()
		addMessage({
			sender: "AI",
			message: JSON.stringify(data),
			number: messageNumber,
			sentTimestamp: new Intl.DateTimeFormat("en-US", {
				timeZone: "America/New_York",
				hour: "numeric",
				minute: "2-digit"
			}).format(now)
		})
		es.close()
	})

	es.onerror = () => {
		es.close()
	}

	console.log('listeners created')
	return () => es.close()
}

export async function invokeJob(setSessionId: (sessionId: string) => void, setMessageNumber: (messageNumber: number) => void, query: string, sessionId: string, messageNumber: number ) {
	console.log('invoking job')

	const res = await fetch("http://localhost:8000/jobs/invoke", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			question: query,
			sessionId: sessionId,
			messageNumber: messageNumber
		})
	})

	if (!res.ok) {
		console.log('res is not okay')
	}

	const { job_id, message_number } = await res.json()
	setSessionId(job_id);
	setMessageNumber(message_number);
	console.log(`invokeJob returned`)

	return { job_id, message_number }
}
