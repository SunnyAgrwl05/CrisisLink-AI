"""CrisisLink AI — MCP Server.

Exposes every disaster-response tool (weather, shelter, hospital,
maps, resource inventory, emergency contacts) over the Model Context
Protocol using the official ``mcp`` Python SDK. ADK agents connect to
this server via ``McpToolset(connection_params=StdioServerParameters(...))``
— see ``crisislink_ai/agent.py``.

Run standalone for local testing:
    python -m crisislink_ai.mcp_server
"""

from __future__ import annotations

from mcp.server.fastmcp import FastMCP

from .tools import (
    check_inventory,
    allocate_resources,
    find_hospitals,
    find_shelters,
    get_emergency_contacts,
    get_route,
    get_weather,
)

mcp_app = FastMCP("crisislink-tools")


@mcp_app.tool()
def weather_tool(latitude: float, longitude: float) -> dict:
    """Get current weather, rain prediction, wind speed, and flood risk for a location."""
    return get_weather(latitude, longitude)


@mcp_app.tool()
def shelter_tool(latitude: float, longitude: float, people_count: int = 1) -> list[dict]:
    """Find the nearest shelters with enough capacity for the affected people."""
    return find_shelters(latitude, longitude, people_count)


@mcp_app.tool()
def hospital_tool(latitude: float, longitude: float, need_icu: bool = False) -> list[dict]:
    """Find the nearest hospitals with ICU/bed availability."""
    return find_hospitals(latitude, longitude, need_icu)


@mcp_app.tool()
def maps_tool(origin_lat: float, origin_lon: float, dest_lat: float, dest_lon: float) -> dict:
    """Get travel time, distance, and blocked-road status between two points."""
    return get_route(origin_lat, origin_lon, dest_lat, dest_lon)


@mcp_app.tool()
def resource_inventory_tool() -> dict:
    """Check current available quantities of food, water, medical kits, and vehicles."""
    return check_inventory()


@mcp_app.tool()
def allocate_resources_tool(
    people_affected: int,
    severity: str,
    need_boat: bool = False,
    need_helicopter: bool = False,
) -> dict:
    """Allocate an optimal resource bundle (food, water, medical, vehicles) for a rescue op."""
    return allocate_resources(people_affected, severity, need_boat, need_helicopter)


@mcp_app.tool()
def emergency_contact_tool(category: str | None = None) -> dict:
    """Get emergency contact numbers (police, fire, ambulance, NDRF, etc.)."""
    return get_emergency_contacts(category)


if __name__ == "__main__":
    mcp_app.run(transport="stdio")
