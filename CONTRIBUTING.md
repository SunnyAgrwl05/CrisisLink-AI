
# Contributing to CrisisLink AI

Thanks for your interest in contributing! This guide will help you get set up and understand our workflow.

## Local Development Setup

1. Fork the repository and clone your fork:
```bash
   git clone https://github.com/YOUR-USERNAME/CrisisLink-AI.git
   cd CrisisLink-AI
```

2. Add the original repo as upstream:
```bash
   git remote add upstream https://github.com/SunnyAgrwl05/CrisisLink-AI.git
```

3. Copy the environment file and add your keys:
```bash
   cp .env.example .env
```
   Add your `GOOGLE_API_KEY` (Gemini) to `.env`. `GOOGLE_MAPS_API_KEY` and `WEATHER_API_KEY` are optional — the app falls back to free/mock data if omitted.

4. Install dependencies:
```bash
   uv sync
```

5. Run the app locally:
```bash
   make playground   # Google ADK Playground
   make web           # ADK Web UI
   make api           # FastAPI service
   make mcp            # MCP server
```

6. Run tests before submitting changes:
```bash
   make test
```

## Project Structure
crisislink_ai/
├── agents/       8 LlmAgent nodes + human_approval_agent
├── tools/        weather / shelter / hospital / maps / inventory / contacts
├── security/     PII masking, prompt-injection detection, audit log
├── agent.py      root Workflow graph (discovered by adk web / adk run)
├── mcp_server.py FastMCP server exposing tools over stdio
├── mcp_client.py shared McpToolset used by tool-calling agents
└── config.py     environment-driven settings
fast_api_app.py   FastAPI service (/sos, /health)
tests/            pytest suite (security + agents/tools)

See `README.md` for the full architecture and agent workflow diagram.

## Branch Naming Conventions

Use a `type/short-description` format:
- `feat/add-shelter-api` - new feature
- `fix/cors-vercel` - bug fix
- `docs/update-readme` - documentation
- `refactor/priority-agent` - code cleanup, no behavior change

## Commit Message Conventions

Follow Conventional Commits (conventionalcommits.org):
<type>: <short description>
[optional longer description]
Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

Examples:
- `feat: add hospital availability lookup tool`
- `fix: resolve CORS error on Vercel frontend`
- `docs: add contributing guide`

## Coding Standards

- Follow existing code style in the file you're editing (Python: PEP 8 conventions).
- Keep agent logic in `crisislink_ai/agents/`, tool logic in `crisislink_ai/tools/`.
- Security-related code (PII masking, injection detection) belongs in `crisislink_ai/security/` and should remain deterministic, non-LLM code per the architecture.
- Write or update tests in `tests/` for any new tool or agent behavior.

## Pull Request Guidelines

1. Create a branch off `main` using the naming convention above.
2. Make your changes and commit using the message convention above.
3. Run `make test` and confirm all tests pass.
4. Push your branch and open a PR against `SunnyAgrwl05:main`.
5. Fill out the PR template completely, including linking the related issue with `Closes #issue-number`.
6. Ensure your branch has no merge conflicts with `main`.

## Issue Reporting Guidelines

- Search existing issues before opening a new one to avoid duplicates.
- Clearly describe the problem, expected behavior, and steps to reproduce (for bugs).
- For feature requests, explain the use case and proposed solution.
- Use relevant labels if you have permission to add them.

## Code Review Expectations

- A maintainer will review your PR and may request changes.
- Respond to review comments and push additional commits to the same branch - no need to open a new PR.
- PRs are merged once approved and all checks pass.

## Questions?

Open an issue or start a discussion - we're happy to help new contributors get oriented.
