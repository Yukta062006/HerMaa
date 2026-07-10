from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .api.v1 import auth, cycle, ai, user

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION, description="HerMaa - AI-powered women's healthcare API")

app.add_middleware(CORSMiddleware, allow_origins=settings.ALLOWED_ORIGINS, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(cycle.router, prefix=settings.API_PREFIX)
app.include_router(ai.router, prefix=settings.API_PREFIX)
app.include_router(user.router, prefix=settings.API_PREFIX)


@app.get("/")
async def root():
    return {"name": "HerMaa API", "version": settings.APP_VERSION, "status": "healthy", "tagline": "From Her First Period to Every Stage of Life."}


@app.get("/health")
async def health():
    return {"status": "healthy", "services": {"api": "running", "ai": "available"}}
