FROM python:3.12-slim

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml ./
COPY crisislink_ai ./crisislink_ai
COPY fast_api_app.py ./

RUN uv pip install --system --no-cache . 

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "fast_api_app:app", "--host", "0.0.0.0", "--port", "8080"]
