"""Hospital Tool.

Seeded with real Patna hospitals (PMCH, AIIMS Patna, NMCH) so the
demo scenario returns recognizable, sensible results. Swap
``_HOSPITALS`` for a live bed-availability API in production.
"""

from __future__ import annotations

from .shelter_tool import _haversine_km

_HOSPITALS = [
    {"name": "Patna Medical College Hospital (PMCH)", "lat": 25.6156, "lon": 85.1425, "icu_beds": 6, "general_beds": 40, "has_ambulance": True},
    {"name": "AIIMS Patna", "lat": 25.6472, "lon": 85.0690, "icu_beds": 12, "general_beds": 80, "has_ambulance": True},
    {"name": "Nalanda Medical College Hospital (NMCH)", "lat": 25.5943, "lon": 85.1560, "icu_beds": 4, "general_beds": 25, "has_ambulance": True},
]


def find_hospitals(latitude: float, longitude: float, need_icu: bool = False, top_n: int = 3) -> list[dict]:
    """Returns nearby hospitals with ICU/bed availability.

    Args:
        latitude: Incident latitude.
        longitude: Incident longitude.
        need_icu: If True, prioritizes hospitals with free ICU beds.
        top_n: How many hospitals to return.

    Returns:
        List of hospital dicts sorted by distance (ICU-capable first
        when need_icu=True), with name, distance_km, icu_beds,
        general_beds, has_ambulance.
    """
    def sort_key(h: dict) -> tuple:
        icu_priority = 0 if (need_icu and h["icu_beds"] > 0) else 1
        return (icu_priority, _haversine_km(latitude, longitude, h["lat"], h["lon"]))

    ranked = sorted(_HOSPITALS, key=sort_key)

    return [
        {
            "name": h["name"],
            "distance_km": round(_haversine_km(latitude, longitude, h["lat"], h["lon"]), 1),
            "icu_beds": h["icu_beds"],
            "general_beds": h["general_beds"],
            "has_ambulance": h["has_ambulance"],
        }
        for h in ranked[:top_n]
    ]
