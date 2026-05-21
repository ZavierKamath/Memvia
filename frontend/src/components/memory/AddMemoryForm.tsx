import { useState, useRef } from "react"
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
	const [title, setTitle] = useState<string>(initTitle)
	const [kind, setKind] = useState<MemoryKind>(initKind)
	const [content, setContent] = useState<string>(initContent)

	const titleRef = useRef<HTMLTextAreaElement>(null)
	const contentRef = useRef<HTMLTextAreaElement>(null)

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const memory: MemoryType = {
			mem_id: initMemId,
			kind: kind,
			title: title,
			content: content,
			embedding: null
		}
		if (isEdit) {
			memoryContext.deleteMemoryCTX(memory.mem_id)
		}
		memoryContext.addMemoryCTX(memory)
		setTitle("")
		setKind("other")
		setContent("")
		if (isEdit) {
			setEditing(false)
		}
	}


	function resizeTitle() {
		const el = titleRef.current
		if (!el) return

		el.style.height = "auto"
		el.style.height = `${Math.min(el.scrollHeight,75)}px`
	}

	function resizeContent() {
		const el = contentRef.current
		if (!el) return

		el.style.height = "auto"
		el.style.height = `${Math.min(el.scrollHeight,75)}px`
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault()
		}	
	}

	function conditionalClass() {
		return initContent ? "last" : "first"
	}

	return (
		<form id="add-memory-form" className={conditionalClass()} onSubmit={handleSubmit}>
			<textarea
				ref={titleRef}
				onInput={resizeTitle}
				onKeyDown={handleKeyDown}
				value={title}
				onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTitle(e.target.value)}
				rows={1}
				placeholder="Add memory title..."
				className="form-title"
			/>
			<select value={kind} onChange={(e) => setKind(e.target.value as MemoryKind)} name="kind">
				<option value="experience">Experience</option>
				<option value="skills">Skills</option>
				<option value="education">Education</option>
				<option value="project">Project</option>
				<option value="other">Other</option>
			</select>
			<textarea
				ref={contentRef}
				onInput={resizeContent}
				onKeyDown={handleKeyDown}
				value={content}
				onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
				rows={1}
				placeholder="Add memory content..."
				className="form-content"
			/>
			<button type="submit">Submit</button>
		</form>
	)
}
