"""Round-robin Gemini API key rotation."""

from __future__ import annotations

import itertools
import os

from google.adk.models.google_llm import Gemini

from .config import settings

_KEYS = [
    k
    for k in (
        settings.GOOGLE_API_KEY,
        settings.GOOGLE_API_KEY_2,
        settings.GOOGLE_API_KEY_3,
    )
    if k
]

if not _KEYS:
    raise RuntimeError("No Gemini API keys found.")

_key_cycle = itertools.cycle(_KEYS)


class RotatingGemini(Gemini):
    """Rotate API key before EVERY request."""

    def _next_key(self):
        key = next(_key_cycle)
        os.environ["GOOGLE_API_KEY"] = key

        # Force ADK to recreate the client
        self.__dict__.pop("api_client", None)

    async def generate_content_async(self, llm_request, stream=False):
        last_error = None

        for _ in range(len(_KEYS)):
            self._next_key()

            try:
                async for chunk in super().generate_content_async(
                    llm_request,
                    stream=stream,
                ):
                    yield chunk
                return

            except Exception as e:
                last_error = e
                msg = str(e)

                if (
                    "429" in msg
                    or "RESOURCE_EXHAUSTED" in msg
                ):
                    continue

                raise

        raise last_error


def get_rotating_model():
    return RotatingGemini(model=settings.MODEL_NAME)

