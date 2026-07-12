"""Rotates across multiple Gemini API keys, auto-retrying on 429 quota errors."""

from __future__ import annotations

import itertools
import os

from google.adk.models.google_llm import Gemini

from .config import settings

_KEYS = [k for k in (settings.GOOGLE_API_KEY, settings.GOOGLE_API_KEY_2, settings.GOOGLE_API_KEY_3) if k]
if not _KEYS:
    raise RuntimeError("No GOOGLE_API_KEY / GOOGLE_API_KEY_2 / GOOGLE_API_KEY_3 found in .env")

_key_cycle = itertools.cycle(_KEYS)


class RotatingGemini(Gemini):
    """Gemini model wrapper: on RESOURCE_EXHAUSTED (429), rotates to the next key and retries."""

    def _rotate_key(self) -> None:
        new_key = next(_key_cycle)
        os.environ["GOOGLE_API_KEY"] = new_key
        self.__dict__.pop("api_client", None)  # force client rebuild with new key

    async def generate_content_async(self, llm_request, stream: bool = False):
        last_err = None
        for _ in range(len(_KEYS)):
            try:
                async for response in super().generate_content_async(llm_request, stream=stream):
                    yield response
                return
            except Exception as e:  # noqa: BLE001
                msg = str(e)
                if "RESOURCE_EXHAUSTED" in msg or "429" in msg:
                    last_err = e
                    self._rotate_key()
                    continue
                raise
        if last_err:
            raise last_err


def get_rotating_model() -> RotatingGemini:
    return RotatingGemini(model=settings.MODEL_NAME)

