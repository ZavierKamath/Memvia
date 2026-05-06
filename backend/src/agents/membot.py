from src.agents.pipedagent import PipedAgent
from src.prompts import MEMBOT_SYSTEM_PROMPT
# from src.tools.spawn_resumebot import spawn_resumebot_serviceless
from src.tools.kb_search import kb_search as kb_search_prewrap

from pydantic_ai.common_tools.duckduckgo import duckduckgo_search_tool
from pydantic_ai import Tool

class MemBot(PipedAgent):
    def __init__(self, job_id, job_service, mem_service):
        # async def spawn_resumebot_nowrap(instructions: str):
        #     await spawn_resumebot_serviceless(job_service=JobService(job_id), instructions=instructions)
        #
        # spawn_resumebot = Tool(
        #     spawn_resumebot_nowrap,
        #     name="spawn_resumebot",
        #     description="Spawns ResumeBot with the detailed instructions that are given as input. ResumeBot will respond in natural language.",
        # )
        async def kb_search_tool(query: str, k: int):
            """
            Tool for searching through the user's knowledgebase of memories based on a query that is semantically similar to the relevant memories.

            Args:
                query: the phrase that can be used to find memories that are semantically similar
                k: the number of top results to find
            """
            return await kb_search_prewrap(mem_service, job_service, query, k)

        kb_search = Tool(
            kb_search_tool,
            name="kb_search",
            description="Searches the knowledgebase of memories for memories that are semantically similar to a query. Returns the top k most relevant results.",
        )

        super().__init__(
            agent_name="membot",
            description="Primary Chatbot for Memvia: a service that gives a user the ability to manage and chat with memories, particularly in the realm of maintaining knowledge of their professional life for the sake of job hunting applicatons.",
            system_prompt=MEMBOT_SYSTEM_PROMPT,
            session=job_id,
            tools=[
                duckduckgo_search_tool(max_results=5),
                kb_search,
                # spawn_resumebot,
            ],
        )

