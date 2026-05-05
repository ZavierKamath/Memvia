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
from src.services.job_service import JobService

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/jobs/{job_id}/stream")
async def stream_job(job_id: str):
    print(f"Streaming job for job_id: {job_id}")
    job_service = JobService(job_id)
    return StreamingResponse(
        job_service.sse_event_generator(job_id),
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
    else:
        print(f"Using existing job id: {payload.sessionId}")
        job_id = payload.sessionId

    job_service = JobService(job_id)
    await job_service.get_queue(job_id)
    message_number = payload.messageNumber + 1

    asyncio.create_task(job_service.run_job(job_id, payload.question, message_number))
    return {"job_id": job_id, "message_number": message_number}
