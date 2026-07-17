from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from starlette.applications import Starlette
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Route

from cosmos import __version__
from cosmos.bootstrap import CosmosRuntime
from cosmos.config import RuntimeSettings
from cosmos.runtime import RuntimeContext
from cosmos.services import RuntimeServiceError


async def health(_: Request) -> JSONResponse:
    return JSONResponse({"service": "cosmos", "status": "ok", "version": __version__})


async def readiness(request: Request) -> JSONResponse:
    runtime: CosmosRuntime = request.app.state.runtime
    ready = runtime.ready()
    return JSONResponse(
        {"service": "cosmos", "status": "ready" if ready else "not_ready"},
        status_code=200 if ready else 503,
    )


async def cosmos_map(request: Request) -> JSONResponse:
    try:
        return JSONResponse(request.app.state.runtime.cosmos_map.snapshot(_local_owner_context()))
    except RuntimeServiceError as error:
        return _service_error(error)


async def base_snapshot(request: Request) -> JSONResponse:
    try:
        return JSONResponse(request.app.state.runtime.base.snapshot(_local_owner_context()))
    except RuntimeServiceError as error:
        return _service_error(error)


async def update_camera(request: Request) -> JSONResponse:
    try:
        payload = await _json_object(request)
        value = request.app.state.runtime.cosmos_map.update_camera(
            _number(payload, "x"),
            _number(payload, "y"),
            _number(payload, "zoom"),
            _local_owner_context(),
        )
        return JSONResponse(value)
    except RuntimeServiceError as error:
        return _service_error(error)


async def move_node(request: Request) -> JSONResponse:
    try:
        payload = await _json_object(request)
        node = request.app.state.runtime.cosmos_map.move_node(
            request.path_params["object_id"],
            _number(payload, "x"),
            _number(payload, "y"),
            _local_owner_context(),
        )
        return JSONResponse(
            {
                "objectId": node.identity.object_id,
                "x": node.properties["position_x"],
                "y": node.properties["position_y"],
            }
        )
    except RuntimeServiceError as error:
        return _service_error(error)


async def companion_message(request: Request) -> JSONResponse:
    try:
        payload = await _json_object(request)
        message = payload.get("message")
        if not isinstance(message, str):
            raise RuntimeServiceError("validation_failed", "Conversation message must be a string.")
        owner = _local_owner_context()
        snapshot = request.app.state.runtime.cosmos_map.snapshot(owner)
        focused = snapshot["focusedProjectId"]
        context = owner
        if isinstance(focused, str):
            context = _local_owner_context((focused,), focused)
        reply = request.app.state.runtime.companion.reply(message, context)
        return JSONResponse({"message": reply.message, "mode": reply.mode})
    except RuntimeServiceError as error:
        return _service_error(error)


def create_app(
    settings: RuntimeSettings | None = None,
    runtime: CosmosRuntime | None = None,
) -> Starlette:
    active_settings = settings or RuntimeSettings.from_environment()
    active_runtime = runtime or CosmosRuntime.build(active_settings)

    @asynccontextmanager
    async def lifespan(app: Starlette) -> AsyncIterator[None]:
        active_runtime.initialize()
        app.state.runtime = active_runtime
        try:
            yield
        finally:
            active_runtime.shutdown()

    app = Starlette(
        debug=False,
        routes=[
            Route("/health", health),
            Route("/ready", readiness),
            Route("/cosmos/map", cosmos_map),
            Route("/base", base_snapshot),
            Route("/cosmos/camera", update_camera, methods=["PUT"]),
            Route("/objects/{object_id:str}/position", move_node, methods=["PUT"]),
            Route("/companion/messages", companion_message, methods=["POST"]),
        ],
        lifespan=lifespan,
    )
    app.state.runtime = active_runtime

    if active_settings.cors_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=list(active_settings.cors_origins),
            allow_methods=["GET", "POST", "PUT"],
            allow_headers=["*"],
        )

    return app


def _local_owner_context(
    project_scope_ids: tuple[str, ...] = (), focused_project_id: str | None = None
) -> RuntimeContext:
    return RuntimeContext(
        project_scope_ids=project_scope_ids,
        focused_project_id=focused_project_id,
        permissions=frozenset(
            {
                "objects.read",
                "objects.write",
                "projects.read",
                "projects.write",
                "relationships.read",
                "relationships.write",
                "runtime_state.read",
                "runtime_state.write",
            }
        ),
    )


async def _json_object(request: Request) -> dict[str, object]:
    try:
        payload = await request.json()
    except ValueError as error:
        raise RuntimeServiceError("validation_failed", "Request body must contain valid JSON.") from error
    if not isinstance(payload, dict):
        raise RuntimeServiceError("validation_failed", "Request body must be a JSON object.")
    return payload


def _number(payload: dict[str, object], key: str) -> float:
    value = payload.get(key)
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise RuntimeServiceError("validation_failed", f"{key} must be a number.")
    return float(value)


def _service_error(error: RuntimeServiceError) -> JSONResponse:
    status = 403 if error.code == "permission_denied" else 404 if error.code == "object_not_found" else 422
    return JSONResponse({"code": error.code, "message": str(error)}, status_code=status)
