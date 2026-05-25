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
		return initContent ?
			"flex flex-col gap-4 px-6 py-6 border-none rounded-xl bg-bg-light w-[24rem] shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)]" :
			"flex flex-col gap-4 px-6 py-6 border-2 border-border rounded-xl bg-bg-dark w-[27rem] shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)]"
	}

	return (
		<form id="add-memory-form" className={conditionalClass()} onSubmit={handleSubmit}>
			<h2 className="text-text px-1 py-[0.5] border-b-2 border-secondary text-lg font-semibold mr-auto ml-2">Add Memory</h2>
			<select value={kind} onChange={(e) => setKind(e.target.value as MemoryKind)} name="kind"
				className="text-text text-sm bg-bg-light px-2 py-2 rounded-xl border-2 border-border-muted focus:outline-none focus:border-primary focus:border-2 focus:ring-primary/10 hover:border-primary "
			>
				<option value="experience">Experience</option>
				<option value="skills">Skills</option>
				<option value="education">Education</option>
				<option value="project">Project</option>
				<option value="other">Other</option>
			</select>
			<textarea
				ref={titleRef}
				onInput={resizeTitle}
				onKeyDown={handleKeyDown}
				value={title}
				onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTitle(e.target.value)}
				rows={1}
				placeholder="Add memory title..."
				className="border-2 border-border-muted px-2 py-1 rounded-xl text-text font-semibold bg-bg-light focus:outline-none focus:border-primary focus:border-2 focus:ring-primary/10 hover:border-primary"
			/>
			<textarea
				ref={contentRef}
				onInput={resizeContent}
				onKeyDown={handleKeyDown}
				value={content}
				onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
				rows={1}
				placeholder="Add memory content..."
				className={`border-2 border-border-muted bg-bg-light px-2 py-1 rounded-xl text-sm text-text-muted focus:outline-none focus:border-primary focus:border-2 focus:ring-primary/10 hover:border-primary ${initContent ? "min-h-[10rem] max-h-[15rem]" : "min-h-[20rem] max-h-[30-rem]"}`}
			/>
			<button
				type="submit"
				className="text-text-muted border-2 border-border-muted rounded-xl bg-bg-light py-2 hover:text-text hover:border-primary"
			>Submit</button>
		</form>
	)
}
