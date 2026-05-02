from dataclasses import dataclass

from pydantic import BaseModel

class StartJobRequest(BaseModel):
    question: str
