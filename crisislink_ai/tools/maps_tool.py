"""Maps Tool.

Uses the Google Maps Directions API when GOOGLE_MAPS_API_KEY is set.
Falls back to a haversine-distance estimate (assuming disaster-zone
average speed) so the demo works without any key.
"""

from __future__ import annotations

import httpx

from ..config import settings
from .shelter_tool import _haversine_km

_DISASTER_AVG_SPEED_KMH = 20.0  # conservative: flooded/blocked roads


def get_route(origin_lat: float, origin_lon: float, dest_lat: float, dest_lon: float) -> dict:
    """Returns travel time, distance, and route status between two points.

    Args:
        origin_lat: Origin latitude (e.g. rescue team base).
        origin_lon: Origin longitude.
        dest_lat: Destination latitude (e.g. incident site).
        dest_lon: Destination longitude.

    Returns:
        dict with distance_km, eta_minutes, blocked_roads (bool), and
        alternate_route_suggested (bool).
    """
    if settings.GOOGLE_MAPS_API_KEY:
        try:
            resp = httpx.get(
                "https://maps.googleapis.com/maps/api/directions/json",
                params={
                    "origin": f"{origin_lat},{origin_lon}",
                    "destination": f"{dest_lat},{dest_lon}",
                    "key": settings.GOOGLE_MAPS_API_KEY,
                },
                timeout=6.0,
            )
            resp.raise_for_status()
            data = resp.json()
            if data.get("status") == "OK" and data.get("routes"):
                leg = data["routes"][0]["legs"][0]
                return {
                    "distance_km": round(leg["distance"]["value"] / 1000, 1),
                    "eta_minutes": round(leg["duration"]["value"] / 60),
                    "blocked_roads": False,
                    "alternate_route_suggested": len(data["routes"]) > 1,
                    "source": "google_maps",
                }
        except (httpx.HTTPError, KeyError, IndexError):
            pass  # fall through to estimate

    distance_km = _haversine_km(origin_lat, origin_lon, dest_lat, dest_lon)
    eta_minutes = round((distance_km / _DISASTER_AVG_SPEED_KMH) * 60)
    return {
        "distance_km": round(distance_km, 1),
        "eta_minutes": eta_minutes,
        "blocked_roads": distance_km > 5,  # heuristic: longer routes in a
        # disaster zone are more likely to hit blocked segments
        "alternate_route_suggested": distance_km > 5,
        "source": "distance_estimate",
    }
