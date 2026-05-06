from src.services.mem_service import MemoryService

def kb_search(query: str, k: int):
    """
    Tool for searching through the user's knowledgebase of memories based on a query that is semantically similar to the relevant memories.

    Args:
        query: the phrase that can be used to find memories that are semantically similar
        k: the number of top results to find
    """
    mem_service = MemoryService()

    print(f"Calling retrieve with query: {query} looking for {k} results")
    rows = mem_service.retrieve(query, k)
    print(f"Retrieve returned {len(rows)} results")

    result = "# KB Search Results\n\n"
    for i, row in enumerate(rows):
        result += f"## Result {i}\n"
        result += f"**Memory Title: {row['title']}**\n"
        result += f"_Memory Kind: {row['kind']}_\n"
        result += f"Memory Content: \n\n{row['content']}\n\n"

    return result

