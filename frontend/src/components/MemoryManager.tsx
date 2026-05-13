import { useState, useEffect } from "react"
import { useMemories } from '../hooks/useMemories'
import type { MemoryKind, MemoryType } from '../context/MemoryContext'

function MemoryCard(
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

function AddMemoryForm(
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

export function MemoryManager() {
	const memoryContext = useMemories();

	useEffect(() => {
		async function fetchMemories() {
			await memoryContext.getMemoriesCTX()
		}	

		fetchMemories()
	}, [])

	return (
		<div className="memory-manager">
			<h1>Memories</h1>
			<h2>Add Memory</h2>
			<AddMemoryForm
				initKind="other"
				initMemId={crypto.randomUUID().toString()}
				initTitle="Title"
				initContent="Content"
				isEdit={false}
				setEditing={null}
			/>
			<h2>View Memories</h2>
			<div className="memory-card-library">
				{memoryContext.memories.map((memory) => (
					<MemoryCard
						key={memory.mem_id}
						memory={memory}
						deleteMemoryFunction={memoryContext.deleteMemoryCTX}
						addMemoryFunction={memoryContext.addMemoryCTX}
					/>
				))}
			</div>
		</div>
	)
}
