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


async def health(_: Request) -> JSONResponse:
    return JSONResponse({"service": "cosmos", "status": "ok", "version": __version__})


async def readiness(request: Request) -> JSONResponse:
    runtime: CosmosRuntime = request.app.state.runtime
    ready = runtime.ready()
    return JSONResponse(
        {"service": "cosmos", "status": "ready" if ready else "not_ready"},
        status_code=200 if ready else 503,
    )


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
        routes=[Route("/health", health), Route("/ready", readiness)],
        lifespan=lifespan,
    )
    app.state.runtime = active_runtime

    if active_settings.cors_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=list(active_settings.cors_origins),
            allow_methods=["GET"],
            allow_headers=["*"],
        )

    return app
