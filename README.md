# Cosmos

Cosmos is a new implementation of the personal operating system defined by `Product_Bible_V2`, `Experience_V1`, and `Architecture_Review_V3`.

Sprint 1 adds the runnable application framework without implementing Capture, Knowledge, Companion, Base, Cosmos Map, or productive Workspace features.

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

The backend foundation exposes `/health` and `/ready`. The frontend waits for readiness before activating the spatial application routes.

## Sprint 1 runtime

The application framework provides:

- a spatial route hierarchy for Cosmos, Base, Room, and Workspace environments
- the approved Version 1 Window capability matrix
- temporary Workspace session lifecycle management
- registry-backed Theme loading with the Cosmos fallback Theme
- one serialized Shell transition queue
- explicit startup, failure, retry, and shutdown states

These are framework contracts only. Their user-facing environments and Tools are implemented by later roadmap Sprints.

## Architectural authority

Implementation decisions must follow, in order:

1. `docs/Product_Bible_V2`
2. `docs/Experience_V1` for user-facing behavior
3. `docs/Architecture_Review_V3.md` as the synchronized Version 1 contract

Mettipedia is a read-only implementation reference, never an architectural authority.
