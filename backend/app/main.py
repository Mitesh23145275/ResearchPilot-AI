from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.upload import router as upload_router
from app.routes.knowledge import router as knowledge_router
from app.routes.chat import router as chat_router
from app.routes.research import router as research_router
from app.routes.report import router as report_router
from app.routes.stats import router as stats_router
from app.routes.system import router as system_router
from app.routes.web import router as web_router
from app.routes.ai import router as ai_router
from app.websocket.socket import router as websocket_router
from app.routes import pdf

app = FastAPI(
    title="Multi-Agent Research Assistant",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(knowledge_router)
app.include_router(chat_router)
app.include_router(research_router)
app.include_router(report_router)
app.include_router(stats_router)
app.include_router(system_router)
app.include_router(web_router)
app.include_router(ai_router)
app.include_router(websocket_router)
app.include_router(pdf.router)


@app.get("/")
def root():
    return {"message": "Backend is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}