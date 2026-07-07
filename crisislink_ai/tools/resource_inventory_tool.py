"""Resource Inventory Tool.

In-memory inventory for the hackathon demo. In a real deployment this
would read/write a shared SQLite/Cloud SQL table so multiple rescue
teams don't double-allocate the same resources.
"""

from __future__ import annotations

_INVENTORY = {
    "food_kits": 500,
    "water_bottles": 2000,
    "medical_kits": 150,
    "blankets": 300,
    "rescue_teams": 12,
    "ambulances": 8,
    "helicopters": 2,
    "boats": 6,
}


def check_inventory() -> dict:
    """Returns current available quantity of every resource type."""
    return dict(_INVENTORY)


def allocate_resources(
    people_affected: int,
    severity: str,
    need_boat: bool = False,
    need_helicopter: bool = False,
) -> dict:
    """Allocates an optimal resource bundle for a rescue operation.

    Args:
        people_affected: Number of people needing help.
        severity: One of "low", "medium", "high", "critical".
        need_boat: Whether the terrain requires a boat (flood).
        need_helicopter: Whether the terrain requires a helicopter.

    Returns:
        dict describing what was allocated and what remains in stock.
        Never allocates more than is currently available.
    """
    severity_multiplier = {"low": 0.5, "medium": 1.0, "high": 1.5, "critical": 2.0}.get(
        severity.lower(), 1.0
    )

    plan = {
        "food_kits": min(_INVENTORY["food_kits"], people_affected),
        "water_bottles": min(_INVENTORY["water_bottles"], people_affected * 2),
        "medical_kits": min(_INVENTORY["medical_kits"], max(1, round(people_affected * 0.1 * severity_multiplier))),
        "ambulances": min(_INVENTORY["ambulances"], max(1, round(people_affected / 8))),
        "rescue_teams": min(_INVENTORY["rescue_teams"], max(1, round(people_affected / 10))),
        "boats": min(_INVENTORY["boats"], 1) if need_boat else 0,
        "helicopters": min(_INVENTORY["helicopters"], 1) if need_helicopter else 0,
    }

    for key, qty in plan.items():
        if key in _INVENTORY:
            _INVENTORY[key] -= qty

    return {
        "allocated": plan,
        "remaining_inventory": dict(_INVENTORY),
    }
