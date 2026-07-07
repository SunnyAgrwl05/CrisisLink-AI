# CrisisLink AI — Submission Writeup

## Problem

In the first hours after a flood, earthquake, cyclone, landslide, or wildfire, rescue coordination breaks down in predictable ways: fake SOS requests waste scarce rescue resources, teams have no shared prioritization, NGOs and government agencies work from different pictures of the situation, and citizens can't easily find the nearest shelter or hospital.

## Solution

CrisisLink AI is a Google ADK–based multi-agent pipeline that turns one raw citizen report into a verified, prioritized, resourced, and security-checked rescue plan in seconds.

A citizen's message flows through a graph of specialized agents: an Orchestrator extracts structured facts, an SOS Verification Agent filters out spam/duplicates, a Damage Assessment Agent classifies severity using live weather data, a Priority Agent scores urgency 0–100, and three agents run in parallel to assign resources, recommend shelters, and give safe first-aid guidance. Every plan passes through a code-only Security Checkpoint (PII masking + prompt-injection detection + audit logging) before a Human Approval Agent gates anything CRITICAL behind a real dispatcher's sign-off. A Communication Agent then produces citizen, authority, and NGO-ready messages.

## Why this architecture

- **Graph-based Workflow, not a single mega-prompt.** Each agent has one job, one model call, and a clear output contract, so failures are debuggable and individual agents can be swapped or improved independently.
- **Parallel fan-out where it's safe** (SOS/Damage; Resource/Shelter/Medical), so the pipeline stays fast when seconds matter.
- **Security is code, not a prompt.** The Security Checkpoint is a plain Python function node — PII masking and prompt-injection detection can't be talked out of their job by a cleverly worded citizen report.
- **Humans stay in control of high-stakes decisions.** Anything scored CRITICAL pauses for a real dispatcher's approval before citizens or authorities are notified — the system accelerates judgment, it doesn't replace it.
- **Works offline for judging.** Weather comes from the free Open-Meteo API (no key needed); shelters/hospitals/inventory are seeded with real Patna locations so the included demo scenario returns a recognizable, sensible answer even without any paid API keys configured.

## Tech stack

Google ADK 2.x (Workflow graph API), Gemini 2.5 Flash, FastAPI, the official MCP Python SDK (FastMCP), Google Maps + Open-Meteo APIs, SQLite/JSONL audit logging, Docker.

## What's genuinely working vs. what needs a live key

The full workflow graph (10 nodes), the MCP server (7 tools), and the FastAPI service were constructed and unit-tested in this repo — 13/13 tests passing, zero API key required. What still needs a real `GOOGLE_API_KEY` is an actual end-to-end model run through the pipeline; see the README's "Verification already done" section for exactly what was and wasn't checked before this was submitted.

## Team / individual note

Built solo as a hackathon submission — see README for setup and the demo script for a guided walkthrough.
