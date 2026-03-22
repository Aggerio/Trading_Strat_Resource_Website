import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import strategies, lessons, quizzes, glossary, progress, simulator
from app.seed_db import seed_database

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Trading Strategy Trainer", version="1.0.0")

_cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:5173")
cors_origins = [o.strip() for o in _cors_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(strategies.router, prefix="/api/strategies", tags=["strategies"])
app.include_router(lessons.router, prefix="/api/lessons", tags=["lessons"])
app.include_router(quizzes.router, prefix="/api/quizzes", tags=["quizzes"])
app.include_router(glossary.router, prefix="/api/glossary", tags=["glossary"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
app.include_router(simulator.router, prefix="/api/simulator", tags=["simulator"])


@app.on_event("startup")
def on_startup():
    seed_database()


@app.get("/api/health")
def health():
    return {"status": "ok"}
