"""CrisisLink AI — FastAPI service.

Exposes the multi-agent Workflow over HTTP so a citizen-facing app,
NGO dashboard, or government portal can submit a report and receive
the final response plan.
"""

from __future__ import annotations

import json
import traceback
import uuid
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.genai import types
from pydantic import BaseModel

import google.adk  # noqa: F401
from google.adk.runners import InMemoryRunner

from crisislink_ai.agent import root_agent
from crisislink_ai.config import settings

app = FastAPI(
    title="CrisisLink AI",
    description="AI-Powered Multi-Agent Disaster Coordination System",
    version="0.1.0",
)

# Allow React/Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_runner = InMemoryRunner(
    agent=root_agent,
    app_name="crisislink-ai",
)


class SOSRequest(BaseModel):
    report_text: str
    user_id: str | None = None


class SOSResponse(BaseModel):
    session_id: str
    final_response: dict[str, Any] | None = None
    priority_result: dict[str, Any] | None = None
    security_result: dict[str, Any] | None = None
    approval_result: dict[str, Any] | None = None
    raw_state: dict[str, Any] | None = None


def _try_parse(value: Any) -> Any:
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    return value


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model": settings.MODEL_NAME,
    }


@app.post("/sos", response_model=SOSResponse)
async def submit_sos(payload: SOSRequest):

    if not payload.report_text.strip():
        raise HTTPException(
            status_code=400,
            detail="report_text must not be empty",
        )

    user_id = payload.user_id or "citizen"
    session_id = str(uuid.uuid4())

    await _runner.session_service.create_session(
        app_name="crisislink-ai",
        user_id=user_id,
        session_id=session_id,
    )

    new_message = types.Content(
        role="user",
        parts=[
            types.Part(text=payload.report_text),
        ],
    )

    final_state: dict[str, Any] = {}

    try:

        async for event in _runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=new_message,
        ):

            print("\n" + "=" * 80)
            print("EVENT")
            print(event)
            print("=" * 80)

            if event.actions:
                print("ACTIONS:")
                print(event.actions)

            if event.actions and event.actions.state_delta:
                print("STATE DELTA:")
                print(event.actions.state_delta)

                final_state.update(event.actions.state_delta)

        print("\n" + "=" * 80)
        print("FINAL STATE")
        print(json.dumps(final_state, indent=2, default=str))
        print("=" * 80)

    except Exception as e:

        print("\n" + "=" * 80)
        print("ADK ERROR")
        traceback.print_exc()
        print("=" * 80)

        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "type": type(e).__name__,
            },
        )

    return SOSResponse(
        session_id=session_id,
        final_response=_try_parse(
            final_state.get("final_response")
        ),
        priority_result=_try_parse(
            final_state.get("priority_result")
        ),
        security_result=_try_parse(
            final_state.get("security_result")
        ),
        approval_result=_try_parse(
            final_state.get("approval_result")
        ),
        raw_state=final_state,
    )

