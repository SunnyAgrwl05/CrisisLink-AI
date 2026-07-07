.PHONY: sync playground web api test docker-build docker-run

sync:
	uv sync

# Runs the ADK CLI playground for crisislink_ai (interactive terminal chat)
playground:
	uv run adk run crisislink_ai

# Runs the ADK dev web UI so you can inspect the workflow graph visually
web:
	uv run adk web

# Runs the FastAPI server (citizen-facing + NGO/authority endpoints)
api:
	uv run uvicorn fast_api_app:app --host 0.0.0.0 --port 8080 --reload

# Runs the standalone MCP server (stdio transport) for local testing
mcp:
	uv run python -m crisislink_ai.mcp_server

test:
	uv run pytest tests/ -v

docker-build:
	docker build -t crisislink-ai .

docker-run:
	docker run --env-file .env -p 8080:8080 crisislink-ai
