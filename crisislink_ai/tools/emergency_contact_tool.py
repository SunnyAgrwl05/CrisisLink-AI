"""Emergency Contact Tool.

Returns official India-wide emergency numbers plus Bihar-specific
NDRF/state control-room contacts. These are the well-known public
national helpline numbers.
"""

from __future__ import annotations

_CONTACTS = {
    "police": "100",
    "fire": "101",
    "ambulance": "108",
    "national_emergency_number": "112",
    "ndrf_bihar_control_room": "0612-2547215",
    "bihar_state_disaster_management": "0612-2294204",
    "women_helpline": "1091",
    "child_helpline": "1098",
}


def get_emergency_contacts(category: str | None = None) -> dict:
    """Returns emergency contact numbers.

    Args:
        category: Optional single category key (e.g. "police",
            "ambulance"). If omitted, returns all contacts.

    Returns:
        dict of contact_name -> phone_number.
    """
    if category and category in _CONTACTS:
        return {category: _CONTACTS[category]}
    return dict(_CONTACTS)
