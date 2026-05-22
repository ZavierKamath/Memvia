import json
from uuid import uuid4

from src.services.mem_service import MemoryService
from src.models import Memory

with open("../data/personal_mems.json", "r", encoding="utf-8") as file:
    personal_mems = json.load(file)

mem_service = MemoryService()
current_mems = mem_service.get_memories()

for old_mem, new_mem in zip(current_mems, personal_mems):
    mem_service.delete_memory(old_mem["mem_id"])

    new_mem_id = str(uuid4())
    new_mem_preembed_string = f"# Title: {new_mem['title']}\n\n ## Memory Kind: {new_mem['kind']}\n\n##Memory Content\n{new_mem['content']}"
    embedding = mem_service.embed(new_mem_preembed_string)

    new_mem_object = Memory(
        mem_id=new_mem_id,
        kind=new_mem["kind"],
        title=new_mem["title"],
        content=new_mem["content"],
        embedding=embedding
    )
    mem_service.create_memory(new_mem_object)
