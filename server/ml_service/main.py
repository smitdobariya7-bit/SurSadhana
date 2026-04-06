from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import time
import uuid
import asyncio
import logging

try:
    # Prefer relative import when used as a package
    from .rag_engine import get_engine
except Exception:
    # Fallback for running as a script (python main.py)
    from rag_engine import get_engine

logger = logging.getLogger("ml_service")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
logger.addHandler(handler)

app = FastAPI(title="SurSadhana AI Service")

# Allow cross-origin requests from the frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str


@app.on_event("startup")
async def startup_event():
    # Initialize RAG engine (load or build index)
    try:
        _ = get_engine()
        logger.info("RAG engine initialized")
    except Exception as e:
        logger.exception("RAG engine initialization failed: %s", e)


@app.post("/api/ai/ingest")
async def ingest(text: Optional[str] = Form(None), file: Optional[UploadFile] = File(None)):
    """Ingest text or uploaded file into the project's /data folder.

    Accepts either a form `text` field or an uploaded file (UploadFile).
    Saves the content to `data/` with a unique name.
    Does not rebuild the index automatically; call `/api/ai/train` after ingest.
    """
    engine = get_engine()
    data_dir = engine.data_dir
    os.makedirs(data_dir, exist_ok=True)

    if (not text) and (not file):
        raise HTTPException(status_code=400, detail="Provide either `text` or `file` for ingestion")

    try:
        if file:
            filename = file.filename or f"upload-{int(time.time())}"
            _, ext = os.path.splitext(filename)
            ext = ext.lower() or '.txt'
            allowed = {'.txt', '.md', '.json'}
            if ext not in allowed:
                raise HTTPException(status_code=400, detail=f"File type {ext} not allowed. Allowed: {', '.join(allowed)}")

            unique = f"ingest_{int(time.time())}_{uuid.uuid4().hex}{ext}"
            dest = os.path.join(data_dir, unique)
            contents = await file.read()
            # Limit file size (e.g., 10MB)
            if len(contents) > 10 * 1024 * 1024:
                raise HTTPException(status_code=400, detail="File too large (max 10MB)")
            with open(dest, 'wb') as f:
                f.write(contents)
            logger.info("Ingested file saved: %s", dest)
            return {"status": "success", "path": dest}

        if text:
            unique = f"ingest_{int(time.time())}_{uuid.uuid4().hex}.txt"
            dest = os.path.join(data_dir, unique)
            with open(dest, 'w', encoding='utf-8') as f:
                f.write(text)
            logger.info("Ingested text saved: %s", dest)
            return {"status": "success", "path": dest}

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Ingest failed: %s", e)
        raise HTTPException(status_code=500, detail="Ingestion failed")


@app.post("/api/ai/train")
async def train(rebuild: Optional[bool] = Form(True)):
    """Rebuild the FAISS index by recomputing embeddings for data in /data.

    This runs the engine.build_index() in a background thread to avoid blocking the event loop.
    Returns status and number of indexed chunks when complete.
    """
    engine = get_engine()

    try:
        # Run build_index in a thread to avoid blocking
        logger.info("Starting training/building FAISS index...")
        await asyncio.to_thread(engine.build_index)
        # reload index to ensure in-memory structures are consistent
        await asyncio.to_thread(engine.load_index)
        count = len(engine.id_to_chunk) if engine.id_to_chunk else 0
        logger.info("Index rebuild completed. Chunks indexed: %d", count)
        return {"status": "completed", "indexed_chunks": count}
    except Exception as e:
        logger.exception("Training failed: %s", e)
        raise HTTPException(status_code=500, detail=f"Training failed: {e}")


@app.post("/api/ai/query")
async def query(req: QueryRequest):
    if not req.question or not req.question.strip():
        raise HTTPException(status_code=400, detail="Question is required")

    engine = get_engine()

    # 1) Convert query to embedding and retrieve top 3 chunks
    try:
        hits = engine.search_similar(req.question, top_k=3)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {e}")

    contexts = [h['text'] for h in hits]

    # 2) Call LLM (or fallback) with contexts and query, expecting structured response
    try:
        llm_output = engine.call_llm(req.question, contexts)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM call failed: {e}")

    # Ensure response has required fields
    response = {
        'answer': llm_output.get('answer', ''),
        'related_raag': llm_output.get('related_raag', ''),
        'practice_tip': llm_output.get('practice_tip', ''),
        'difficulty_level': llm_output.get('difficulty_level', 'Beginner')
    }

    return response


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
