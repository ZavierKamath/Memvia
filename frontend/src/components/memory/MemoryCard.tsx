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

	function conditionalRenderEditMode() {
		if (!editing) {
			return (
				<>
					<header>
						<h3>{memory.title}</h3>
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
					</header>
					<h4>{memory.kind}</h4>
					<p>{memory.content}</p>
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
