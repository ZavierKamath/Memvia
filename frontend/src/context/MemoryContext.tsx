import { createContext, useState } from "react";
import type { ReactNode } from "react";
import { getMemories, createMemory, deleteMemory } from "../api/memories.ts";

export type MemoryKind = "experience" | "skills" | "education" | "project" | "other"

export type MemoryType = {
	mem_id: string
	kind: MemoryKind
    title: string
    content: string
	embedding: null | number[]
}

type MemoryContextType = {
	memories: MemoryType[];
	deleteMemoryCTX: (mem_id: string) => Promise<void>;
	addMemoryCTX: (memory: MemoryType) => Promise<void>;
	getMemoriesCTX: () => Promise<MemoryType[]>;
}

export const MemoryContext = createContext<MemoryContextType | null>(null)

export function MemoryProvider({ children }: { children: ReactNode }) {
	const [memories, setMemories] = useState<MemoryType[]>([]);

	async function addMemoryCTX(memory: MemoryType) {
		await createMemory(memory)
		const memories: MemoryType[] = await getMemories()
		setMemories(memories);
	}

	async function deleteMemoryCTX(mem_id: string) {
		await deleteMemory(mem_id)
		const memories: MemoryType[] = await getMemories()
		setMemories(memories)
	}

	async function getMemoriesCTX() {
		const memories: MemoryType[] = await getMemories()
		setMemories(memories)
		return memories
	}

	return (
		<MemoryContext.Provider value={{ memories, deleteMemoryCTX, addMemoryCTX, getMemoriesCTX }}>
			{children}
		</MemoryContext.Provider>
	)
}
