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

async def publish(job_id: str, event_type: str, data: dict | str):
    queue = await get_queue(job_id)
    await queue.put({
        "type": event_type,
        "data": data
    })

async def run_job(job_id: str, question: str, message_number):
    await publish(job_id, "status", {"message": "Job Started"})

    async def publish_agent_event(event: dict):
        await publish(job_id, "agent", event)

    membot = MemBot(job_id) 
    result = await membot.ask(question, publish=publish_agent_event)

    await publish(
        job_id, "done", result.output
        # {
        #     "message": "Job Finished",
        #     "messageNumber": message_number,
        #     "output": result.output,
        #     "timestamp": datetime.now(timezone.utc).isoformat()
        # }
    )

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

@app.post("/jobs/invoke")
async def start_job(payload: StartJobRequest):
    print(f"Starting job")

    if payload.sessionId == "START":
        job_id = str(uuid4())
        print(f"Created job with id: {job_id}")
        await get_queue(job_id)
    else:
        print(f"Using existing job id: {payload.sessionId}")
        job_id = payload.sessionId

    message_number = payload.messageNumber + 1

    asyncio.create_task(run_job(job_id, payload.question, message_number))
    return {"job_id": job_id, "message_number": message_number}
