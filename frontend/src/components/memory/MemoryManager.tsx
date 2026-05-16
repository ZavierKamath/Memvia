import { useEffect } from "react"
import { useMemories } from '../../hooks/useMemories'
import { AddMemoryForm } from "./AddMemoryForm";
import { MemoryCard } from "./MemoryCard";

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
