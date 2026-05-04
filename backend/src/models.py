from __future__ import annotations
from dataclasses import dataclass

from enum import Enum
from typing import Any

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

