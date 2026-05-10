from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parents[3]

class TexService():
    def __init__(self):
        self.sessions_path = BASE_DIR / "backend" / "sessions"
