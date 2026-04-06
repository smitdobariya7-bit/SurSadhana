import os
from fastapi.testclient import TestClient
from importlib.util import spec_from_file_location, module_from_spec

# Load the `main.py` module directly from file path to avoid import path issues
test_dir = os.path.dirname(__file__)
main_path = os.path.abspath(os.path.join(test_dir, '..', 'main.py'))
spec = spec_from_file_location('ml_service_main', main_path)
main = module_from_spec(spec)
spec.loader.exec_module(main)


class DummyEngine:
    def search_similar(self, query, top_k=3):
        return [{'score': 0.1, 'text': 'Sample context about Yaman', 'meta': {}}]

    def call_llm(self, query, contexts):
        return {
            'answer': 'Practice slow alaaps and pay attention to Sa.',
            'related_raag': 'Yaman',
            'practice_tip': 'Use tanpura drone and practice slowly.',
            'difficulty_level': 'Beginner'
        }


def test_query_endpoint(monkeypatch):
    # Patch get_engine to return a dummy engine to avoid heavy model loads
    monkeypatch.setattr(main, 'get_engine', lambda: DummyEngine())
    client = TestClient(main.app)

    resp = client.post('/api/ai/query', json={'question': 'How to practice Yaman?'})
    assert resp.status_code == 200
    data = resp.json()
    assert 'answer' in data
    assert 'related_raag' in data
    assert 'practice_tip' in data
    assert 'difficulty_level' in data


def test_ingest_text(monkeypatch, tmp_path):
    # Use dummy engine
    monkeypatch.setattr(main, 'get_engine', lambda: DummyEngine())
    client = TestClient(main.app)

    resp = client.post('/api/ai/ingest', data={'text': 'Test ingest content'})
    assert resp.status_code == 200
    body = resp.json()
    assert body.get('status') == 'success'
    assert 'path' in body
    # ensure file exists
    assert os.path.exists(body['path'])
