# Cosmos

Cosmos is a new implementation of the personal operating system defined by `Product_Bible_V2`, `Experience_V1`, and `Architecture_Review_V3`.

Sprint 4 adds fixed Workspace Environment Windows, isolated Tool Runtime lifecycles, multi-window layout foundations, and durable Workspace restoration without partially implementing the core Tools assigned to Sprint 5.

## Repository map

```text
backend/       Python Core, Runtime contracts, Persistence, and API bootstrap
frontend/      Vue application shell and reusable TypeScript client runtime
contracts/     Cross-runtime schemas and compatibility contracts
extensions/    Installable Extension category roots (empty in Sprint 0)
docker/        Local backend container definition
scripts/       Cross-platform bootstrap and verification entry points
docs/          Product authority and implementation decision records
.github/       Continuous verification using the same local scripts
```

Runtime data is external to source by default (`~/.cosmos`) and may be redirected with `COSMOS_RUNTIME_PATH`.

## Bootstrap

Python 3.11+ and Node.js with pnpm are required.

```text
python scripts/bootstrap.py
python scripts/check.py
```

Run the backend after bootstrap:

```text
.venv/Scripts/python -m cosmos
```

On Unix-like systems the interpreter is `.venv/bin/python`.

Run the frontend application in another terminal:

```text
pnpm --dir frontend dev
```

The development server is available at `http://127.0.0.1:5173` and proxies `/api` to the backend at `http://127.0.0.1:8000`. The Docker Compose configuration provides the same application and backend pairing.

The backend exposes `/health`, `/ready`, and the Runtime Service-backed Cosmos Map API. The frontend waits for readiness before activating the spatial application routes.

## Sprint 4 runtime

The runnable implementation provides:

- a spatial route hierarchy for Cosmos, Base, Room, and Workspace environments
- the approved Version 1 Window capability matrix
- temporary Workspace session lifecycle management
- registry-backed Theme loading with the Cosmos fallback Theme
- one serialized Shell transition queue
- explicit startup, failure, retry, and shutdown states
- a persistent pan/zoom camera with cursor-centered zoom and Project focus
- Project galaxies, universal Node Objects, structural and `Related` Connection representations
- the three documented Version 1 System Projects with physical Prepared Structures
- the global Companion Entity and permanent Ship access to Base
- top-center orientation, geographical neighbors, and Quick Travel
- the fixed, borderless Base environment above the still-active Cosmos setting
- the Main Room cockpit, Knowledge and Creation furniture, seated Companion, Pet, and Workshop door
- one additional Workshop Room with four empty physical Workspace Slots
- serialized environment transitions between Cosmos, Base, and Rooms
- persistent Workspace definitions opening as temporary active sessions
- one fixed, header-bearing Workspace Environment Window above the originating Room
- a calm empty Canvas and compact Tool Area for newly opened Workspaces
- isolated Direct and Workspace Tool Instance lifecycles
- multiple contained Tool Windows with movement, resizing, focus, Close, and boundary recovery
- SQLite-backed restoration of open Tool instances, bounds, focus order, Tool state, selection, filters, camera, and fixed Panel configuration

The Files, Archive, Capture, Review, and Journeyman Tool capabilities are implemented in Sprint 5.

## Architectural authority

Implementation decisions must follow, in order:

1. `docs/Product_Bible_V2`
2. `docs/Experience_V1` for user-facing behavior
3. `docs/Architecture_Review_V3.md` as the synchronized Version 1 contract

Mettipedia is a read-only implementation reference, never an architectural authority.
