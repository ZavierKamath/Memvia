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
    root_dir: Path = ROOT_DIR
    backend_dir: Path = BACKEND_DIR
    data_dir: Path = ROOT_DIR / "data"
    output_dir: Path = ROOT_DIR / "output"
    database_path: Path = ROOT_DIR / "data" / "resume_builder.db"
    template_path: Path = BACKEND_DIR / "resume_template.cls"
    default_agent_backend: str = os.getenv("DEFAULT_AGENT_BACKEND", "openrouter")
    openrouter_model: str = os.getenv(
        "OPENROUTER_MODEL", "openrouter:anthropic/claude-sonnet-4.6"
    )
    ollama_model: str = os.getenv("OLLAMA_MODEL", "ollama:gemma4:e2b")
    ollama_base_url: str | None = os.getenv("OLLAMA_BASE_URL")
    openrouter_embedding_model: str = os.getenv(
        "OPENROUTER_EMBEDDING_MODEL", "openai/text-embedding-3-large"
    )
    openrouter_api_key: str | None = os.getenv("OPENROUTER_API_KEY")
    use_openrouter_embeddings: bool = os.getenv(
        "USE_OPENROUTER_EMBEDDINGS", "true"
    ).lower() in {"1", "true", "yes", "on"}
    app_name: str = "RoleDex"
    owner_name: str = "Zavier Kamath"
    owner_email: str = "zavierkamath@gmail.com"
    owner_website: str = "https://www.zavier-kamath.com"
    owner_linkedin: str = "https://www.linkedin.com/in/zavierkamath"
    owner_github: str = "https://github.com/ZavierKamath"

    def ensure_directories(self) -> None:
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        (self.output_dir / "resumes").mkdir(parents=True, exist_ok=True)
        (self.output_dir / "cover_letters").mkdir(parents=True, exist_ok=True)


settings = Settings()
