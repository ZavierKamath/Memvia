from __future__ import annotations
from dataclasses import dataclass

from enum import Enum
from typing import Any, Optional, Dict

from pydantic import BaseModel, Field

class StartJobRequest(BaseModel):
    question: str
    sessionId: str
    messageNumber: int


class MemoryKind(str, Enum):
    experience = "experience"
    skills = "skills"
    education = "education"
    project = "project"
    other = "other"


class Memory(BaseModel):
    mem_id: str
    kind: MemoryKind
    title: str
    content: str
    embedding: Optional[list[float]] = None


class MemoryRetrievalResult(BaseModel):
    kind: str
    title: str
    content: str
    relevance: float


class DeleteMemoryRequest(BaseModel):
    mem_id: str


class ToolResult(BaseModel):
    tool_name: str
    inputs: Dict[str, Any]
    outputs: Dict[str, Any]
