import { useEffect } from "react"
import { useMemories } from '../../hooks/useMemories'
import { AddMemoryForm } from "./AddMemoryForm"
import { MemoryCard } from "./MemoryCard"

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
			<div className="memory-manager-form-section">
				<h2>Add Memory</h2>
				<AddMemoryForm
					initKind="experience"
					initMemId={crypto.randomUUID().toString()}
					initTitle=""
					initContent=""
					isEdit={false}
					setEditing={null}
				/>
			</div>
			<div className="memory-manager-card-library-section">
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
		</div>
	)
}
