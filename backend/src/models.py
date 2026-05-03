from __future__ import annotations
from dataclasses import dataclass

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field

class StartJobRequest(BaseModel):
    question: str

class MemoryKind(str, Enum):
    experience = "experience"
    project = "project"
    skill = "skill"
    education = "education"
    summary = "summary"
    note = "note"


class MemoryUpsert(BaseModel):
    kind: MemoryKind = MemoryKind.experience
    title: str | None = Field(default=None, max_length=160)
    content: str = Field(min_length=1, max_length=12000)
    source: str = Field(default="manual", max_length=40)


class MemoryItem(BaseModel):
    id: str
    kind: MemoryKind
    title: str | None = None
    content: str
    source: str
    chunk_count: int
    created_at: str
    updated_at: str


class MemorySearchResult(BaseModel):
    memory_id: str
    kind: MemoryKind
    title: str | None = None
    memory_content: str
    chunk_content: str
    score: float


class ExperienceEntry(BaseModel):
    company: str
    role: str
    dates: str = ""
    location: str = ""
    bullets: list[str] = Field(default_factory=list)


class ResumeSection(str, Enum):
    experience = "experience"
    projects = "projects"
    education = "education"
    skills = "skills"


class EducationEntry(BaseModel):
    institution: str
    degree: str
    dates: str = ""
    location: str = ""
    gpa: str = ""
    honors: list[str] = Field(default_factory=list)
    coursework: list[str] = Field(default_factory=list)
    details: list[str] = Field(default_factory=list)


class ProjectEntry(BaseModel):
    name: str
    subtitle: str = ""
    dates: str = ""
    bullets: list[str] = Field(default_factory=list)


class SkillGroup(BaseModel):
    label: str
    values: list[str] = Field(default_factory=list)


class ResumeDraft(BaseModel):
    name: str = "Zavier Kamath"
    email: str = "zavierkamath@gmail.com"
    website: str = "https://www.zavier-kamath.com"
    linkedin: str = "https://www.linkedin.com/in/zavierkamath"
    github: str = "https://github.com/ZavierKamath"
    summary: str = ""
    section_order: list[ResumeSection] = Field(
        default_factory=lambda: [
            ResumeSection.experience,
            ResumeSection.projects,
            ResumeSection.education,
            ResumeSection.skills,
        ]
    )
    experiences: list[ExperienceEntry] = Field(default_factory=list)
    education: list[EducationEntry] = Field(default_factory=list)
    projects: list[ProjectEntry] = Field(default_factory=list)
    skill_groups: list[SkillGroup] = Field(default_factory=list)

    def has_content(self) -> bool:
        return bool(
            self.summary.strip()
            or self.experiences
            or self.education
            or self.projects
            or self.skill_groups
        )


class ChatMessage(BaseModel):
    id: str
    session_id: str
    role: str
    content: str
    created_at: str


class RunCreateRequest(BaseModel):
    session_id: str | None = None
    message: str = Field(min_length=1, max_length=12000)
    agent_model: str | None = None


class RunCreated(BaseModel):
    run_id: str
    session_id: str


class RunEvent(BaseModel):
    sequence: int
    type: str
    message: str
    timestamp: str
    data: dict[str, Any] | None = None


class HealthStatus(BaseModel):
    app_name: str
    model: str
    openrouter_model: str
    embedding_backend: str
    embedding_model: str
    api_key_configured: bool
    latexmk_available: bool
    template_ready: bool


class AgentOutcome(BaseModel):
    assistant_reply: str = Field(description="Short reply shown in the chat UI.")
    reasoning_summary: str = Field(
        description="Short explanation of why the selected material fits the request."
    )
    title: str | None = Field(
        default=None,
        description="Optional short title for the resume session.",
    )
