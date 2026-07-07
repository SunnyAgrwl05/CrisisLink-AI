# 🛰️ CrisisLink AI

**AI-Powered Multi-Agent Disaster Coordination System** — built for the Google AI Agent Builder Series 2026, *Agents for Good* track.

CrisisLink AI takes a raw citizen emergency report and turns it into a verified, prioritized, resourced, security-checked rescue plan — using a Google ADK 2.x graph-based **Workflow**, an **MCP server** for tools, and a **human-in-the-loop** gate for critical decisions.

> This scaffold was built and verified against `google-adk==2.3.0` and the official `mcp` Python SDK. The full workflow graph, all 10 nodes, the MCP server, and the FastAPI app were constructed and smoke-tested in this environment — see [Verification](#verification-already-done) below. **Still run the steps yourself** before you submit; ADK evolves fast and your installed version may differ.



### ADK Workflow Execution

![ADK Workflow](assets/adk_demo.png)

### Multi-Agent Architecture

![Architecture](assets/architecture_diagram.png)





## Architecture

```
Citizen
   │
   ▼
Emergency Orchestrator  (AgentTool → triage_advisor)
   │
   ├─────────────┐
   ▼             ▼
SOS Agent    Damage Agent          (parallel)
   └──────┬──────┘
          ▼
   Priority Agent
          │
   ┌──────┼──────┐
   ▼      ▼      ▼
Resource Shelter Medical            (parallel)
   └──────┼──────┘
          ▼
  Security Checkpoint   (code, not LLM: PII mask + injection scan + audit log)
          ▼
  Human Approval Agent  (HITL gate — only for CRITICAL priority)
          ▼
  Communication Agent
          ▼
   Final Response
```

See `assets/architecture_diagram.svg` for the rendered version.

## Folder structure

```
crisislink-ai/
├── assets/                    architecture diagram (SVG)
├── tests/                     pytest suite (security + agents/tools)
├── crisislink_ai/
│   ├── agents/                 8 LlmAgent nodes + human_approval_agent
│   ├── tools/                  weather / shelter / hospital / maps / inventory / contacts
│   ├── security/               PII masking, prompt-injection detection, audit log, security checkpoint
│   ├── agent.py                root Workflow graph (root_agent — discovered by `adk web` / `adk run`)
│   ├── mcp_server.py            FastMCP server exposing all tools over stdio
│   ├── mcp_client.py            shared McpToolset used by tool-calling agents
│   └── config.py                environment-driven settings
├── fast_api_app.py              FastAPI service (/sos, /health)
├── README.md
├── SUBMISSION_WRITEUP.md
├── DEMO_SCRIPT.txt
├── Makefile
├── pyproject.toml
├── .env.example
└── Dockerfile
```

## ADK requirements checklist

| Requirement | Where |
|---|---|
| Workflow API | `crisislink_ai/agent.py` — `Workflow(edges=[...])` graph |
| Minimum 6 LlmAgents | 8 agents in `crisislink_ai/agents/` + `human_approval_agent` |
| MCP Server | `crisislink_ai/mcp_server.py` (FastMCP, stdio transport) |
| MCPToolset | `crisislink_ai/mcp_client.py`, used by damage/priority/resource/shelter/medical agents |
| AgentTool | `orchestrator_agent` wraps a `triage_advisor` sub-agent via `AgentTool` |
| Security Checkpoint | `crisislink_ai/security/checkpoint.py` (graph node, not an LLM call) |
| Prompt Injection Detection | `crisislink_ai/security/prompt_injection_detector.py` |
| PII Scrubbing | `crisislink_ai/security/pii_masking.py` |
| Human Approval | `crisislink_ai/agents/human_approval_agent.py` (uses ADK's `request_input` long-running tool) |
| FastAPI | `fast_api_app.py` |
| Docker | `Dockerfile` |
| ctx.state | agents read `{orchestrator_output}`, `{sos_result}`, etc. via ADK's session-state instruction templating; `security_checkpoint` writes `ctx.state["security_result"]` directly |

## Setup

```bash
cd crisislink-ai
cp .env.example .env
# put your real Gemini key in .env:
#   GOOGLE_API_KEY=...
uv sync
```

No `GOOGLE_MAPS_API_KEY` or `WEATHER_API_KEY`? That's fine — `weather_tool` calls the free, keyless [Open-Meteo](https://open-meteo.com) API, and `maps_tool` / `shelter_tool` / `hospital_tool` fall back to a small seeded mock database of real Patna locations (matching the demo scenario below) so everything works offline for judging.

## Run it

```bash
make playground   # adk run crisislink_ai  — interactive terminal chat
make web           # adk web               — visual workflow-graph inspector
make api           # uvicorn fast_api_app:app --reload
make mcp           # run the MCP server standalone, for debugging tools
make test          # pytest — 13 tests, no API key needed
```

Try the demo scenario against the API:

```bash
curl -X POST http://localhost:8080/sos \
  -H "Content-Type: application/json" \
  -d '{"report_text": "There is severe flooding in Patna. 15 people trapped near Gandhi Setu."}'
```

## Verification already done

Before handing this scaffold over, the following was actually run and confirmed in a sandboxed environment (not just written and hoped for):

1. `pip install google-adk mcp` — confirmed the real, current API surface (`Workflow`, `START`, `node`, `LlmAgent`, `McpToolset`, `AgentTool`, `request_input`) rather than guessing from memory.
2. The full `root_agent` Workflow graph — all 10 nodes, parallel fan-out/fan-in, the code-only security checkpoint, and the human-approval gate — **constructs without error**.
3. `fast_api_app.py` imports and registers its routes (`/health`, `/sos`) correctly against a live `InMemoryRunner`.
4. `crisislink_ai/mcp_server.py` imports and registers all 7 MCP tools correctly.
5. `pytest tests/` — **13/13 passing** — covers PII masking, prompt-injection detection, audit logging, tool logic (shelter/hospital/inventory), and graph construction.

What was **not** run (needs your own Gemini API key + real network access): an actual end-to-end model call through the full pipeline. Do that next:

```bash
uv sync
make playground
# paste: "There is severe flooding in Patna. 15 people trapped near Gandhi Setu."
```

Then check `audit_log.jsonl` in the project root to see the structured decision trail.

## Known gaps / next steps

- `damage_agent` is text-only for now; image-based damage assessment (photo uploads) is a documented future extension.
- Shelter/hospital data is a small seeded mock DB — swap for a real Sheet/DB before production use.
- `human_approval_agent`'s `request_input` tool call needs a client that renders ADK long-running-tool prompts (`adk web`, `adk run`, or your own UI) to actually pause and collect a dispatcher's answer.
