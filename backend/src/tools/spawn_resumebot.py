from src.agents.resumebot import ResumeBot
from src.services.job_service import JobService

def spawn_resumebot_serviceless(job_service: JobService, instructions: str):
    job_id = job_service.job_id
    resumebot = ResumeBot(job_id)

    async def publish_agent_event(event: dict):
        await job_service.publish(job_id, "agent", event)

    result = resumebot.ask(instructions, publish=publish_agent_event)
    return result
