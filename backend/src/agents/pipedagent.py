import os
import asyncio
from typing import List, Any
from pathlib import Path
from datetime import datetime, timezone
from collections.abc import Awaitable, Callable

from dotenv import load_dotenv
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.settings import ModelSettings
from pydantic_ai.providers.openai import OpenAIProvider
from pydantic_ai.messages import ModelMessagesTypeAdapter, AgentStreamEvent
from pydantic_ai.messages import (
    PartStartEvent,
    PartDeltaEvent,
    FinalResultEvent,
    TextPart,
    TextPartDelta,
    ThinkingPartDelta,
    ToolCallPartDelta,
    FunctionToolCallEvent,
    FunctionToolResultEvent,
)

PublishFn = Callable[[dict], Awaitable[None]]

load_dotenv()

class PipedAgent():
    """
    Base class for any agent that includes logging to openpipe under the session and agent name
    """
    def __init__(self, agent_name: str, description: str, system_prompt: str, session: str, deps_type = None, agent_deps = None, tools = [], model_id: str = "qwen/qwen3.6-max-preview"):
#"qwen/qwen3.6-flash"
#"deepseek/deepseek-v4-flash"
#"qwen/qwen3.6-max-preview"
        self.name = agent_name
        self.agent_deps = agent_deps
        self.deps_type = deps_type
        self.model_id = model_id
        self.tools = tools
        self.description = description
        self.session = session
        self.system_prompt = system_prompt
        self.reasoning_effort = 'low'

        self.model = self.create_piped_model()
        self.agent = self.create_agent()

        self.SESSIONS_DIR = Path("./sessions")
        self.SESSIONS_DIR.mkdir(exist_ok=True)

    def create_piped_model(self):
        model = OpenAIChatModel(
            f"{self.model_id}",
            provider=OpenAIProvider(
                base_url="https://openrouter.ai/api/v1",
                api_key=os.environ["OPENROUTER_API_KEY"]
            ),
            settings=ModelSettings(
                extra_body={
                    "reasoning": {
                        "effort": self.reasoning_effort
                    },
                    "metadata": {
                        "app": "Memvia",
                        "agent_name": self.name,
                        "session_id": self.session,
                        "provider": "openrouter",
                        "model_family": self.model_id
                    }
                }
            )
        )

        return model


    def _load_history(self):
        path = self.SESSIONS_DIR / f"{self.session}" / f"{self.name}.json"
        if not path.exists():
            return []
        return ModelMessagesTypeAdapter.validate_json(path.read_text(encoding="utf-8"))

    def _save_history(self, messages):
        path = self.SESSIONS_DIR / f"{self.session}" / f"{self.name}.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(ModelMessagesTypeAdapter.dump_json(messages, indent=2).decode(), encoding="utf-8")

    def create_agent(self) -> Agent:
        kwargs = {
            "model": self.model,
            "name": self.name,
            "description": self.description,
            "system_prompt": self.system_prompt,
            "retries": 2
        }
        if self.agent_deps is not None:
            kwargs["deps_type"] = self.deps_type
        if self.tools is not []:
            kwargs["tools"] = self.tools

        return Agent(**kwargs)

    async def ask(self, query: str, publish: PublishFn | None = None):

        async def emit(kind: str, payload: dict):
                if publish is None:
                    return
                await publish({
                    "source": "agent",
                    "agent": self.name,
                    "kind": kind,
                    "ts": datetime.now(timezone.utc).isoformat(),
                    "payload": payload,
                })

        async def _debug_event_stream(ctx: RunContext, event_stream):
            async for event in event_stream:
                if isinstance(event, PartStartEvent) and isinstance(event.part, TextPart):
                    await emit("text_start", {
                        "index": event.index,
                        "text": event.part.content,
                    })
                elif isinstance(event, PartDeltaEvent):
                    if isinstance(event.delta, TextPartDelta):
                        await emit("text_delta", {
                            "index": event.index,
                            "delta": event.delta.content_delta,
                        })
                    elif isinstance(event.delta, ThinkingPartDelta):
                        await emit("thinking_delta", {
                            "index": event.index,
                            "delta": event.delta.content_delta,
                        })
                    elif isinstance(event.delta, ToolCallPartDelta):
                        await emit("tool_args_delta", {
                            "index": event.index,
                            "args_delta": event.delta.args_delta,
                        })
                if isinstance(event, FunctionToolCallEvent):
                    await emit("tool_call", {
                        "tool_name": event.part.tool_name,
                        "tool_call_id": event.part.tool_call_id,
                        "args": event.part.args,
                    })
                    print(f"[{ctx.agent.name}] {event.part.tool_name}: {event.part.args}\n")
                elif isinstance(event, FunctionToolResultEvent):
                    await emit("tool_result", {
                        "tool_call_id": event.tool_call_id,
                        "result": event.result.content,
                    })
                    print(f"[{ctx.agent.name}] 'tool_result': {event.result.content}\n")
                elif isinstance(event, FinalResultEvent):
                    await emit("final_result", {
                        "tool_name": event.tool_name,
                        "tool_call_id": event.tool_call_id,
                    })
                    print(f"[{ctx.agent.name}] '{event.tool_name}': 'final_result'\n")
                else:
                    await emit("raw_event", {
                        "event_class": type(event).__name__,
                        "repr": repr(event),
                    })

        history = self._load_history()
        result = await self.agent.run(query, message_history=history, deps=self.agent_deps, event_stream_handler=_debug_event_stream)
        self._save_history(result.all_messages())
        return result
