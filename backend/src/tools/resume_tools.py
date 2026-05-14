from src.models import ToolResult, SkillSection
from typing import List, Tuple, Optional

async def start_resume_prewrap(job_service, tex_service, name, contacts, summary):
    result = tex_service.resume_start(name=name, contacts=contacts, summary=summary)

    tool_result = ToolResult(
        tool_name="start_resume",
        inputs={
            "name": name,
            "contacts": contacts,
            "summary": summary
        },
        outputs={"result": result}
    )

    await job_service.publish(job_service.job_id, "resumebot_tool_result", tool_result.model_dump())
    return result

async def add_experience_to_resume_prewrap(job_service, tex_service, title, dates, role, location, bullets):
    result = tex_service.resume_add_experience(title, dates, role, location, bullets)

    tool_result = ToolResult(
        tool_name="add_experience_to_resume",
        inputs={
            "title": title,
            "dates": dates,
            "role": role,
            "location": location,
            "bullets": bullets
        },
        outputs={"result": result}
    )

    await job_service.publish(job_service.job_id, "resumebot_tool_result", tool_result.model_dump())
    return result

async def add_education_to_resume_prewrap(job_service, tex_service, school: str, dates: Tuple[str, str], degree: str, location: str):
    result = tex_service.resume_add_education(tex_service, school, dates, degree, location)

    tool_result = ToolResult(
        tool_name="add_education_to_resume",
        inputs={
            "school": school,
            "dates": dates,
            "degree": degree,
            "location": location,
        },
        outputs={"result": result}
    )

    await job_service.publish(job_service.job_id, "resumebot_tool_result", tool_result.model_dump())
    return result

async def add_skills_to_resume_prewrap(job_service, tex_service, sections: List[SkillSection]):
    result = tex_service.resume_add_education(tex_service, sections)

    tool_result = ToolResult(
        tool_name="add_skills_to_resume",
        inputs={
            "sections": sections
        },
        outputs={"result": result}
    )

    await job_service.publish(job_service.job_id, "resumebot_tool_result", tool_result.model_dump())
    return result

async def end_resume_prewrap(job_service, tex_service):
    result = tex_service.resume_end()

    tool_result = ToolResult(
        tool_name="end_resume",
        inputs={"output_path": tex_service.output_path},
        outputs={"result": result, "output_path": tex_service.output_path}
    )

    await job_service.publish(job_service.job_id, "end_resumebot", tool_result.model_dump())
    return result
