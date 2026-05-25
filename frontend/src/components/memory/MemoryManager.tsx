import { useEffect, useState } from "react"
import { useMemories } from '../../hooks/useMemories'
import { AddMemoryForm } from "./AddMemoryForm"
import { MemoryCard } from "./MemoryCard"

export function MemoryManager() {
	const memoryContext = useMemories();
	const [mode, setMode] = useState<"view" | "add">("view")

	useEffect(() => {
		async function fetchMemories() {
			await memoryContext.getMemoriesCTX()
		}	

		fetchMemories()
	}, [])

	function toggleMode() {
		setMode(mode === "view" ? "add" : "view")
	}

	function conditionalRender() {
		if (mode === "view") {
			return (
				<div className="flex flex-col gap-6 px-6 py-6 bg-bg-dark border-2 border-border rounded-xl overflow-y-auto max-h-[calc(100vh-16rem)] scrollbar-hidden shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)]">
					<h2 className="text-text px-1 py-[0.5] border-b-2 border-secondary text-lg font-semibold mr-auto ml-2">Memories</h2>
					{memoryContext.memories.map((memory) => (
						<MemoryCard
							key={memory.mem_id}
							memory={memory}
							deleteMemoryFunction={memoryContext.deleteMemoryCTX}
							addMemoryFunction={memoryContext.addMemoryCTX}
						/>
					))}
				</div>
			)
		} else {
			return (
				<AddMemoryForm
					initKind="experience"
					initMemId={crypto.randomUUID().toString()}
					initTitle=""
					initContent=""
					isEdit={false}
					setEditing={null}
				/>
			)
		}
	}

	return (
		<div className="flex flex-col justify-center items-center gap-3">
			<button
				className="px-4 py-2 text-text-muted border-2 border-border bg-bg-dark hover:text-text hover:border-secondary rounded-xl shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.2)]"
				onClick={toggleMode}
			>
			{mode === "view" ? "Add Memory" : "View Memories"}
			</button>
			{conditionalRender()}
		</div>
	)
}
