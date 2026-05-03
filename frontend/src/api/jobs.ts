import type { ChatMessageType } from "../context/ChatContext.tsx"

export function createEventListenersForJob(jobId: string, setSessionId: (sessionId: string) => void, addMessage: (message: ChatMessageType) => void) {
	setSessionId(jobId);

	const es = new EventSource(`http://localhost:8000/jobs/${jobId}/stream`)
	console.log('event source created')

	es.addEventListener("status", (event) => {
		const data = JSON.parse(event.data)
		console.log(`status data: ${JSON.stringify(data)}`)
		addMessage({
			sender: "AI",
			message: JSON.stringify(data),
			sentTimestamp: "testtime"
		})
	})

	es.addEventListener("progress", (event) => {
		const data = JSON.parse(event.data)
		console.log(`progress data: ${JSON.stringify(data)}`)
		addMessage({
			sender: "AI",
			message: JSON.stringify(data),
			sentTimestamp: "testtime"
		})
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
		addMessage({
			sender: "AI",
			message: JSON.stringify(data),
			sentTimestamp: "testtime"
		})
		es.close()
	})

	es.onerror = () => {
		es.close()
	}

	console.log('listeners created')
	return () => es.close()
}

export async function createJob(setSessionId: (sessionId: string) => void, query: string ) {
	console.log('creating job')
	const res = await fetch("http://localhost:8000/jobs", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			question: query,
		})
	})
	console.log('frontend started job')

	if (!res.ok) {
		console.log('res is not okay')
	}

	const { job_id } = await res.json()
	setSessionId(job_id);
	return job_id
}
