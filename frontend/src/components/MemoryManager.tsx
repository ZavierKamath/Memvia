import { useState, useEffect } from "react"
import { useMemories } from '../hooks/useMemories'
import type { MemoryKind, MemoryType } from '../context/MemoryContext'
function MemoryCard({ memory, deleteMemoryFunction }: { memory: MemoryType, deleteMemoryFunction: (mem_id: string) => Promise<void> }) {
	return (
		<>
			<h3>{memory.title}</h3>
			<p>{memory.kind}</p>
			<p>{memory.content}</p>
			<button onClick={() => deleteMemoryFunction(memory.mem_id)}>delete</button>
		</>
	)
}

function AddMemoryForm() {
	const memoryContext = useMemories();
	const [title, setTitle] = useState("")
	const [kind, setKind] = useState<MemoryKind>("other")
	const [content, setContent] = useState("")

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const mem_id = crypto.randomUUID()
		const memory: MemoryType = {
			mem_id: mem_id,
			kind: kind,
			title: title,
			content: content,
			embedding: null
		}
		memoryContext.addMemoryCTX(memory)
		setTitle("")
		setKind("other")
		setContent("")
	}

	return (
		<form id="add-memory-form" onSubmit={handleSubmit}>
			<input
				type="text"
				name="title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Title"
			/>
			<select value={kind} onChange={(e) => setKind(e.target.value as MemoryKind)} name="kind">
				<option value="experience">Experience</option>
				<option value="skills">Skills</option>
				<option value="education">Education</option>
				<option value="project">Project</option>
				<option value="other">Other</option>
			</select>
			<input
				type="text"
				name="content"
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Content"
			/>
			<button type="submit">Submit</button>
		</form>
	)
}

export function MemoryManager() {
	const memoryContext = useMemories();

	useEffect(() => {
		async function fetchMemories() {
			await memoryContext.getMemoriesCTX()
		}	

		fetchMemories()
	}, [])

	return (
		<>
			<h1>Memories</h1>
			<AddMemoryForm />
			{memoryContext.memories.map((memory) => (
				<MemoryCard key={memory.mem_id} memory={memory} deleteMemoryFunction={memoryContext.deleteMemoryCTX} />
			))}
		</>
	)
}
