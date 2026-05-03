from pydantic_ai.common_tools.duckduckgo import duckduckgo_search_tool
from src.agents.pipedagent import PipedAgent
from src.prompts import RESUMEBOT_SYSTEM_PROMPT

class ResumeBot(PipedAgent):
    def __init__(self, job_id):
        super().__init__(
            agent_name="resumebot",
            description="Secondary AI for Memvia: a service that gives a user the ability to manage and chat with memories, particularly in the realm of maintaining knowledge of their professional life for the sake of job hunting applicatons. This agent is a subagent for MemBot, the primary AI Memvia who interacts directly with the user. ResumeBot is invoked to create a resume for the user with using predefined tools that take advantage of LaTeX to get the formatting just right.",
            system_prompt=RESUMEBOT_SYSTEM_PROMPT,
            session=job_id,
            tools=[],
        )

