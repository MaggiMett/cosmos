# Cosmos

Cosmos is a new implementation of the personal operating system defined by `Product_Bible_V2`, `Experience_V1`, and `Architecture_Review_V3`.

Sprint 0 contains development infrastructure only. It deliberately provides no Capture, Knowledge, Companion, Theme, Workspace, or other user-facing implementation.

## Repository map

```text
backend/       Python Core, Runtime contracts, Persistence, and API bootstrap
frontend/      Headless Vue/TypeScript client-runtime foundation
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

Run the foundation API after bootstrap:

```text
.venv/Scripts/python -m cosmos
```

On Unix-like systems the interpreter is `.venv/bin/python`.

The only HTTP endpoints in Sprint 0 are `/health` and `/ready`.

## Architectural authority

Implementation decisions must follow, in order:

1. `docs/Product_Bible_V2`
2. `docs/Experience_V1` for user-facing behavior
3. `docs/Architecture_Review_V3.md` as the synchronized Version 1 contract

Mettipedia is a read-only implementation reference, never an architectural authority.
