import { useState } from "react"
import type { MemoryType } from '../../context/MemoryContext'
import { AddMemoryForm } from "./AddMemoryForm"
import { Pencil, Trash2 } from "lucide-react"

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
		const contentClass = "text-text-muted text-sm"
		if (memory.content.length > contentCutoff - 3) {
			return <p className={contentClass}>{memory.content.slice(0, contentCutoff)}...</p>
		} else {
			return <p className={contentClass}>{memory.content}</p>
		}
	}

	function conditionalRenderEditMode() {
		if (!editing) {
			return (
				<div className="flex flex-col gap-2 px-6 py-3 rounded-xl bg-bg-light">
					<div className="flex justify-between items-center gap-8">
						<h4 className="text-text text-sm">{memory.kind}</h4>
						<div className="flex gap-4">
							<button
								className="text-warning font-semibold hover:text-text"
								onClick={() => toggleEditing()}
							>
								<Pencil size={16}/>
							</button>
							<button
								className="text-danger font-semibold hover:text-text"
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
