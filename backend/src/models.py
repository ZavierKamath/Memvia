from __future__ import annotations
from dataclasses import dataclass

from enum import Enum
from typing import Any, Optional

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
    id: str
    kind: MemoryKind
    title: str
    content: str
    embedding: Optional[list[float]]


class MemoryRetrievalResult(BaseModel):
    kind: str
    title: str
    content: str
    relevance: float


