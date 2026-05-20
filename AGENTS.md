# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Structure (Non-Obvious)

- **Monorepo with separate frontend/backend**: Run commands from respective directories, NOT root
- **Backend runs on port 8082** (not standard 8000/8080) - hardcoded in multiple places
- **Frontend expects port 3000** - Vite auto-increments if occupied (3001, 3002, etc.)
- **start.sh must run from root** - creates venv in root, then navigates to subdirectories

## Critical API Response Pattern

**CRITICAL**: Backend has inconsistent response wrapping that MUST be handled:
- `/register` and `/flights` return data directly
- All other endpoints wrap in `{ "success": true, "data": {...} }`
- Frontend MUST use: `response.data.data || response.data` in api/endpoints.ts
- Failure to unwrap causes booking IDs to be null/undefined

## Database & Testing (Backend)

- **SQLite database file**: `galaxium_travels.db` created in python_backend/ directory
- **Seed data required**: Run `python -m app.seed_data` before first use
- **Test from python_backend/**: `pytest` (not from root)
- **Single test class**: `pytest tests/test_api.py::TestUserRegistration -v`
- **Coverage report**: Generated in `htmlcov/` directory

## State Management (Frontend)

- **Zustand store persists to localStorage** as `galaxium-user-storage`
- **User state includes isAgent flag** (not isStaff as in BUILD_SPEC.md)
- **TanStack Query cache times**: Flights 5min, Bookings 1min (not configurable)
- **Path alias `@`** resolves to `./src` (configured in vite.config.ts)

## Environment Setup

- **Backend venv location**: Root directory (not in python_backend/)
- **Backend must activate venv**: `source ../venv/bin/activate` from python_backend/
- **Frontend .env required**: Copy from .env.example, set VITE_API_BASE_URL
- **CORS wide open**: Backend allows all origins (development only)

## Custom Bob Modes

- **documentation-writer mode**: Available for technical writing tasks
- **carbon-react mode**: For Carbon Design System components (not used in this project)
- Modes defined in `.bobmodes` file in root