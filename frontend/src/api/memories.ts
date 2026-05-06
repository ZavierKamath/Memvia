import type { MemoryType } from "../context/MemoryContext.tsx"

export async function getMemories() {
	const res = await fetch("http://localhost:8000/memories", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
	})

	if (!res.ok) {
		console.log('res is not okay')
	}

	const { memories }: { memories: MemoryType[] } = await res.json()
	return memories
}

export async function createMemory(memory: MemoryType) {
	const res = await fetch("http://localhost:8000/memories/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({...memory})
	})

	if (!res.ok) {
		console.log('res is not okay')
	}

	const { confirmation }: { confirmation: string } = await res.json()
	return confirmation
}

export async function deleteMemory(mem_id: string) {
	const res = await fetch("http://localhost:8000/memories/delete", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			mem_id: mem_id
		})
	})

	if (!res.ok) {
		console.log('res is not okay')
	}

	const { confirmation }: { confirmation: string } = await res.json()
	return confirmation
}
