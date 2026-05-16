import { useState } from "react"
import { useMemories } from '../../hooks/useMemories'
import type { MemoryKind, MemoryType } from '../../context/MemoryContext'

export function AddMemoryForm(
	{ initMemId, initTitle, initKind, initContent, isEdit, setEditing }:
	{
		initMemId: string,
		initTitle: string,
		initKind: MemoryKind,
		initContent: string,
		isEdit: boolean,
		setEditing: any
	}
) {
	const memoryContext = useMemories();
	const [title, setTitle] = useState(initTitle)
	const [kind, setKind] = useState<MemoryKind>(initKind)
	const [content, setContent] = useState(initContent)

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const memory: MemoryType = {
			mem_id: initMemId,
			kind: kind,
			title: title,
			content: content,
			embedding: null
		}
		memoryContext.deleteMemoryCTX(memory.mem_id)
		memoryContext.addMemoryCTX(memory)
		setTitle("")
		setKind("other")
		setContent("")
		if (isEdit) {
			setEditing(false)
		}
	}

	return (
		<form id="add-memory-form" onSubmit={handleSubmit}>
			<input
				type="text"
				name="title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder={initTitle}
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
