from pydantic_ai.common_tools.duckduckgo import duckduckgo_search_tool
from src.pipedagent import PipedAgent
from src.prompts import MEMBOT_SYSTEM_PROMPT

class MemBot(PipedAgent):
    def __init__(self, job_id):
        super().__init__(
            agent_name="membot",
            description="Primary Chatbot for Memvia: a service that gives a user the ability to manage and chat with memories, particularly in the realm of maintaining knowledge of their professional life for the sake of job hunting applicatons.",
            system_prompt=MEMBOT_SYSTEM_PROMPT,
            session=job_id,
            tools=[duckduckgo_search_tool(max_results=5)],
        )

