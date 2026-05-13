import asyncio
from typing import Any
import json

from src.agents.membot import MemBot
from src.services.mem_service import MemoryService

class JobService():
    job_queues: dict[str, asyncio.Queue] = {}
    def __init__(self, job_id, mem_service: MemoryService):
        self.job_id = job_id
        self.mem_service = mem_service

    async def get_queue(self, job_id: str) -> asyncio.Queue:
        if job_id not in self.job_queues:
            self.job_queues[job_id] = asyncio.Queue()
        return self.job_queues[job_id]

    async def publish(self, job_id: str, event_type: str, data: Any):
        queue = await self.get_queue(job_id)
        await queue.put({
            "type": event_type,
            "data": data
        })

    async def run_job(self, job_id: str, question: str, message_number: int):
        await self.publish(job_id, "status", {"message": "Job Started"})

        async def publish_agent_event(event: dict):
            await self.publish(job_id, "agent", event)

        membot = MemBot(job_id, self, self.mem_service) 
        result = await membot.ask(question, publish=publish_agent_event)

        await self.publish(job_id, "done", result.output)

    async def sse_event_generator(self, job_id: str):
        queue = await self.get_queue(job_id)

        while True:
            event = await queue.get()
            yield f"event: {event['type']}\n"
            yield f"data: {json.dumps(event['data'])}\n\n"

            if event["type"] in ("done", "error"):
                print("done status found, finishing")
                break

        self.job_queues.pop(job_id, None)
