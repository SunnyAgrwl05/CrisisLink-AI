"""Weather Tool.

Uses Open-Meteo (https://open-meteo.com) which needs no API key, so
this works out of the box in a hackathon demo. Falls back to a mock
"heavy rain" reading if the request fails (offline judging, no
network, etc.) so the demo never breaks.
"""

from __future__ import annotations

import httpx

_DEFAULT_LAT = 25.5941  # Patna, Bihar
_DEFAULT_LON = 85.1376

_FALLBACK = {
    "condition": "Heavy Rain",
    "temperature_c": 27.0,
    "wind_speed_kmh": 34.0,
    "rain_probability_pct": 92,
    "flood_risk": "high",
    "source": "fallback_mock",
}


def get_weather(latitude: float = _DEFAULT_LAT, longitude: float = _DEFAULT_LON) -> dict:
    """Returns current weather, rain prediction, wind speed, and flood risk.

    Args:
        latitude: Latitude of the affected area. Defaults to Patna.
        longitude: Longitude of the affected area. Defaults to Patna.

    Returns:
        dict with condition, temperature_c, wind_speed_kmh,
        rain_probability_pct, and a derived flood_risk label.
    """
    try:
        resp = httpx.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": latitude,
                "longitude": longitude,
                "current": "temperature_2m,wind_speed_10m,precipitation",
                "hourly": "precipitation_probability",
                "forecast_days": 1,
            },
            timeout=6.0,
        )
        resp.raise_for_status()
        data = resp.json()
        current = data.get("current", {})
        rain_prob_list = data.get("hourly", {}).get("precipitation_probability", [])
        rain_prob = max(rain_prob_list) if rain_prob_list else 0
        precipitation = current.get("precipitation", 0.0)

        if precipitation >= 10 or rain_prob >= 85:
            flood_risk = "high"
            condition = "Heavy Rain"
        elif precipitation > 0 or rain_prob >= 50:
            flood_risk = "moderate"
            condition = "Rain"
        else:
            flood_risk = "low"
            condition = "Clear"

        return {
            "condition": condition,
            "temperature_c": current.get("temperature_2m"),
            "wind_speed_kmh": current.get("wind_speed_10m"),
            "rain_probability_pct": rain_prob,
            "flood_risk": flood_risk,
            "source": "open-meteo",
        }
    except (httpx.HTTPError, KeyError, ValueError):
        return dict(_FALLBACK)
