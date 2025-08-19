from fastapi import FastAPI

from app.api.routes.match import router as match_router


def create_app() -> FastAPI:
    app = FastAPI(title="Matcher Service", version="0.1.0")
    app.include_router(match_router)
    return app


app = create_app() 