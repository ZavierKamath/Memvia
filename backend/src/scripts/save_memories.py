from src.services.mem_service import MemoryService
import json


mem_service = MemoryService()
current_mems = mem_service.get_memories()

clean_mems = []
for mem in current_mems:
    clean_mems.append({
        "title": mem["title"],
        "kind": mem["kind"],
        "content": mem["content"]
    })

with open("../data/current_mems.json", "w", encoding="utf-8") as f:
    json.dump(clean_mems, f, indent=2)
