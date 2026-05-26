import { useState } from "react"
import type { MemoryType } from '../../context/MemoryContext'
import { AddMemoryForm } from "./AddMemoryForm"
import { Pencil, Trash2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function MemoryCard(
	{ memory, deleteMemoryFunction, addMemoryFunction }:
	{
		memory: MemoryType,
		deleteMemoryFunction: (mem_id: string) => Promise<void>
		addMemoryFunction: (memory: MemoryType) => void
	}) {

	const [editing, setEditing] = useState(false)

	function toggleEditing() {
		setEditing(editing ? false : true)
	}

	function conditionalMemoryContent() {
		const contentCutoff: number = 380;
		const contentClass = "text-text-muted text-sm [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1"
		if (memory.content.length > contentCutoff - 3) {
			const cleaned = `${memory.content.slice(0, contentCutoff)}...`
			return (
				<div className={contentClass}>
					<ReactMarkdown remarkPlugins={[remarkGfm]}>
						{cleaned}
					</ReactMarkdown>
				</div>
			)
		} else {
			return (
				<div className={contentClass}>
					<ReactMarkdown remarkPlugins={[remarkGfm]}>
						{memory.content}
					</ReactMarkdown>
				</div>
			)
		}
	}

	function conditionalRenderEditMode() {
		if (!editing) {
			return (
				<div className="flex flex-col gap-2 px-6 py-3 rounded-xl bg-bg-light shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)]">
					<div className="flex justify-between items-center gap-8">
						<h4 className="text-text text-sm">{memory.kind}</h4>
						<div className="flex gap-4">
							<button
								className="text-warning font-semibold hover:text-text hover:-motion-translate-y-loop-[10%] hover:motion-duration-700"
								onClick={() => toggleEditing()}
							>
								<Pencil size={16}/>
							</button>
							<button
								className="text-danger font-semibold hover:text-text hover:-motion-translate-y-loop-[10%] hover:motion-duration-700"
								onClick={() => deleteMemoryFunction(memory.mem_id)}
							>
								<Trash2 size={16}/>
							</button>
						</div>
					</div>
					<h3 className="text-text font-semibold mt-2">{memory.title}</h3>
					{conditionalMemoryContent()}
				</div>
			)
		} else {
			return (
				<>
				<AddMemoryForm
					initKind={memory.kind}
					initMemId={memory.mem_id}
					initTitle={memory.title}
					initContent={memory.content}
					isEdit={true}
					setEditing={setEditing}
				/>
				</>
			)
		}
	}

	return (
		<div className="memory-card-container">
			{conditionalRenderEditMode()}
		</div>
	)
}
