import asyncio
from uuid import uuid4
import json
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from src.models import StartJobRequest
from src.agents.membot import MemBot

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

job_queues = {}

async def get_queue(job_id: str) -> asyncio.Queue:
    if job_id not in job_queues:
        job_queues[job_id] = asyncio.Queue()
    return job_queues[job_id]

async def publish(job_id: str, event_type: str, data: dict):
    queue = await get_queue(job_id)
    await queue.put({
        "type": event_type,
        "data": data
    })

async def run_job(job_id: str, question: str):
    await publish(job_id, "status", {"message": "Job Started"})

    async def publish_agent_event(event: dict):
        await publish(job_id, "agent", event)

    # membot = MemBot(job_id) 
    # result = await membot.ask(question, publish=publish_agent_event)
    for i in range(5):
        await publish(job_id, "progress", {"message": f"test{i}"})

    await publish(job_id, "done", {"message": "Job Finished", "output": "test output"})

async def sse_event_generator(job_id: str):
    queue = await get_queue(job_id)

    while True:
        event = await queue.get()
        yield f"event: {event['type']}\n"
        yield f"data: {json.dumps(event['data'])}\n\n"

        if event["type"] in ("done", "error"):
            print("done status found, finishing")
            break

    job_queues.pop(job_id, None)

@app.get("/jobs/{job_id}/stream")
async def stream_job(job_id: str):
    print(f"Streaming job for job_id: {job_id}")
    return StreamingResponse(
        sse_event_generator(job_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )

@app.post("/jobs")
async def start_job(payload: StartJobRequest):
    print(f"Starting job")
    job_id = str(uuid4())
    print(f"Created job with id: {job_id}")
    await get_queue(job_id)
    asyncio.create_task(run_job(job_id, payload.question))
    return {"job_id": job_id}
