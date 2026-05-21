import { useState } from "react"
import type { MemoryType } from '../../context/MemoryContext'
import { AddMemoryForm } from "./AddMemoryForm"

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
		if (memory.content.length > contentCutoff - 3) {
			return <p>{memory.content.slice(0, contentCutoff)}...</p>
		} else {
			return <p>{memory.content}</p>
		}
	}

	function conditionalRenderEditMode() {
		if (!editing) {
			return (
				<>
					<h4>{memory.kind}</h4>
					<div className="button-area">
						<button
							className="edit-button"
							onClick={() => toggleEditing()}
						>edit</button>
						<button
							className="delete-button"
							onClick={() => deleteMemoryFunction(memory.mem_id)}
						>delete</button>
					</div>
					<header>
						<h3>{memory.title}</h3>
					</header>
					{conditionalMemoryContent()}
				</>
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
