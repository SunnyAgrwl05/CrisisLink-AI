"""Shelter Tool.

Backed by a small in-memory shelter database seeded with real Patna
relief-camp names so the demo scenario ("flooding near Gandhi Setu")
returns a sensible, recognizable answer. Swap ``_SHELTERS`` for a real
DB/Sheet lookup in production.
"""

from __future__ import annotations

import math

_SHELTERS = [
    {"name": "Rajendra Nagar Relief Camp", "lat": 25.6187, "lon": 85.1350, "capacity": 500, "available": 210},
    {"name": "Patna University Relief Shelter", "lat": 25.6150, "lon": 85.1420, "capacity": 300, "available": 40},
    {"name": "Gandhi Maidan Community Shelter", "lat": 25.6117, "lon": 85.1447, "capacity": 800, "available": 650},
    {"name": "Danapur Cantonment Relief Camp", "lat": 25.6350, "lon": 85.0450, "capacity": 400, "available": 400},
]


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def find_shelters(latitude: float, longitude: float, people_count: int = 1, top_n: int = 3) -> list[dict]:
    """Returns the top shelters near a location with enough free capacity.

    Args:
        latitude: Incident latitude.
        longitude: Incident longitude.
        people_count: Number of people who need space.
        top_n: How many shelters to return, closest first.

    Returns:
        List of shelter dicts sorted by distance, each with name,
        distance_km, capacity, and available space.
    """
    candidates = [s for s in _SHELTERS if s["available"] >= people_count]
    if not candidates:
        candidates = _SHELTERS

    ranked = sorted(
        candidates,
        key=lambda s: _haversine_km(latitude, longitude, s["lat"], s["lon"]),
    )

    return [
        {
            "name": s["name"],
            "distance_km": round(_haversine_km(latitude, longitude, s["lat"], s["lon"]), 1),
            "capacity": s["capacity"],
            "available": s["available"],
        }
        for s in ranked[:top_n]
    ]
