from src.models import ToolResult

async def kb_search_prewrap(mem_service, job_service, query: str, k: int):
    """
    Tool for searching through the user's knowledgebase of memories based on a query that is semantically similar to the relevant memories.

    Args:
        query: the phrase that can be used to find memories that are semantically similar
        k: the number of top results to find
    """

    print(f"Calling retrieve with query: {query} looking for {k} results")
    rows = mem_service.retrieve(query, k)
    print(f"Retrieve returned {len(rows)} results")

    result = "# KB Search Results\n\n"
    for i, row in enumerate(rows):
        result += f"## Result {i + 1}\n"
        result += f"**Memory Title: {row['title']}**\n"
        result += f"_Memory Kind: {row['kind']}_\n"
        result += f"Memory Content: \n\n{row['content']}\n\n"

    tool_result = ToolResult(
        tool_name="kb_search",
        inputs={"query": query, "k": k},
        outputs={"result": result}
    )
    await job_service.publish(job_service.job_id, "tool_result", tool_result.model_dump( ))
    return result

