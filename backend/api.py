import asyncio
from uuid import uuid4
import json
from contextlib import asynccontextmanager
from typing import List
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from src.models import StartJobRequest, Memory, DeleteMemoryRequest
from src.services.job_service import JobService
from src.services.mem_service import MemoryService

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.mem_service = MemoryService()
    app.state.mem_service.init_db()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/documents/{doc_string:path}")
async def get_document(doc_string):
    print("Fetching document")
    doc_path = Path(doc_string)
    return FileResponse(
        path=doc_path,
        media_type="application/pdf",
        filename="resume.pdf"
    )

@app.get("/memories")
async def get_memories():
    print("Fetching memories")
    memories: List[Memory] = app.state.mem_service.get_memories()
    print(f"Fetched {len(memories)} memories")
    return {"memories": memories}

@app.post("/memories/create")
async def create_memory(payload: Memory):
    print(f"Creating memory with payload: {str(payload)}")

    embedding: List[float] = app.state.mem_service.embed(payload.content)
    embedded_memory = Memory(
        mem_id=payload.mem_id,
        kind=payload.kind,
        title=payload.title,
        content=payload.content,
        embedding=embedding
    )

    confirmation: str = app.state.mem_service.create_memory(embedded_memory)
    print(confirmation)
    return {"confirmation": confirmation}

@app.delete("/memories/delete")
async def delete_memory(payload: DeleteMemoryRequest):
    print(f"Deleting memory with id: {payload.mem_id}")
    confirmation: str = app.state.mem_service.delete_memory(payload.mem_id)
    print(confirmation)
    return {"confirmation": confirmation}

@app.get("/jobs/{job_id}/stream")
async def stream_job(job_id: str):
    print(f"Streaming job for job_id: {job_id}")
    return StreamingResponse(
        app.state.job_service.sse_event_generator(job_id),
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

    app.state.job_service = JobService(job_id, app.state.mem_service)
    await app.state.job_service.get_queue(job_id)
    message_number = payload.messageNumber + 1

    asyncio.create_task(app.state.job_service.run_job(job_id, payload.question, message_number))
    return {"job_id": job_id, "message_number": message_number}
