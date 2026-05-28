from pydantic_ai import Tool

from src.agents.pipedagent import PipedAgent
from src.prompts import RESUMEBOT_SYSTEM_PROMPT
from src.services.tex_service import TexService
from src.services.mem_service import MemoryService
from src.tools.resume_tools import *
from src.tools.kb_search import kb_search_prewrap
from src.models import Dates, Contact

class ResumeBot(PipedAgent):
    def __init__(self, job_service, mem_service, model):
        tex_service = TexService(job_service.job_id)

        async def resume_start_tool(name: str, contacts: List[Contact], summary: Optional[str] = None):
            return await start_resume_prewrap(job_service, tex_service, name, contacts, summary)

        start_resume = Tool(
            resume_start_tool,
            name="start_resume",
            description="Starts a resume for the given person with a name with the given contact links (Tuple[str, str] where the first string is the display and the second string is the link) and high level summary that cannot be more than 1 sentence.",
        )

        async def resume_add_experience_tool(title: str, dates: str, role: str, location: str, bullets: List[str]):
            return await add_experience_to_resume_prewrap(job_service, tex_service, title, dates, role, location, bullets)

        add_experience = Tool(
            resume_add_experience_tool,
            name="add_experience",
            description="Tool to add an experience to a resume. Make sure to only add experiences one after the other with no skills or education inbetween.",
        )

        async def resume_add_education_tool(school: str, dates: str, degree: str, location: str, bullets: List[str]):
            return await add_education_to_resume_prewrap(job_service, tex_service, school, dates, degree, location, bullets)

        add_education = Tool(
            resume_add_education_tool,
            name="add_education",
            description="Tool to add education to a resume. Make sure to only add educations one after the other with no skills or experiences inbetween.",
        )

        async def resume_add_skills_tool(sections: List[SkillSection]):
            return await add_skills_to_resume_prewrap(job_service, tex_service, sections)

        add_skills = Tool(
            resume_add_skills_tool,
            name="add_skills",
            description="Tool to add skills to a resume. Make sure to only add skills one after the other with no educations or experiences inbetween.",
        )

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

        async def resume_end_tool():
            return await end_resume_prewrap(job_service, tex_service)

        end_resume = Tool(
            resume_end_tool,
            name="end_resume",
            description="Tool for ending a resume and getting the file path of the outputted pdf. MUST BE USED WHENEVER YOU START A RESUME."
        )


        super().__init__(
            agent_name="resumebot",
            description="Secondary AI for Memvia: a service that gives a user the ability to manage and chat with memories, particularly in the realm of maintaining knowledge of their professional life for the sake of job hunting applicatons. This agent is a subagent for MemBot, the primary AI Memvia who interacts directly with the user. ResumeBot is invoked to create a resume for the user with using predefined tools that take advantage of LaTeX to get the formatting just right.",
            system_prompt=RESUMEBOT_SYSTEM_PROMPT,
            session=job_service.job_id,
            tools=[start_resume, add_experience, add_education, add_skills, end_resume, kb_search],
            model_id=model
        )

