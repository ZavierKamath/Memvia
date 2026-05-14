from src.agents.resumebot import ResumeBot
from src.models import ToolResult

async def spawn_resumebot_prewrap(job_service, instructions: str):
    resumebot = ResumeBot(job_service)

    await job_service.publish(job_service.job_id, "start_resumebot", {"instructions": instructions})

    async def publish_agent_event(event: dict):
        await job_service.publish(job_service.job_id, "agent", event)

    result = await resumebot.ask(instructions, publish=publish_agent_event)

    tool_result = ToolResult(
        tool_name="spawn_resumebot",
        inputs={"instructions": instructions},
        outputs={"result": result.output}
    )
    await job_service.publish(job_service.job_id, "tool_result", tool_result.model_dump( ))

    return result
