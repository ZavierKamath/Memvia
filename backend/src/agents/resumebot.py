from pydantic_ai import Tool

from src.agents.pipedagent import PipedAgent
from src.prompts import RESUMEBOT_SYSTEM_PROMPT
from src.services.tex_service import TexService
from src.tools.resume_tools import *

class ResumeBot(PipedAgent):
    def __init__(self, job_service):
        tex_service = TexService(job_service.job_id)

        async def resume_start_tool(name: str, contacts: List[Tuple[str, str]], summary: Optional[str] = None):
            """
            Tool for initializing a new resume document. 

            Args:
                name: the owner of the resume's name
                contacts: a list of tuples where the first element is the display text of the contact and the second element is the link of the text
                summary: high level resume summary that cannot be more than 1 sentence
            """
            return await start_resume_prewrap(job_service, tex_service, name, contacts, summary)

        start_resume = Tool(
            resume_start_tool,
            name="start_resume",
            description="Starts a resume for the given person with a name with the given contact links (Tuple[str, str] where the first string is the display and the second string is the link) and high level summary that cannot be more than 1 sentence.",
        )

        async def resume_add_experience_tool(title: str, dates: Tuple[str, str], role: str, location: str, bullets: List[str]):
            """
            Tool for adding an experience to the experience section of an already initialized resume

            Args:
                title: the title of the experience
                dates: date range of the experience (a tuple of 2 strings). Dates must be formatted like 'May 2025' for example. second string can be 'Present'
                role: the role of the person during this experience
                location: the location of the experience. can be 'Remote'
                bullets: a list of strings where each string is a bullet point that describes the experience in X Y Z format
            """
            return await add_experience_to_resume_prewrap(job_service, tex_service, title, dates, role, location, bullets)

        add_experience = Tool(
            resume_add_experience_tool,
            name="add_experience",
            description="Tool to add an experience to a resume. Make sure to only add experiences one after the other with no skills or education inbetween.",
        )

        async def resume_add_education_tool(school: str, dates: Tuple[str, str], degree: str, location: str):
            """
            Tool adding an education to the education secton of an already initialized resume

            Args:
                school: the title of the experience
                dates: date range of the educaton (a tuple of 2 strings). Dates must be formatted like 'May 2025' for example. second string can be 'Present'
                degree: name of the degree
                location: the location of the education. can be 'Remote'
            """
            return await add_education_to_resume_prewrap(job_service, tex_service, school, dates, degree, location)

        add_education = Tool(
            resume_add_education_tool,
            name="add_education",
            description="Tool to add education to a resume. Make sure to only add educations one after the other with no skills or experiences inbetween.",
        )

        async def resume_add_skills_tool(job_service, tex_service, sections: List[SkillSection]):
            """
            Tool for adding an skills to the skills secton of an already initialized resume

            Args:
                sections: a list of SkillSections which are objects that each have a section name (group name of the section of skills) and section elements which are a list of strings (each representing a skill that is associated with the skill group)
            """
            return await add_skills_to_resume_prewrap(job_service, tex_service, sections)

        add_skills = Tool(
            resume_add_skills_tool,
            name="add_skills",
            description="Tool to add skills to a resume. Make sure to only add skills one after the other with no educations or experiences inbetween.",
        )

        async def resume_end_tool(job_service, tex_service):
            """
            Tool for ending and compiling a resume and producing a PDF

            Args:
                N/A
            """
            return await end_resume_prewrap(job_service, tex_service)

        end_resume = Tool(
            resume_end_tool,
            name="end_resume",
            description="Tool for ending a resume and getting the file path of the outputted pdf."
        )


        super().__init__(
            agent_name="resumebot",
            description="Secondary AI for Memvia: a service that gives a user the ability to manage and chat with memories, particularly in the realm of maintaining knowledge of their professional life for the sake of job hunting applicatons. This agent is a subagent for MemBot, the primary AI Memvia who interacts directly with the user. ResumeBot is invoked to create a resume for the user with using predefined tools that take advantage of LaTeX to get the formatting just right.",
            system_prompt=RESUMEBOT_SYSTEM_PROMPT,
            session=job_service.job_id,
            tools=[start_resume, add_experience, add_education, add_skills, end_resume],
        )

