from src.agents.pipedagent import PipedAgent
from src.prompts import MEMBOT_SYSTEM_PROMPT
# from src.tools.spawn_resumebot import spawn_resumebot_serviceless
from src.tools.kb_search import kb_search as kb_search_prewrap

from pydantic_ai.common_tools.duckduckgo import duckduckgo_search_tool
from pydantic_ai import Tool

class MemBot(PipedAgent):
    def __init__(self, job_id):
        # async def spawn_resumebot_nowrap(instructions: str):
        #     await spawn_resumebot_serviceless(job_service=JobService(job_id), instructions=instructions)
        #
        # spawn_resumebot = Tool(
        #     spawn_resumebot_nowrap,
        #     name="spawn_resumebot",
        #     description="Spawns ResumeBot with the detailed instructions that are given as input. ResumeBot will respond in natural language.",
        # )

        kb_search = Tool(
            kb_search_prewrap,
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

