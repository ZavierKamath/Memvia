from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = ROOT_DIR / "backend"

load_dotenv(BACKEND_DIR / ".env")


@dataclass(slots=True)
class Settings:


settings = Settings()
