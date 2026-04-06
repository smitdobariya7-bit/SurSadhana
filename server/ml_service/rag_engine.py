import os
import glob
import json
import pickle
from typing import List, Dict, Any

import numpy as np
import threading
from sentence_transformers import SentenceTransformer
import faiss

try:
    import openai
except Exception:
    openai = None


class RAGEngine:
    def __init__(self,
                 model_name: str = 'all-MiniLM-L6-v2',
                 index_path: str = 'faiss_index.index',
                 map_path: str = 'index_map.pkl',
                 data_dir: str = None):
        self.model_name = model_name
        self.model = SentenceTransformer(model_name)
        self.index_path = os.path.join(os.path.dirname(__file__), index_path)
        self.map_path = os.path.join(os.path.dirname(__file__), map_path)
        self.data_dir = data_dir or os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'data'))

        self.index = None
        self.id_to_chunk: Dict[int, Dict[str, Any]] = {}
        self.lock = threading.RLock()

    # ----- DATA LOADING & CHUNKING -----
    def load_dataset(self) -> List[Dict[str, Any]]:
        """Load text files from `self.data_dir`. Supports .txt, .md, .json files.
        Returns list of {'id': id, 'text': text, 'meta': {...}}"""
        docs = []
        if not os.path.isdir(self.data_dir):
            return docs

        file_patterns = ['**/*.txt', '**/*.md', '**/*.json']
        idx = 0
        for pat in file_patterns:
            for path in glob.glob(os.path.join(self.data_dir, pat), recursive=True):
                try:
                    if path.lower().endswith('.json'):
                        with open(path, 'r', encoding='utf-8') as f:
                            data = json.load(f)
                            # If JSON is a list of docs
                            if isinstance(data, list):
                                for item in data:
                                    text = item.get('text') or item.get('content') or json.dumps(item)
                                    meta = {k: v for k, v in item.items() if k != 'text' and k != 'content'}
                                    docs.append({'id': f'doc_{idx}', 'text': text, 'meta': meta})
                                    idx += 1
                            elif isinstance(data, dict):
                                text = data.get('text') or data.get('content') or json.dumps(data)
                                meta = {k: v for k, v in data.items() if k != 'text' and k != 'content'}
                                docs.append({'id': f'doc_{idx}', 'text': text, 'meta': meta})
                                idx += 1
                            else:
                                docs.append({'id': f'doc_{idx}', 'text': json.dumps(data), 'meta': {}})
                                idx += 1
                    else:
                        with open(path, 'r', encoding='utf-8') as f:
                            text = f.read()
                            docs.append({'id': f'doc_{idx}', 'text': text, 'meta': {'source': os.path.basename(path)}})
                            idx += 1
                except Exception:
                    continue

        return docs

    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """Simple character-based chunking. Returns list of chunk strings."""
        if not text:
            return []
        text = text.replace('\r\n', '\n')
        chunks = []
        start = 0
        L = len(text)
        while start < L:
            end = min(start + chunk_size, L)
            chunk = text[start:end]
            chunks.append(chunk)
            start = end - overlap
            if start < 0:
                start = 0
            if start >= L:
                break
        return chunks

    # ----- EMBEDDINGS & FAISS -----
    def build_index(self, chunk_size: int = 1000, overlap: int = 200, batch_size: int = 64):
        with self.lock:
            docs = self.load_dataset()
        all_chunks = []
        id_counter = 0
        for d in docs:
            chunks = self.chunk_text(d['text'], chunk_size=chunk_size, overlap=overlap)
            for c in chunks:
                all_chunks.append({'id': id_counter, 'text': c, 'meta': d.get('meta', {})})
                id_counter += 1

        if not all_chunks:
            # create empty index
            dim = self.model.get_sentence_embedding_dimension()
                self.index = faiss.IndexFlatL2(dim)
                self.id_to_chunk = {}
                return
            texts = [c['text'] for c in all_chunks]
            embeddings = self.model.encode(texts, batch_size=batch_size, show_progress_bar=True, convert_to_numpy=True)

            dim = embeddings.shape[1]
            self.index = faiss.IndexFlatL2(dim)
            self.index.add(embeddings)

            self.id_to_chunk = {c['id']: {'text': c['text'], 'meta': c['meta']} for c in all_chunks}

            # persist
            faiss.write_index(self.index, self.index_path)
            with open(self.map_path, 'wb') as f:
                pickle.dump(self.id_to_chunk, f)

    def load_index(self):
        with self.lock:
            if os.path.exists(self.index_path) and os.path.exists(self.map_path):
                try:
                    self.index = faiss.read_index(self.index_path)
                    with open(self.map_path, 'rb') as f:
                        self.id_to_chunk = pickle.load(f)
                except Exception:
                    self.index = None
                    self.id_to_chunk = {}

    def ensure_index(self):
        with self.lock:
            if self.index is None:
                self.load_index()
            if self.index is None:
                # build a fresh index
                self.build_index()

    def search_similar(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Return top_k similar chunks for the query."""
        with self.lock:
            self.ensure_index()
            if self.index is None or len(self.id_to_chunk) == 0:
                return []

            q_emb = self.model.encode([query], convert_to_numpy=True)
            D, I = self.index.search(q_emb, top_k)
            results = []
            for score, idx in zip(D[0], I[0]):
                if idx < 0:
                    continue
                chunk = self.id_to_chunk.get(int(idx))
                if chunk:
                    results.append({'score': float(score), 'text': chunk['text'], 'meta': chunk.get('meta', {})})
            return results

    # ----- LLM CALL -----
    def call_llm(self, query: str, contexts: List[str]) -> Dict[str, Any]:
        """Call an LLM (OpenAI if available) with context and query to produce structured JSON output.
        Fallback returns a heuristic answer when OpenAI not configured."""
        system_prompt = (
            "You are an expert Indian classical music tutor. Use the provided context snippets to answer the user's question. "
            "Return a JSON object with fields: answer, related_raag, practice_tip, difficulty_level. "
            "Be concise and helpful."
        )

        context_text = "\n\n--- Context Snippets ---\n\n" + "\n\n".join(contexts)
        user_prompt = f"User question: {query}\n\nContext:{context_text}\n\nProvide a JSON response."

        if openai and os.environ.get('OPENAI_API_KEY'):
            openai.api_key = os.environ.get('OPENAI_API_KEY')
            try:
                resp = openai.ChatCompletion.create(
                    model=os.environ.get('OPENAI_MODEL', 'gpt-3.5-turbo'),
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.2,
                    max_tokens=512,
                )
                text = resp.choices[0].message.content
                # Expect JSON in response; try to parse
                try:
                    parsed = json.loads(text)
                    return parsed
                except Exception:
                    # If model returns text, wrap into answer field
                    return {"answer": text, "related_raag": "", "practice_tip": "", "difficulty_level": "Beginner"}
            except Exception as e:
                return {"answer": f"LLM call failed: {e}", "related_raag": "", "practice_tip": "", "difficulty_level": "Beginner"}

        # Fallback heuristic
        joined = "\n".join(contexts)
        # crude heuristics: find first occurrence of a Raag name from meta or common words
        related_raag = "General"
        possible = []
        for c in contexts:
            lower = c.lower()
            for token in ['yaman', 'bhimpalasi', 'bairagi', 'kafi', 'malkauns', 'bhairav', 'todi', 'tordasi', 'marwa', 'bhairavi']:
                if token in lower:
                    possible.append(token)
        related_raag = possible[0] if possible else 'General'

        practice_tip = "Practice slowly with a tanpura drone, focus on correct svara intonation."
        difficulty = "Beginner"
        answer = f"Based on the retrieved context, here's a short answer to: {query}. Related topics: {', '.join(set(possible)) if possible else 'general music theory.'}"
        return {"answer": answer, "related_raag": related_raag, "practice_tip": practice_tip, "difficulty_level": difficulty}


# Singleton engine for module-level import
_engine: RAGEngine = None

def get_engine() -> RAGEngine:
    global _engine
    if _engine is None:
        _engine = RAGEngine()
        _engine.ensure_index()
    return _engine
