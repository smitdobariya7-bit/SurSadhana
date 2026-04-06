# SurSadhana AI Microservice (FastAPI)

This microservice is a minimal FastAPI app used as a placeholder for the AI music trainer backend.

Files:

- `main.py` - FastAPI application exposing `POST /api/ai/query` that accepts JSON `{ "question": "..." }` and returns a dummy JSON response.
- `requirements.txt` - Python dependencies to install in a virtualenv.

Run locally:

```bash
cd server/ml_service
python -m venv .venv
source .venv/bin/activate   # on Windows: .\.venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

The service will be available at `http://localhost:8000/api/ai/query`.

Next steps: hook this service to a RAG pipeline, add endpoints for ingestion/training, and secure it behind authentication.
