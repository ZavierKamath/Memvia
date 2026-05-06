import sqlite3
from pathlib import Path
from contextlib import contextmanager
import json
from typing import List
import math
from collections import defaultdict

from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

from src.models import Memory, MemoryRetrievalResult

BASE_DIR = Path(__file__).resolve().parents[3]

class MemoryService():
    def __init__(self):
        self.db_path = BASE_DIR / "data" / "memories" / "memories.sqlite"

    @contextmanager
    def connection(self):
        conn = sqlite3.connect(self.db_path)
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def embed(self, query: str):
        client = OpenAI(
            api_key=os.environ["OPENROUTER_API_KEY"],
            base_url="https://openrouter.ai/api/v1",
        )

        res = client.embeddings.create(
            model="openai/text-embedding-3-small",
            input=query
        )

        vector = res.data[0].embedding
        return vector

    def init_db(self):
        with self.connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS memories (
                    mem_id TEXT PRIMARY KEY,
                    kind TEXT NOT NULL,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    embedding TEXT NOT NULL
                );
            """)

    def create_memory(self, mem: Memory):
        mem_id, kind, title, content, embedding = mem.mem_id, mem.kind, mem.title, mem.content, mem.embedding
        embedding = json.dumps(embedding)
        with self.connection() as conn:
            conn.execute(
                "INSERT INTO memories (mem_id, kind, title, content, embedding) VALUES (?, ?, ?, ?, ?)",
                (mem_id, kind, title, content, embedding,)
            )
        return f"Created memory with id: {mem_id}"

    def get_memories(self):
        with self.connection() as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute("SELECT * FROM memories").fetchall()
            rows = [dict(row) for row in rows]
            for row in rows:
                row['embedding'] = json.loads(row['embedding'])
        return rows

    def delete_memory(self, mem_id: str):
        with self.connection() as conn:
            conn.execute(
                "DELETE FROM memories WHERE mem_id = ?",
                (mem_id,)
            )
        return f"Deleted memory with id: {mem_id}"

    def _cosine_similarity(self, vec1: List[float], vec2: List[float]):
        dot = sum(x * y for x, y in zip(vec1, vec2))
        norm1 = math.sqrt(sum(x * x for x in vec1))
        norm2 = math.sqrt(sum(y * y for y in vec2))

        if norm1 == 0 or norm2 == 0:
            raise ValueError("Cosine similarity is undefined for zero vector")

        score = dot / (norm1 * norm2)
        return score

    def retrieve(self, query: str, k: int):
        embedded_query = self.embed(query)
        rows = self.get_memories()
        k = min(len(rows), k)
        scored = []

        for i, row in enumerate(rows):
            row_embedding = row["embedding"]
            score = self._cosine_similarity(embedded_query, row_embedding)
            scored.append((score, row))

        top_results = [item for _, item in sorted(scored, reverse=True)[:k]]
        return top_results
