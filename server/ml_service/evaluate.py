"""
Evaluation utilities for the RAG engine.

This script provides simple retrieval and end-to-end evaluation routines.
It looks for a test dataset at `data/test_qa.json` (list of {question, answer}).
If none is found, it will run a small synthetic test set.

Metrics:
- retrieval_recall@k: whether any retrieved chunk contains the expected answer text (substring match)
- avg_semantic_similarity: cosine similarity between embedding of model answer and reference answer (using sentence-transformers)

Usage:
    python evaluate.py

Note: This uses the local RAG engine. Ensure the engine index exists or be prepared for build time.
"""
import os
import json
import math
from typing import List

from sentence_transformers import SentenceTransformer
from rag_engine import get_engine


def load_test_qa(path: str):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    # fallback synthetic dataset
    return [
        {"question": "How should a beginner practice Raag Yaman?", "answer": "Start with slow alaaps and maintain Sa as reference."},
        {"question": "What is the typical vadi-samavadi pair in Raag Bhairav?", "answer": "Vadi is Sa, Samavadi is Pa in some interpretations."},
        {"question": "Any tips for improving breath control while singing?", "answer": "Practice long sustained notes and breathing exercises."}
    ]


def retrieval_recall_at_k(engine, test_qas, k=3):
    hits = []
    for qa in test_qas:
        q = qa['question']
        expected = qa.get('answer','').lower()
        retrieved = engine.search_similar(q, top_k=k)
        found = False
        for r in retrieved:
            if expected and expected in r['text'].lower():
                found = True
                break
        hits.append(1 if found else 0)
    return sum(hits)/len(hits)


def semantic_similarity_score(model, refs: List[str], preds: List[str]):
    # compute cosine similarity between embeddings
    ref_emb = model.encode(refs, convert_to_numpy=True)
    pred_emb = model.encode(preds, convert_to_numpy=True)
    sims = []
    for r, p in zip(ref_emb, pred_emb):
        num = (r @ p)
        den = ( (r*r).sum()**0.5 ) * ( (p*p).sum()**0.5 )
        sims.append(float(num/den) if den>0 else 0.0)
    return sum(sims)/len(sims)


def end_to_end_eval(engine, test_qas):
    model = SentenceTransformer(engine.model_name)
    refs = []
    preds = []
    for qa in test_qas:
        q = qa['question']
        ref = qa.get('answer','')
        refs.append(ref)
        retrieved = engine.search_similar(q, top_k=3)
        contexts = [r['text'] for r in retrieved]
        out = engine.call_llm(q, contexts)
        pred = out.get('answer','')
        preds.append(pred)

    sim = semantic_similarity_score(model, refs, preds)
    return sim


def main():
    data_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'test_qa.json'))
    test_qas = load_test_qa(data_path)
    engine = get_engine()

    print('Running retrieval recall@3...')
    recall = retrieval_recall_at_k(engine, test_qas, k=3)
    print(f'Retrieval recall@3: {recall:.3f}')

    print('Running end-to-end semantic similarity (may call LLM fallback)...')
    sim = end_to_end_eval(engine, test_qas)
    print(f'Avg semantic similarity (ref vs pred): {sim:.3f}')


if __name__ == '__main__':
    main()
