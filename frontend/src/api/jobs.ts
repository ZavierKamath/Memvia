import type { ChatMessageType, ChatItemType, ToolMessageType, ThinkingMessageType } from "../context/ChatContext.tsx"

export function createEventListenersForJob(
	jobId: string,
	messageNumber: number,
	setSessionId: (sessionId: string) => void,
	addToolMessage: (toolMessage: ToolMessageType) => void,
	setResumeBotView: (value: boolean) => void,
	addResumeBotToolMessage: (toolMessage: ToolMessageType) => void,
	setResumePDFPath: (pdfPath: string) => void,
	addCopyboxElement: (copyableText: string) => void,
	replaceLastThinkingMessage: (nextThinkingMessage: ChatItemType) => void
) {
	if (jobId === 'START') {
		return 
	}
	setSessionId(jobId);

	const es = new EventSource(`http://localhost:8000/jobs/${jobId}/stream`)
	console.log('event source created')

	es.addEventListener("tool_result", (event) => {
		const data = JSON.parse(event.data)
		console.log(`tool_result data: ${JSON.stringify(data)}`)
		const toolMessage: ToolMessageType = {
			toolName: data.tool_name,
			inputs: data.inputs,
			outputs: data.outputs
		}
		addToolMessage(toolMessage)
	})

	es.addEventListener("publish_copybox", (event) => {
		const data = JSON.parse(event.data)
		console.log(`tool_result data: ${JSON.stringify(data)}`)
		const copyableText = data.copyable_text
		addCopyboxElement(copyableText)
	})

	es.addEventListener("start_resumebot", (event) => {
		const data = JSON.parse(event.data)
		console.log(`start_resumebot data: ${JSON.stringify(data)}`)
		setResumeBotView(true)
	})

	es.addEventListener("resumebot_tool_result", (event) => {
		const data = JSON.parse(event.data)
		console.log(`resumebot_tool_result data: ${JSON.stringify(data)}`)
		const toolMessage: ToolMessageType = {
			toolName: data.tool_name,
			inputs: data.inputs,
			outputs: data.outputs
		}
		addResumeBotToolMessage(toolMessage)
	})

	es.addEventListener("end_resumebot", (event) => {
		const data = JSON.parse(event.data)
		console.log(`end_resumebot data: ${JSON.stringify(data)}`)
		setResumePDFPath(data.outputs.output_path)
	})

	let thinkingBuffer: string = ""

	es.addEventListener("agent", (event) => {
		const data = JSON.parse(event.data)
		switch (data.kind) {
			case "thinking_delta":
				console.log("assistant thinking delta chunk:", data.payload.delta)
				const delta: string = data.payload.delta
				thinkingBuffer += delta
				if (thinkingBuffer.length > 175) {
					const newThinkingMessage: ThinkingMessageType = {
						message_type: "thinking",
						message: thinkingBuffer
					}
					replaceLastThinkingMessage(newThinkingMessage)
					thinkingBuffer = ""
				}
		}
	})

	es.addEventListener("done", (event) => {
		const data = JSON.parse(event.data)
		console.log(`done data: ${JSON.stringify(data)}`)

		const now = new Date()

		const newMessage: ChatMessageType = {
			sender: "AI",
			message: data,
			number: messageNumber,
			sentTimestamp: new Intl.DateTimeFormat("en-US", {
				timeZone: "America/New_York",
				hour: "numeric",
				minute: "2-digit"
			}).format(now)
		}
		replaceLastThinkingMessage(newMessage)

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
