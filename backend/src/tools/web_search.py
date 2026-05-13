from pydantic_ai.common_tools.duckduckgo import DuckDuckGoSearchTool
from ddgs import DDGS
from src.models import ToolResult

async def web_search_prewrap(query: str, max_results: int, mem_service, job_service):
    ddg = DuckDuckGoSearchTool(client=DDGS(), max_results=max_results)
    result = await ddg(query)
    print(f"Calling retrieve with query: {query} looking for {max_results} results")

    tool_result = ToolResult(
        tool_name="web_search",
        inputs={"query": query, "max_results": max_results},
        outputs={"result": result}
    )
    await job_service.publish(job_service.job_id, "tool_result", tool_result.model_dump( ))
    return result

