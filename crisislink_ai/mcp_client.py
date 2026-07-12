"""Shared MCP toolset.

Every agent that needs weather/shelter/hospital/maps/inventory/contact
data connects to the same local MCP server (``mcp_server.py``) over
stdio. ADK spawns and manages the subprocess automatically the first
time a tool from this toolset is called.
"""

from __future__ import annotations

import sys

from google.adk.tools.mcp_tool import McpToolset, StdioConnectionParams
from mcp.client.stdio import StdioServerParameters

mcp_toolset = McpToolset(
    connection_params=StdioConnectionParams(
        server_params=StdioServerParameters(
            command=sys.executable,
            args=["-m", "crisislink_ai.mcp_server"],
        ),
        timeout=15.0,
    ),
)