"""Tests for MCP tool logic and the overall workflow graph.

The graph-construction test is the most important one for catching
"the agent wiring is broken" bugs before you ever spend a Gemini API
call on it.
"""

import os

os.environ.setdefault("GOOGLE_API_KEY", "test-key-not-used")

from crisislink_ai.tools.shelter_tool import find_shelters
from crisislink_ai.tools.hospital_tool import find_hospitals
from crisislink_ai.tools.resource_inventory_tool import allocate_resources, check_inventory
from crisislink_ai.tools.emergency_contact_tool import get_emergency_contacts


def test_find_shelters_returns_ranked_results():
    shelters = find_shelters(latitude=25.6127, longitude=85.1447, people_count=15, top_n=2)
    assert len(shelters) <= 2
    assert all("distance_km" in s for s in shelters)
    # Closest shelter should have the smallest distance.
    if len(shelters) > 1:
        assert shelters[0]["distance_km"] <= shelters[1]["distance_km"]


def test_find_hospitals_prioritizes_icu_when_needed():
    hospitals = find_hospitals(latitude=25.6127, longitude=85.1447, need_icu=True, top_n=1)
    assert hospitals[0]["icu_beds"] > 0


def test_allocate_resources_never_exceeds_inventory():
    before = check_inventory()
    result = allocate_resources(people_affected=15, severity="critical", need_boat=True)
    allocated = result["allocated"]
    assert allocated["boats"] <= before["boats"]
    assert allocated["ambulances"] <= before["ambulances"]


def test_emergency_contacts_has_core_numbers():
    contacts = get_emergency_contacts()
    assert contacts["police"] == "100"
    assert contacts["ambulance"] == "108"


def test_workflow_graph_constructs_with_all_nodes():
    from crisislink_ai.agent import root_agent

    node_names = {n.name for n in root_agent.graph.nodes}
    expected = {
        "orchestrator",
        "sos_agent",
        "damage_agent",
        "priority_agent",
        "resource_agent",
        "shelter_agent",
        "medical_agent",
        "security_checkpoint",
        "human_approval_agent",
        "communication_agent",
    }
    assert expected.issubset(node_names)
