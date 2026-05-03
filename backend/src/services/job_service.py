import asyncio
import json

# from src.agents.membot import MemBot

class JobService():
    def __init__(self, job_id):
        self.job_queues = {}
        self.job_id = job_id

    async def get_queue(self, job_id: str) -> asyncio.Queue:
        if job_id not in self.job_queues:
            self.job_queues[job_id] = asyncio.Queue()
        return self.job_queues[job_id]

    async def publish(self, job_id: str, event_type: str, data: dict):
        queue = await self.get_queue(job_id)
        await queue.put({
            "type": event_type,
            "data": data
        })

    async def run_job(self, job_id: str, question: str):
        await self.publish(job_id, "status", {"message": "Job Started"})

        async def publish_agent_event(event: dict):
            await self.publish(job_id, "agent", event)

        # membot = MemBot(job_id) 
        # result = await membot.ask(question, publish=publish_agent_event)
        class tempResult():
            def __init__(self, output):
                self.output = output

        result = tempResult("test")

        await self.publish(job_id, "done", {"message": "Job Finished", "output": result.output})

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
