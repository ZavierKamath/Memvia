from src.models import ToolResult

async def publish_copybox_prewrap(job_service, copyable_text: str):
    await job_service.publish(job_service.job_id, "publish_copybox", {"copyable_text": copyable_text})

    tool_result = ToolResult(
        tool_name="publish_copybox",
        inputs={"copyable_text": copyable_text},
        outputs={"copyable_text": copyable_text}
    )
    await job_service.publish(job_service.job_id, "tool_result", tool_result.model_dump( ))

    return "Published your copyable_text to the copybox"
